import { useState,useRef ,useEffect} from "react";
import AgoraRTC, { IAgoraRTCClient, ILocalTrack } from 'agora-rtc-sdk-ng';
import { useNavigate } from "react-router-dom";
// const TOKEN = '007eJxTYPC9ta5h5hWba9rxPgdMZV9wNJ5Y8GT+8q23bh9d/oRPVoJfgcHCyCzF1MzCNCktKdnEJDkp0TLZwiIt2SjF3CTZzDjF4udvvoyGQEaGOMkjrIwMEAjiczLkpqaWOBclppUwMAAAg3cjNw==';

import { useSearchParams } from "react-router-dom";

const ManagerVideoCall=()=>{ 
const [client] = useState<IAgoraRTCClient>(AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' }));
const [localTracks, setLocalTracks] = useState<ILocalTrack[]>([]);
const [remoteUsers, setRemoteUsers] = useState<{ [key: string]: any }>({});
const [joined, setJoined] = useState(false);
const videoStreamsRef = useRef<HTMLDivElement | null>(null);
const appId = import.meta.env.VITE_AGORA_APP_ID||'404c9082bf0c4f8cab40bb2498ee1c22';
const [searchParams,setSearchParams] = useSearchParams();
const role = searchParams.get('role'  ) || 'user'; 
const CHANNEL = searchParams.get('channelName') || 'meetCraft';
const TOKEN = searchParams.get('token') || 'default-fake-token';
const navigate=useNavigate();



useEffect(()=>{
  console.log("Ch");
  console.log("AppID",appId);
  
  console.log("mad",appId,TOKEN,CHANNEL,role);
},[appId,role,CHANNEL,TOKEN])
useEffect(() => {
  client.on('user-published', handleUserJoined);
  client.on('user-joined', handleUserJoined);
  client.on('user-left', handleUserLeft);

  return () => {
    client.off('user-published', handleUserJoined);
    client.off('user-joined', handleUserJoined);
    client.off('user-left', handleUserLeft);
  };
}, []);

  

useEffect(() => {
  if (role === 'manager' && !joined) {
    joinAndDisplayLocalStream();
  }
  return () => {
    if (joined) {
      client.leave();
    }
  };

}, [role, joined,appId]);


const handleUserJoined = async (user: any, mediaType: 'audio' | 'video' | 'datachannel') => {
  await client.subscribe(user, mediaType);


  if (mediaType === 'video') {
    const player = document.getElementById(`user-container-${user.uid}`);
    if (player) player.remove();

    const newPlayer = document.createElement('div');
    newPlayer.className = 'video-container w-[300px] h-[250px] rounded-xl overflow-hidden bg-black';
    newPlayer.id = `user-container-${user.uid}`;


    const videoPlayer = document.createElement('div');
    videoPlayer.id = `user-${user.uid}`;
    videoPlayer.className = 'video-player';
    newPlayer.appendChild(videoPlayer);

    videoStreamsRef.current?.appendChild(newPlayer);
    user.videoTrack.play(`user-${user.uid}`);
  }

  if (mediaType === 'audio') {
    user.audioTrack.play();
  }
  console.log('Remote user joined:', user.uid);
  console.log('Media type:', mediaType);
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
    
        console.log("Attempting to join with:", { appId, CHANNEL ,TOKEN});
            const UID = await Promise.race([
          client.join(appId, CHANNEL, TOKEN, null),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Join timeout")), 10000)
          )
        ]);
    
    const tracks = await AgoraRTC.createMicrophoneAndCameraTracks();
    console.log("Tracks", tracks);
    setLocalTracks(tracks);
    
    const localContainer = document.createElement('div');
    localContainer.id = `user-container-${UID}`;
    localContainer.style.width = '600px';
    localContainer.style.height = '500px';
    localContainer.style.backgroundColor = 'black';
    localContainer.style.margin = '10px';
    localContainer.style.borderRadius = '10px';
    localContainer.style.overflow = 'hidden';
    localContainer.style.display = 'flex';
    localContainer.style.justifyContent = 'center';
    localContainer.style.alignItems = 'center';
    
    const videoPlayer = document.createElement('div');
    videoPlayer.id = `user-${UID}`;
    videoPlayer.style.width = '100%';
    videoPlayer.style.height = '100%';
    localContainer.appendChild(videoPlayer);
    
    if (videoStreamsRef.current) {
      videoStreamsRef.current.appendChild(localContainer);
      setTimeout(() => {
        console.log("🔊 Playing local camera track...");
        tracks[1].play(`user-${UID}`);
      }, 300);
    }
    
    await client.publish([tracks[0], tracks[1]]);
    setJoined(true);
  } catch (error) {
    console.error("Error joining and publishing stream: ", error);
  }
};

const leaveAndRemoveLocalStream = async () => {
  localTracks.forEach(track => {
    if (track) {
      track.stop();  
      track.close();   
    }
  });
  await client.leave();
  setJoined(false);
  setRemoteUsers({});
  if (videoStreamsRef.current) {
    videoStreamsRef.current.innerHTML = '';
  }

  // Redirect based on role
  if (role === 'manager') {
    navigate('/manager/events');
  }
};




const toggleMic = async () => {
  const micTrack = localTracks[0];
  await micTrack.setMuted(!micTrack.muted);
};

const toggleCamera = async () => {
  const cameraTrack = localTracks[1];
  await cameraTrack.setMuted(!cameraTrack.muted);
};

return (
  <div className="min-h-screen bg-gradient-to-r from-[#2C5364] via-[#203A43] to-[#0F2027] text-white flex flex-col items-center justify-center">
    {!joined && role === 'user'  ? (
      <button
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg mb-4"
        onClick={joinAndDisplayLocalStream}
      >
        Join Stream
      </button>
    ) : (
      <div className="flex gap-4 mb-4">
        <button className="bg-red-600 hover:bg-red-700 py-2 px-4 rounded" onClick={leaveAndRemoveLocalStream}>Leave Stream</button>
        <button className="bg-cyan-600 hover:bg-cyan-700 py-2 px-4 rounded" onClick={toggleMic}>Toggle Mic</button>
        <button className="bg-cyan-600 hover:bg-cyan-700 py-2 px-4 rounded" onClick={toggleCamera}>Toggle Camera</button>
      </div>
    )}
<div
  id="video-streams"
  ref={videoStreamsRef}
  className="flex flex-wrap w-[100vw] h-[80vh] gap-4 justify-center items-center p-4 bg-gray-900"
/></div>

);
};

export default ManagerVideoCall;