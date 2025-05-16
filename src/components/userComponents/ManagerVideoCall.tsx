import { useState, useRef, useEffect } from "react";
import AgoraRTC, { IAgoraRTCClient, ILocalTrack } from 'agora-rtc-sdk-ng';
import { useNavigate, useSearchParams } from "react-router-dom";
import { checkIfUserIsBooked } from "../../service/userServices/userPost";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { RootState } from "../../../App/store";
const ManagerVideoCall = () => { 
  const [client] = useState<IAgoraRTCClient>(AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' }));
  const [localTracks, setLocalTracks] = useState<ILocalTrack[]>([]);
  const [remoteUsers, setRemoteUsers] = useState<{ [key: string]: any }>({});
  const [joined, setJoined] = useState(false);
  const videoStreamsRef = useRef<HTMLDivElement | null>(null);
  const appId = import.meta.env.VITE_AGORA_APP_ID || '280182f2c96e44bb923f20452e5edd51';
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'user'; 
  const CHANNEL = searchParams.get('channelName') || 'meetCraft';
  const TOKEN = searchParams.get('token') || 'default-fake-token';
  const email=useSelector((state:RootState)=>state.user.email||'')
  const eventName=searchParams.get('eventName')||''
  const navigate = useNavigate();
  const [isBooked, setIsBooked] = useState<boolean | null>(null);


  useEffect(() => {
    const handleUserJoinedWrapper = (user: any, mediaType: any) => handleUserJoined(user, mediaType);
    const handleUserLeftWrapper = (user: any) => handleUserLeft(user);

    client.on('user-published', handleUserJoinedWrapper);
    client.on('user-left', handleUserLeftWrapper);

    return () => {
      // Cleanup event listeners
      client.off('user-published', handleUserJoinedWrapper);
      client.off('user-left', handleUserLeftWrapper);
      
      // Cleanup tracks when component unmounts
      if (joined) {
        leaveAndRemoveLocalStream();
      }
    };
  }, [joined]);

  useEffect(() => {
    if (role === 'manager' && !joined) {
      joinAndDisplayLocalStream();
    }
  }, [role]);

 const handleUserJoined = async (user: any, mediaType: 'audio' | 'video' | 'datachannel') => {
  await client.subscribe(user, mediaType);

  if (mediaType === 'video') {
    // Avoid removing and recreate — instead, check and create only if not exists
    let userContainer = document.getElementById(`user-container-${user.uid}`);

    if (!userContainer) {
      userContainer = document.createElement('div');
      userContainer.className = 'video-container w-[300px] h-[250px] rounded-xl overflow-hidden bg-black';
      userContainer.id = `user-container-${user.uid}`;

      const videoPlayer = document.createElement('div');
      videoPlayer.id = `user-${user.uid}`;
      videoPlayer.className = 'w-full h-full'; // fill the container

      userContainer.appendChild(videoPlayer);
      videoStreamsRef.current?.appendChild(userContainer);
    }

    // 🔥 Very Important: Play the actual remote video track
    user.videoTrack?.play(`user-${user.uid}`);
  }

  if (mediaType === 'audio') {
    user.audioTrack?.play();
  }

  setRemoteUsers(prev => ({ ...prev, [user.uid]: user }));
};


  const handleUserLeft = (user: any) => {
    setRemoteUsers(prev => {
      const updated = { ...prev };
      delete updated[user.uid];
      return updated;
    });
    document.getElementById(`user-container-${user.uid}`)?.remove();
  };

 const joinAndDisplayLocalStream = async () => {
  try {
    if (!appId || appId.length !== 32) {
      throw new Error("Invalid App ID");
    }

    if (!CHANNEL) {
      throw new Error("Channel name is required");
    }

    if (['CONNECTED', 'CONNECTING'].includes(client.connectionState)) {
      console.warn("Already connected/connecting");
      return;
    }

    const UID = await client.join(appId, CHANNEL, TOKEN, null);

    let tracks: ILocalTrack[];
    try {
      tracks = await AgoraRTC.createMicrophoneAndCameraTracks();
    } catch (error: any) {
      Swal.fire({
        title: 'Camera/Microphone Error',
        text: error.message || 'Could not access your camera/microphone. Please check permissions and device availability.',
        icon: 'error'
      });
      console.error("Agora track creation failed:", error);
      return;
    }

    setLocalTracks(tracks);

    const localContainer = document.createElement('div');
    localContainer.id = `user-container-${UID}`;
    localContainer.className = 'video-container w-[600px] h-[500px] rounded-xl overflow-hidden bg-black m-2 flex justify-center items-center';

    const videoPlayer = document.createElement('div');
    videoPlayer.id = `user-${UID}`;
    videoPlayer.className = 'w-full h-full';
    localContainer.appendChild(videoPlayer);

    if (videoStreamsRef.current) {
      videoStreamsRef.current.appendChild(localContainer);
      tracks[1].play(`user-${UID}`);
    }

    await client.publish([tracks[0], tracks[1]]);
    setJoined(true);
  } catch (error: any) {
    Swal.fire({
      title: 'Error Joining Stream',
      text: error.message || 'An unknown error occurred while trying to join the stream.',
      icon: 'error'
    });
    console.error("Error joining and publishing stream:", error);
  }
};


  const leaveAndRemoveLocalStream = async () => {
    try {
      // Unpublish tracks first
      if (client.connectionState === 'CONNECTED') {
        await client.unpublish(localTracks);
      }

      // Stop and close tracks
      localTracks.forEach(track => {
        try {
          track?.stop();
          track?.close();
        } catch (e) {
          console.error("Error stopping track:", e);
        }
      });

      // Leave the channel
      if (client.connectionState !== 'DISCONNECTED') {
        await client.leave();
      }

      // Clear video container
      if (videoStreamsRef.current) {
        videoStreamsRef.current.innerHTML = '';
      }

      // Reset state
      setLocalTracks([]);
      setRemoteUsers({});
      setJoined(false);

      // Navigate if manager
      if (role === 'manager') {
        navigate('/manager/events');
      }
    } catch (error) {
      console.error("Error leaving stream:", error);
    }
  };

  const toggleMic = async () => {
    if (localTracks[0]) {
      await localTracks[0].setMuted(!localTracks[0].muted);
    }
  };

  const toggleCamera = async () => {
    if (localTracks[1]) {
      await localTracks[1].setMuted(!localTracks[1].muted);
    }
  };


 useEffect(() => {
    if (role === 'user' && isBooked === null && email && eventName) {
  const checkUserBooked = async () => {
    if (role === 'user') {
      try {

        console.log("Email",email,eventName);
        const result = await checkIfUserIsBooked(email, eventName);
        console.log("Result of data",result);
        
        if (result.message == 'User has already booked this event') {
          setIsBooked(true);
        }
         else {
          setIsBooked(false);
        //   Swal.fire({
        //     title: "Access Denied",
        //     text: "You are not booking this event.",
        //     icon: "warning",
        //     confirmButtonText: "OK",
        //     allowOutsideClick: false,
        //   }).then(() => {
        //     window.location.href = '/home';
        //   });
        }
      } catch (err) {
        console.error("Booking check error:", err);
        setIsBooked(false);
        Swal.fire({
          title: "Error",
          text: "Something went wrong while checking booking.",
          icon: "error",
        });
      }
    }
  };

  checkUserBooked();
}
}, [email, eventName,isBooked]);


  return (
    <div className="min-h-screen bg-gradient-to-r from-[#2C5364] via-[#203A43] to-[#0F2027] text-white flex flex-col items-center justify-center">
      {!joined && role === 'user' && isBooked? (
        <button
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg mb-4"
          onClick={joinAndDisplayLocalStream}
        >
          Join Stream
        </button>
      ) : (
        <div className="flex gap-4 mb-4">
          <button 
            className="bg-red-600 hover:bg-red-700 py-2 px-4 rounded" 
            onClick={leaveAndRemoveLocalStream}
          >
            Leave Stream
          </button>
          <button 
            className="bg-cyan-600 hover:bg-cyan-700 py-2 px-4 rounded" 
            onClick={toggleMic}
          >
            Toggle Mic
          </button>
          <button 
            className="bg-cyan-600 hover:bg-cyan-700 py-2 px-4 rounded" 
            onClick={toggleCamera}
          >
            Toggle Camera
          </button>
        </div>
      )}
      <div
        ref={videoStreamsRef}
        className="flex flex-wrap w-[100vw] h-[80vh] gap-4 justify-center items-center p-4 bg-gray-900"
      />
    </div>
  );
};

export default ManagerVideoCall;