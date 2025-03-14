import { useEffect, useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/userComponents/Headers';
import { getEventDataDetails, handleLikePost, handlePostDetails } from '../../service/userServices/userPost';
import Footer from '../../components/userComponents/Footer';
import useSocket from '../../utils/SocketContext';
import { FaSearch } from "react-icons/fa";
import SocialEvents from '../../assets/SocialEvents.avif'
type Like = {
  user: string;
  _id: string;
  createdAt: string;
};
const CategoryBasedData = () => {
  const { id } = useParams();
  const {socket}=useSocket()
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [categoryName,setCategoryNames]=useState<string[]>([])
  const [interactions, setInteractions] = useState<{ [key: number]: { liked: boolean, newComment: string, comments: string[] } }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory,setSelectedCategory]=useState('');
  const [selectedPrice,setSelectedPrice]=useState('');
  const [filteredData, setFilteredData] = useState(parsedData); // Store filtered events
  const handleSearchChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filteredEvents = parsedData.filter((post) =>
      post.location?.address.toLowerCase().includes(query)
    );
    setFilteredData(filteredEvents); // Update the filtered data
  };
  const handleButtonClick = async (postId: string) => {
    try {
      const result = await handlePostDetails(postId);
      if (result?.message === 'Retrive Post Data successfully') {
        // navigate(`/singlePostDetails?data=${encodeURIComponent(JSON.stringify(result))}`);
        navigate('/singlePostDetails', { state: { data: result } });

      } else {
        console.error('Unexpected response message or data structure.');
      }
    } catch (error) {
      console.error('Error fetching post details:', error);
    }
  };

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        if (!id) {
          console.error('ID is undefined');
          return;
        }
        const result = await getEventDataDetails(id);
        console.log("Nourii Safar",result.user.category.Events);
        
        setParsedData(result.user.category.Events || []);

       
   
        const category = result.user.category; // Access the category object
        console.log("Better",category);
        
        setCategoryNames([category.categoryName]);
      } catch (error) {
        console.error('Error fetching event details:', error);
      }
    };
    fetchEventDetails();
  }, [id]);
  useEffect(() => {
    const initialInteractions = parsedData.reduce((acc, post, index) => {
      acc[index] = {
        liked: Array.isArray(post.likes) && post.likes.some((like: Like) => like.user === userId),
        comments: Array.isArray(post.comments) ? post.comments.map((c: any) => c.content) : [],
        newComment: ''
      };
      return acc;
    }, {} as typeof interactions);
    
    console.log('Initial Interactions:', initialInteractions); // Debugging log
    setInteractions(initialInteractions);
  }, [parsedData, userId]);
  
  const handleLike = async (index: number, postId: string) => {
    console.log("Mad");
  
    // Check if interactions[index] exists
    if (!interactions[index]) {
      console.error(`No interaction found for index: ${index}`);
      return; // Exit if there's no interaction for this index
    }
  
    const newLikedStatus = !interactions[index]?.liked;
    console.log("Setting",newLikedStatus);
    
  
    // Optimistically update UI
    setInteractions((prev) => {
      const updatedInteractions = {
        ...prev,
        [index]: {
          ...prev[index],
          liked: newLikedStatus,
        },
      };
      console.log('Updated Interactions:', updatedInteractions); // Log updated state
      return updatedInteractions;
    });
  
    console.log(`Attempting to ${newLikedStatus ? 'like' : 'unlike'} post with ID: ${postId}`);
    try {
      if (!userId) {
        throw new Error('userId is needed from categoryBasedData');
      }
      const response = await handleLikePost(index, postId, userId);
      console.log('API Response:', response);
  
      if (response.message !== 'User likes successfully') {
        // Revert UI if API call fails
        console.error('Failed to like post, reverting UI');
        setInteractions((prev) => ({
          ...prev,
          [index]: {
            ...prev[index],
            liked: !newLikedStatus, // Revert to the previous liked status
          },
        }));
      }
    } catch (error) {
      console.error('Error liking post:', error);
      // Revert UI in case of error
      setInteractions((prev) => ({
        ...prev,
        [index]: {
          ...prev[index],
          liked: !newLikedStatus, // Revert to the previous liked status
        },
      }));
    }
  };
  useEffect(() => {
    socket?.on("new_comment", ({ postId, comment }) => {
      console.log("checking",postId,comment);
      
      setInteractions((prev) => {
        const newData = { ...prev }; // Clone state object
        const postIndex = parsedData.findIndex((post) => post._id === postId);
        
        if (postIndex === -1) return prev; // If post is not found, return original state
  
        // Ensure comments exist before updating
        if (!newData[postIndex]?.comments) newData[postIndex].comments = [];
  
        // Add new comment without losing previous data
        newData[postIndex] = {
          ...newData[postIndex],
          comments: [comment, ...newData[postIndex].comments],
        };
  
        return newData;
      });
    });
  
    return () => {
      socket?.off("new_comment");
    };
  }, [parsedData, socket]);
  





  useEffect(() => {
    let updatedData = [...parsedData]; // Start with full data
  
    // Apply category filter if selected
    if (selectedCategory) {
      updatedData = updatedData.filter((post) =>
        post.title?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
  
    // Apply search filter if searchQuery exists
    if (searchQuery) {
      updatedData = updatedData.filter((post) =>
        post.location?.address
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }
  
    console.log(selectedPrice, "soumya");
  
    // Apply sorting only if selectedPrice is set
    if (selectedPrice === "Price: Low - High") {
      updatedData.sort((a, b) => a.Amount - b.Amount);
    } else if (selectedPrice === "Price: High - Low") {
      updatedData.sort((a, b) => b.Amount - a.Amount);
    }
  
    setFilteredData(updatedData); // Set the final processed data
  }, [parsedData, selectedCategory, selectedPrice, searchQuery]);
  
  
  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value); // Update the selected category state
  };


  const handlePriceChange=(event:React.ChangeEvent<HTMLSelectElement>)=>{
    setSelectedPrice(event.target.value);
  }




  return (
    <div className="min-h-screen bg-blue-50">
      <Header />
      <div className="bg-[#fdeedc] min-h-screen p-8 flex flex-col items-center">
  {/* Main Content */}
  <h1 className="text-black text-6xl font-bold mb-4 self-start">Events:</h1>
  
  <div className="flex flex-col items-center md:flex-row md:justify-end w-full">
  {/* Image - Right Aligned, Bigger & More Beautiful */}
  <img
    src={SocialEvents}
    alt="Events"
    className="w-[400px] md:w-[600px] lg:w-[750px] xl:w-[900px] 
               h-[200px] md:h-[200px] lg:h-[400px] xl:h-[500px] 
               object-cover rounded-3xl shadow-2xl border-4 border-white"
  />
</div>



</div>

{/* Search & Filters Section */}
<div className="bg-gradient-to-br from-gray-100 to-gray-300 w-full min-h-screen pt-10 pb-10 flex justify-center">
  <div className="w-full max-w-4xl flex flex-col items-center">
    <div className="relative flex items-center bg-white rounded-full shadow-lg w-full max-w-lg mt-6">
      <input
        type="text"
        placeholder="Search location here..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="w-full p-4 pr-12  bg-white rounded-full outline-none text-lg text-black"
      />
      <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600">
        <FaSearch size={24} />
      </button>
    </div>

    {/* Filters - Centered Below Search Bar */}
    <div className="mt-6 flex flex-col md:flex-row justify-center bg-white p-6 rounded-2xl shadow-xl w-full max-w-2xl gap-6">
      {/* Select Event Dropdown */}
      <div className="flex items-center space-x-3 w-full md:w-auto">
  <span className="font-semibold text-lg">Select Event:</span>
  <select
    className="border px-4 py-2 rounded-lg text-lg w-full bg-white text-black md:w-auto"
    onChange={handleCategoryChange} // Add onChange handler
    value={selectedCategory}
  >
    <option value="">Select Category</option> {/* Ensure a default option */}
    {categoryName && categoryName.length > 0 ? (
      categoryName.map((cat: any, index: number) => (
        <option key={index} value={cat}>
          {cat}
        </option>
      ))
    ) : (
      <option disabled>No categories available</option>
    )}
  </select>
</div>


      {/* Sort Dropdown */}
      <div className="flex items-center space-x-3 w-full md:w-auto">
        <span className="font-semibold text-lg">Sort By:</span>
        <select className="border px-4 py-2 rounded-lg bg-white text-black text-lg w-full md:w-auto" onChange={handlePriceChange}
        value={selectedPrice}>
          <option>Price: Low - High</option>
          <option>Price: High - Low</option>
        </select>
      </div>
    </div>

<br /><br />

   
          <div className="w-full px-4 space-y-6">

          {filteredData && filteredData.length> 0 || parsedData && parsedData.length > 0 ? (
      
              filteredData.map((post: any, index: number) => (
                <div
                  key={post._id || index}
                  className="bg-white w-full p-6 rounded-lg shadow-lg border border-gray-200 flex flex-col space-y-4">
                  <div className="flex-1">
                    <span className="block mb-2 text-gray-700 font-medium hover:text-blue-400">
                      {post.companyName}
                      <span className="block text-gray-500 text-sm mb-4">
                        {post.location?.address || "Unknown"}
                      </span>
                    </span>
                    <div className="relative">
  
                    {post.offerDetails?.offerPercentage && (
                      <div className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-md">
                        {post.offerDetails.offerPercentage}% OFF
                      </div>
                    )}

                    {/* Image */}
                    <img
                      src={post.images}
                      className="w-full h-auto object-cover rounded-md mb-4"
                      alt={post.title}
                      onClick={async () => await handleButtonClick(post._id)}
                    />
                  </div>
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        {post.title}
                      </h2>
                      <p className="text-gray-600 text-sm mb-4">{post.content}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleLike(index, post._id)}
                        className={`flex items-center space-x-2 p-3 rounded-lg transition-all duration-300 ${
                          interactions[index]?.liked
                            ? "bg-gradient-to-r from-pink-500 to-red-500 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        } shadow-md hover:shadow-lg transform hover:scale-105`} >
                        {interactions[index]?.liked ? (
                          <>
                            <FaHeart className="text-3xl animate-pulse" />
                            <h4 className="font-bold">You liked the post</h4>
                          </>
                        ) : (
                          <FaRegHeart className="text-3xl" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )
            : (
            <div className="text-center text-gray-600">No events found.</div>
          )}

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default CategoryBasedData;