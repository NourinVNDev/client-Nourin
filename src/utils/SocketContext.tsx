import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    useCallback
  } from "react";
  import { useSelector } from "react-redux";
  import { io, Socket } from "socket.io-client";
  import { RootState } from "../../App/store"; 


  interface SocketContextType {
    socket: Socket | null;
    onlineUsers: string[] | undefined;
  }
  
  const SocketContext = createContext<SocketContextType>({
    socket: null,
    onlineUsers: [],
  });

  export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => {
    const socketRef = useRef<Socket | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    const user = useSelector((state: RootState) => state.user._id);
    console.log(user,"userdata")
    const manager = useSelector((state: RootState) => state.manager._id);
    console.log(manager,"managerData")
    const loggedUser = user  || manager;


    const getRole = useCallback((): string | null => {
        if (user ) return "user";
    
        if (manager) return "manager";
        return null;
      }, [user, manager]);
      useEffect(() => {
        if (loggedUser) {
          const role = getRole();
          console.log("Role being sent to backend:", role);
          const newSocket = io("http://localhost:3001", { 
            query: {
              userId: loggedUser,
              role,
            },
          });
          socketRef.current = newSocket;
    
          newSocket.on("get-online-users", (users) => {
            setOnlineUsers(users);
          });
    
          return () => {
            newSocket.off("get-online-users");
            newSocket.disconnect();
          };
        }
      }, [getRole, loggedUser]);

      return (
        <SocketContext.Provider value={{ socket: socketRef.current, onlineUsers }}>
          {children}
        </SocketContext.Provider>
      );
    };



     const useSocket = (): SocketContextType => {
        const context = useContext(SocketContext);
        if (!context) {
          throw new Error("useSocket must be used within a SocketProvider");
        }
        return context;
      };
      export default  useSocket;


      

