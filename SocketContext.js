import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { getUserId } from "./backend/registrationUtils"; // Assuming this path
import { API_URL_SOCKET } from "@env";
import { UserContext } from "./navigation/UserProvider";

const SocketContext = createContext();
export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  // const [userId, setUserId] = useState(null);
  const { userId } = useContext(UserContext);

  console.log("user_id from SOCKET :", userId);

  // Fetch the userId once when the component mounts
  // useEffect(() => {
  //   const fetchUserId = async () => {
  //     const id = await getUserId();
  //     console.log("id at socketcontext : ", id);
  //     setUserId(id);
  //   };

  //   fetchUserId();
  // }, []); // Empty dependency array ensures this runs only once

  // Set up socket connection when userId is available
  useEffect(() => {
    if (userId) {
      console.log("User ID being passed to socket:", userId);

      const socketInstance = io(`${API_URL_SOCKET}`, {
        query: { userId: userId },
      });

      console.log("---------------", socketInstance);

      // Listen for socket connection events
      socketInstance.on("connect", () => {
        console.log("Socket connected:", socketInstance.id);
      });

      socketInstance.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });

      setSocket(socketInstance);

      // Cleanup function to close socket when userId changes or component unmounts
      return () => {
        if (socketInstance) {
          console.log("Socket disconnected");
          socketInstance.disconnect();
        }
      };
    }
  }, [userId]); // This useEffect runs only when userId changes

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

// Updated export to match naming in App.js
export { SocketContext, SocketProvider as SocketContextProvider };
