import { useEffect, useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/userComponents/Headers';
import { getEventDataDetails, handleLikePost, handlePostDetails } from '../../service/userServices/userPost';
import Footer from '../../components/userComponents/Footer';
import useSocket from '../../utils/SocketContext';

import SocialEvents from '../../assets/SocialEvents.avif'
import SearchBar from '../../components/userComponents/SearchBar';

type Like = {
  user: string;
  _id: string;
  createdAt: string;
};
const CategoryBasedData = () => {
  const { id } = useParams();
  const { socket } = useSocket()
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [categoryName, setCategoryNames] = useState<string[]>([])
  const [interactions, setInteractions] = useState<{ [key: number]: { liked: boolean, newComment: string, comments: string[] } }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [filteredData, setFilteredData] = useState(parsedData); // Store filtered events




  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);


  const handleSearchChange = (coords: [number, number], placeName: string) => {
    setSearchQuery(placeName);
    setCoordinates(coords); 
    console.log("Query:", placeName);
    console.log("Coordinates:", coords);

  };


  useEffect(() => {
    let updatedData = [...parsedData];
    console.log("UpdatedData", updatedData);



    if (coordinates && coordinates.length === 2) {

      const [lat, lng] = coordinates;
      updatedData = updatedData.filter((post) => {
        if (!post.location || !post.location.coordinates) return false;

        const [longitude, latitude] = post.location.coordinates;
        console.log("Latitude db", latitude, longitude);
        const distance = haversineDistance(lat, lng, latitude, longitude);
        console.log("Distance check:", post.title, distance);
        return distance <= 10;
      });
    }




    if (selectedPrice === "Price: Low - High") {
      updatedData.sort((a, b) => a.Amount - b.Amount);
    } else if (selectedPrice === "Price: High - Low") {
      updatedData.sort((a, b) => b.Amount - a.Amount);
    }

    console.log("Final filtered data:", updatedData);
    setFilteredData(updatedData);
    console.log("Fill:", filteredData);

  }, [parsedData, selectedCategory, selectedPrice, searchQuery, coordinates]);

  const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const R = 6371;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };



  useEffect(() => {

    console.log("Filtered Data:", filteredData);

  }, [filteredData]);
  const handleButtonClick = async (postId: string) => {
    try {
      const result = await handlePostDetails(postId);
      if (result?.message === 'Retrive Post Data successfully') {

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
        console.log("Nourii Safar", result.user.category.Events);

        setParsedData(result.user.category.Events || []);



        const category = result.user.category;
        console.log("Better", category);

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

    console.log('Initial Interactions:', initialInteractions);
    setInteractions(initialInteractions);
  }, [parsedData, userId]);

  const handleLike = async (index: number, postId: string) => {
    console.log("Mad");


    if (!interactions[index]) {
      console.error(`No interaction found for index: ${index}`);
      return;
    }

    const newLikedStatus = !interactions[index]?.liked;
    console.log("Setting", newLikedStatus);



    setInteractions((prev) => {
      const updatedInteractions = {
        ...prev,
        [index]: {
          ...prev[index],
          liked: newLikedStatus,
        },
      };
      console.log('Updated Interactions:', updatedInteractions);
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

        console.error('Failed to like post, reverting UI');
        setInteractions((prev) => ({
          ...prev,
          [index]: {
            ...prev[index],
            liked: !newLikedStatus,
          },
        }));
      }
    } catch (error) {
      console.error('Error liking post:', error);

      setInteractions((prev) => ({
        ...prev,
        [index]: {
          ...prev[index],
          liked: !newLikedStatus,
        },
      }));
    }
  };
  useEffect(() => {
    socket?.on("new_comment", ({ postId, comment }) => {
      console.log("checking", postId, comment);

      setInteractions((prev) => {
        const newData = { ...prev };
        const postIndex = parsedData.findIndex((post) => post._id === postId);

        if (postIndex === -1) return prev;


        if (!newData[postIndex]?.comments) newData[postIndex].comments = [];


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
    let updatedData = [...parsedData];






    console.log(selectedPrice, "soumya");


    if (selectedPrice === "Price: Low - High") {
      updatedData.sort((a, b) => a.Amount - b.Amount);
    } else if (selectedPrice === "Price: High - Low") {
      updatedData.sort((a, b) => b.Amount - a.Amount);
    }

    setFilteredData(updatedData);
  }, [selectedPrice]);





  const handlePriceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPrice(event.target.value);
  }




  return (
    <div className="min-h-screen bg-blue-50">
      <Header />
      <div className="bg-[#fdeedc] min-h-screen p-8 flex flex-col items-center">

        <h1 className="text-black text-6xl font-bold mb-4 self-start">Events:</h1>

        <div className="flex flex-col items-center md:flex-row md:justify-end w-full">

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

            <SearchBar onSelectLocation={(coordinates, placeName) => handleSearchChange(coordinates, placeName)}
              initialValue={searchQuery}
            />
          </div>


          <div className="mt-6 flex flex-col md:flex-row justify-center bg-white p-6 rounded-2xl shadow-xl w-full max-w-2xl gap-6">

       


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
          <div className="max-w-screen-2xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-10 w-full">

              {filteredData && filteredData.length > 0 ? (
                filteredData.map((post: any, index: number) => (
                  <div
                    key={post._id || index}
                    className="bg-white w-full rounded-lg shadow-md border border-gray-200 flex flex-col overflow-hidden transition-transform duration-300 hover:shadow-lg hover:scale-105"
                  >
                    {/* Image */}
                    <div className="relative">
                      {post.typesOfTickets &&
                        post.typesOfTickets[0]?.offerDetails?.offerPercentage && (
                          <div className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-md">
                            {post.typesOfTickets[0].offerDetails.offerPercentage}% OFF
                          </div>
                        )}


                      <img
                        src={post.images}
                        className="w-full h-56 object-cover"
                        alt={post.title}
                        onClick={async () => await handleButtonClick(post._id)}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6 text-center">
                      <h2 className="text-xl font-bold text-gray-800">{post.title}</h2>

                    </div>

                    {/* Footer */}
                    <div className="p-4 text-center border-t">
                      <span className="block text-gray-700 font-medium">{post.companyName}</span>
                      <span className="block text-gray-500 text-sm">{post.address || "Unknown"}</span>
                    </div>

                    {/* Like Button */}
                    <button
                      onClick={() => handleLike(index, post._id)}
                      className={`flex justify-center items-center space-x-2 p-3 rounded-lg w-full transition-all duration-300 ${interactions[index]?.liked
                        ? "bg-gradient-to-r from-pink-500 to-red-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        } shadow-md hover:shadow-lg`}
                    >
                      {interactions[index]?.liked ? (
                        <>
                          <FaHeart className="text-2xl animate-pulse" />
                          <span className="font-bold">Interested</span>
                        </>
                      ) : (
                        <FaRegHeart className="text-2xl" />
                      )}
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-600 col-span-full">No events found.</div>
              )}
            </div>
          </div>





        </div>
      </div>
      <Footer />
    </div>
  );
};
export default CategoryBasedData;