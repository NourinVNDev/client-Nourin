import { useState, useRef, useEffect } from "react";
import AgoraRTC, { IAgoraRTCClient, ILocalTrack } from 'agora-rtc-sdk-ng';
import { useNavigate, useSearchParams } from "react-router-dom";
import { checkIfUserIsBooked } from "../../service/userServices/userPost";
import { useSelector } from "react-redux";


import Swal from "sweetalert2";
import { RootState } from "../../../App/store";
import { EventDateChecking } from "../../service/managerServices/handleNotification";
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
  const email = useSelector((state: RootState) => state.user.email || '')
  const eventName = searchParams.get('eventName') || ''
  const navigate = useNavigate();
  const [isBooked, setIsBooked] = useState<boolean | null>(null);
  const bookedId=searchParams.get('bookedId')||'';



  useEffect(() => {
    console.log(remoteUsers);
    
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
    const callImportantFunction = async () => {
      if (role === 'manager' && !joined) {
        const isValid = await checkIfEventDateValuation();
        if (isValid) {
          joinAndDisplayLocalStream();
        }

      }

    }
    callImportantFunction();
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
        videoPlayer.className = 'w-full h-full';

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

  const checkIfEventDateValuation = async () => {
    if (eventName) {
      const result = await EventDateChecking(eventName);

      console.log("Resul of Manager123", result);

      if (result.message !== 'Date and time are valid for entry') {
        Swal.fire({
          title: "Access Denied",
          text: result.message,
          icon: "warning",
          confirmButtonText: "OK",
          allowOutsideClick: false,
        }).then(() => {
          window.location.href = '/Manager/dashboard';
        });
      } else {
        return true;
      }


      return false;
    }

  }

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
      if (role == 'user') {
        navigate('/profile')
      }

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
    if (role === 'user' && isBooked === null && email && eventName && bookedId) {
      const checkUserBooked = async () => {
        if (role === 'user') {
          try {

            console.log("Email", email, eventName);
            const result = await checkIfUserIsBooked(email, eventName,bookedId);
            console.log("Result of data", result);

            if (result.message == 'User has booked this event and is allowed to enter') {
              setIsBooked(true);
            } else if (result.message == "Today's date is not within the event's valid date range") {
              setIsBooked(false);
              Swal.fire({
                title: "Access Denied",
                text: "This event is not available today. Please check the event date.",
                icon: "warning",
                confirmButtonText: "OK",
                allowOutsideClick: false,
              }).then(() => {
                window.location.href = '/home';
              });
            } else if (result.message == 'You can only enter starting from 10 minutes before the event starts') {
              setIsBooked(false);
              Swal.fire({
                title: "Too Early",
                text: "You can only join the event starting 10 minutes before it begins.",
                icon: "info",
                confirmButtonText: "OK",
                allowOutsideClick: false,
              }).then(() => {
                window.location.href = '/home';
              });
            }else if(result.message=='Your booking was cancelled. You cannot enter the event'){
              setIsBooked(false);
              Swal.fire({
                title: "Event Cancelled",
                text:result.message,
                icon: "info",
                confirmButtonText: "OK",
                allowOutsideClick: false,
              }).then(() => {
                window.location.href = '/home';
              });
            }
            else {
              setIsBooked(false);
              Swal.fire({
                title: "Access Denied",
                text: "You have not booked this event. Please book it to join.",
                icon: "warning",
                confirmButtonText: "OK",
                allowOutsideClick: false,
              }).then(() => {
                window.location.href = '/home';
              });
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
  }, [email, eventName,bookedId]);


  return (

    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col w-full p-5">
      {/* Top Bar */}
      <div className="w-full p-4 bg-gray-950 shadow-md flex justify-between items-center">
        <h2 className="text-xl font-semibold">Live Video Call - {eventName || "MeetCraft"}</h2>
        <span className="text-sm text-gray-300 capitalize">{role}</span>
      </div>

      {/* Video Container */}
     <div className="flex-1 flex flex-col lg:flex-row justify-center items-start gap-6 p-6 overflow-auto">

        <div
          ref={videoStreamsRef}
          className="flex flex-wrap justify-center items-start gap-4 w-full"
        />


      </div>

      {/* Controls */}
      <div className="bg-gray-950 w-full py-4 px-6 flex justify-center items-center gap-6 border-t border-gray-800">
        {!joined && role === 'user' && isBooked ? (
          <button
            className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg shadow font-semibold transition duration-300"
            onClick={joinAndDisplayLocalStream}
          >
            Join Stream
          </button>
        ) : (
          <>
            <button
              className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg transition duration-300"
              onClick={toggleMic}
            >
              🎤 Toggle Mic
            </button>
            <button
              className="bg-yellow-600 hover:bg-yellow-700 px-5 py-2 rounded-lg transition duration-300"
              onClick={toggleCamera}
            >
              🎥 Toggle Camera
            </button>
            <button
              className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg transition duration-300"
              onClick={leaveAndRemoveLocalStream}
            >
              ❌ Leave Stream
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ManagerVideoCall;