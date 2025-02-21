import { useEffect, useState } from 'react';
import { FaHeart, FaRegHeart, FaRegCommentDots } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/userComponents/Headers';
import { getEventDataDetails, handleLikePost, handlePostDetails } from '../../service/userServices/userPost';
import Footer from '../../components/userComponents/Footer';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import useSocket from '../../utils/SocketContext';

type Like = {
  user: string;
  _id: string;
  createdAt: string;
};

const CategoryBasedData = () => {
  const { id } = useParams();
  const {socket}=useSocket()
  const navigate = useNavigate();
  const [userName,setUserName]=useState('')
  const userId = localStorage.getItem('userId');



  const [openModalIndex, setOpenModalIndex] = useState<number | null>(null);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [interactions, setInteractions] = useState<{ [key: number]: { liked: boolean, newComment: string, comments: string[] } }>({});

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
        setParsedData(result.user.category.Events || []);
      } catch (error) {
        console.error('Error fetching event details:', error);
      }
    };
    fetchEventDetails();
  }, [id]);

  // useEffect(() => {
  //   const initialInteractions = parsedData.reduce((acc, post, index) => {
  //     acc[index] = {
  //       liked: Array.isArray(post.likes) && post.likes.some((like: Like) => like.user === userId),
  //       comments: Array.isArray(post.comments) ? post.comments.map((c: any) => c.content) : [],
  //       newComment: ''
  //     };
  //     return acc;
  //   }, {} as typeof interactions);
  //   setInteractions(initialInteractions);
  // }, [parsedData, userId]);
  

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
  
  const toggleCommentBox = (index: number) => {
    setOpenModalIndex(index);
  };

  const closeModal = () => {
    setOpenModalIndex(null);
  };
  const handleComment = (index: number, postId: string) => {
    const newComment = interactions[index]?.newComment.trim();
    if (newComment) {
      if (!socket) {
        console.error("Socket is not connected!");
        return;
    }

      socket.emit('post_comment', newComment, userId, postId, (response: { comment: string, userName: string }) => {
        if (response) {
          setUserName(response.userName);
          console.log(response.comment);
          setInteractions((prev) => ({
            ...prev,
            [index]: {
              ...prev[index],
              comments: [...prev[index].comments, response.comment], // Append comment from response
              newComment: '',
            },
          }));
        }
      });
    }
  };
  
  

  const handleInputChange = (index: number, value: string) => {
    setInteractions((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        newComment: value,
      },
    }));
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <Header />
      <div className="bg-gradient-to-br from-gray-100 to-gray-300 w-screen min-h-screen pt-10 pb-10 flex justify-center">
        <div className="w-full max-w-4xl flex flex-col items-center">
          <br /><br />
          <div className="w-full px-4 space-y-6">
            {parsedData && parsedData.length > 0 ? (
              parsedData.map((post: any, index: number) => (
                <div
                  key={post._id || index}
                  className="bg-white w-full p-6 rounded-lg shadow-lg border border-gray-200 flex flex-col space-y-4"
                >
                  <div className="flex-1">
                    <span className="block mb-2 text-gray-700 font-medium hover:text-blue-400">
                      {post.companyName}
                      <span className="block text-gray-500 text-sm mb-4">
                        {post.location?.address || "Unknown"}
                      </span>
                    </span>

                    <img
                      src={post.images}
                      className="w-full h-auto object-cover rounded-md mb-4"
                      alt={post.title}
                      onClick={async () => await handleButtonClick(post._id)}
                    />
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
                        } shadow-md hover:shadow-lg transform hover:scale-105`}
                      >
                        {interactions[index]?.liked ? (
                          <>
                            <FaHeart className="text-3xl animate-pulse" />
                            <h4 className="font-bold">You liked the post</h4>
                          </>
                        ) : (
                          <FaRegHeart className="text-3xl" />
                        )}
                      </button>

                      <div className="flex justify-end">
                        <button onClick={() => toggleCommentBox(index)} className="flex items-center space-x-2 text-black">
                          <FaRegCommentDots className="text-3xl" />
                        </button>
                      </div>

                      <Modal isOpen={openModalIndex === index} onClose={closeModal} backdrop="blur" className="rounded-lg shadow-xl border border-gray-200 bg-white max-h-[400px]">
                        <ModalContent>
                          <ModalHeader className="text-lg font-semibold text-gray-900 border-b border-gray-300 py-3">Comments</ModalHeader>
                          <ModalBody className="p-5 space-y-4 max-h-[700px] overflow-y-auto">
                          {interactions[index]?.comments?.length > 0 ? (
                            interactions[index].comments.map((comment, i) => (
                              <div key={i} className="p-2 border-b border-gray-200">
                                <p className="text-gray-700">{comment}</p>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500 italic">No comments yet.</p>
                          )
                          }  
                          </ModalBody>

                          <ModalFooter className="flex flex-col items-start gap-2 border-t border-gray-300 p-4">
                            <input
                              value={interactions[index]?.newComment || ''}
                              onChange={(e) => handleInputChange(index, e.target.value)}
                              placeholder="Write a comment..."
                              className="w-full border rounded-lg p-2 bg-white text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            <div className=" text-black flex justify-end w-full gap-4 mt-2"> 
                            <button className=' bg-purple-700 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded'
  onClick={() => handleComment(index,post._id)} 
>
  Add Comment
</button>

 <button 
  className='bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4 rounded'
  onClick={closeModal}
>
  Stop
</button> 
                            </div>
                          </ModalFooter>
                        </ModalContent>
                      </Modal>
                    </div>
                  </div>
                </div>
              ))
            ) : (
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