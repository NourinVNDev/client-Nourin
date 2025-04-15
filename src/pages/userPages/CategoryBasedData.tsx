import { useEffect, useState } from 'react';
import { FaHeart, FaRegHeart, FaBuilding, FaMapMarkerAlt } from 'react-icons/fa';
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





  const handleButtonClick = async (postId: string) => {
    console.log("Same");

    try {
      console.log("Yes");

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
        <div className="w-full max-w-7xl flex flex-col items-center">
          <div className="relative flex items-center bg-white rounded-full shadow-lg w-full max-w-lg mt-6">

            <SearchBar onSelectLocation={(coordinates, placeName) => handleSearchChange(coordinates, placeName)}
              initialValue={searchQuery}
            />
          </div>


          {/* <div className="mt-6 flex flex-col md:flex-row justify-center bg-white p-6 rounded-2xl shadow-xl w-full max-w-2xl gap-6">
 */}



            {/* Sort Dropdown */}
            {/* <div className="flex items-center space-x-3 w-full md:w-auto">
              <span className="font-semibold text-lg">Sort By:</span>
              <select className="border px-4 py-2 rounded-lg bg-white text-black text-lg w-full md:w-auto" onChange={handlePriceChange}
                value={selectedPrice}>
                <option>Price: Low - High</option>
                <option>Price: High - Low</option>
              </select>
            </div>
          </div> */}

          <br /><br />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-4">
            {filteredData && filteredData.length > 0 ? (
              filteredData.map((post: any, index: number) => (
                <div
                  key={post._id || index}
                  className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100 transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 w-full max-w-[400px] mx-auto"
                >
                  
                  <div className="relative group bg-white rounded-lg shadow-md">
  {/* Discount Badge */}
  {post.typesOfTickets && post.typesOfTickets[0]?.offerDetails?.offerPercentage && (
    <div className="absolute top-4 right-4 z-10 bg-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
      {post.typesOfTickets[0].offerDetails.offerPercentage}% OFF
    </div>
  )}

  <div className="relative overflow-hidden rounded-lg">
    <img
      src={post.images || "fallback.jpg"}
      className="w-full h-72 object-cover cursor-pointer"
      alt={post.title}
      onClick={() => handleButtonClick(post._id)}
    />
    <div className="absolute inset-0 bg-purple-300 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"></div>
  </div>
</div>



                  {/* Event Details */}
                  <div className="p-6 space-y-4">
                    <h2 className="text-2xl font-bold text-gray-800 truncate">{post.eventName}</h2>

                    {/* Price Display */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-green-600">₹{post.typesOfTickets[0].Amount}</span>
                        <span className="text-sm text-gray-500">per ticket</span>
                      </div>
                      {post.typesOfTickets[0]?.offerDetails?.offerPercentage && (
                        <span className="text-sm text-emerald-600 font-medium">
                          Save {post.typesOfTickets[0].offerDetails.offerPercentage}%
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-3 text-gray-600">
                      <FaBuilding className="text-blue-500 flex-shrink-0" />
                      <span className="text-sm truncate">{post.companyName}</span>
                    </div>

                    <div className="flex items-center space-x-3 text-gray-600">
                      <FaMapMarkerAlt className="text-red-500 flex-shrink-0" />
                      <span className="text-sm truncate">{post.address.split(' ').slice(0, 3).join(' ').replace(/,\s*$/, '') || "Unknown Location"}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleLike(index, post._id)}
                    className={`w-full py-4 flex items-center justify-center space-x-3 font-bold transition-all duration-300 rounded-lg shadow-md 
    ${interactions[index]?.liked
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:scale-105 shadow-lg"
                        : "bg-blue-100 text-blue-700 border border-blue-300 hover:bg-blue-200 hover:shadow-md"
                      }`}
                  >
                    {interactions[index]?.liked ? (
                      <>
                        <FaHeart className="text-2xl animate-bounce" />
                        <span>Interested</span>
                      </>
                    ) : (
                      <>
                        <FaRegHeart className="text-2xl" />
                        <span>Mark Interest</span>
                      </>
                    )}
                  </button>


                </div>
              ))
            ) : (
              <div className="text-center text-gray-600 col-span-full py-12">
                <div className="text-7xl mb-4 opacity-30">🎫</div>
                <h3 className="text-2xl font-semibold mb-2">No Events Found</h3>
                <p className="text-gray-500">Try adjusting your search or filters</p>
              </div>
            )}
          </div>






        </div>
      </div>
      <Footer />
    </div>
  );
};
export default CategoryBasedData;