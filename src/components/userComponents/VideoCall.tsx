import { useParams } from "react-router-dom";
import useSocket from "../../utils/SocketContext";
import { useState,useRef,useEffect } from "react";
type PeerConnections = {
    [userId: string]: RTCPeerConnection;
  };
  
  type PeerStreams = {
    [userId: string]: MediaStream;
  };
const VideoCall=()=>{
    const {roomId}=useParams()
    const {socket} = useSocket();
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const [peers, setPeers] = useState<PeerStreams>({});
    const peerConnections = useRef<PeerConnections>({});
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);

    useEffect(() => {
        if(!socket)return;
        console.log(peers);
        
        const init = async () => {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
    
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
    
          setLocalStream(stream);
          socket.emit("join-room", roomId);
    
          socket.on("user-connected", (userId: string) => {
            console.log("What?");
            
            console.log("UserId:",userId);
            
            createOffer(userId);
          });
    
          socket.on("offer", async ({ from, sdp }: { from: string; sdp: RTCSessionDescriptionInit }) => {
            const pc = createPeerConnection(from);
            if (!pc) return;
            await pc.setRemoteDescription(new RTCSessionDescription(sdp));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            socket.emit("answer", { to: from, sdp: answer });
          });
    
          socket.on("answer", async ({ from, sdp }: { from: string; sdp: RTCSessionDescriptionInit }) => {
            const connection = peerConnections.current[from];
            if (connection) {
              await connection.setRemoteDescription(new RTCSessionDescription(sdp));
            }
          });
    
          socket.on("ice-candidate", ({ from, candidate }: { from: string; candidate: RTCIceCandidateInit }) => {
            const connection = peerConnections.current[from];
            if (connection) {
              connection.addIceCandidate(new RTCIceCandidate(candidate));
            }
          });
    
          socket.on("user-disconnected", (userId: string) => {
            const connection = peerConnections.current[userId];
            if (connection) {
              connection.close();
              delete peerConnections.current[userId];
    
              setPeers((prev) => {
                const updated = { ...prev };
                delete updated[userId];
                return updated;
              });
            }
          });
        };
    
        init();
      }, []);
      const createPeerConnection = (userId: string): RTCPeerConnection | undefined => {
        if (!socket || !localStream) return;
    
        const pc = new RTCPeerConnection();
        peerConnections.current[userId] = pc;
    
        localStream.getTracks().forEach((track) => {
          pc.addTrack(track, localStream);
        });
    
        pc.ontrack = (event: RTCTrackEvent) => {
          setPeers((prev) => ({
            ...prev,
            [userId]: event.streams[0],
          }));
        };
    
        pc.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
          if (event.candidate) {
            socket.emit("ice-candidate", {
              to: userId,
              candidate: event.candidate,
            });
          }
        };
    
        return pc;
      };
    
      const createOffer = async (userId: string) => {
        if (!socket || !localStream) return;
        const pc = createPeerConnection(userId);
        if (!pc) return;
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit("offer", { to: userId, sdp: offer });
      };
    return(
        <div>
            <h1>{roomId}</h1>

        </div>
    )

}
export default VideoCall;