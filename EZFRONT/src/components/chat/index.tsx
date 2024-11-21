// import { useEffect, useState, useRef, FormEvent } from "react";
// import { io, Socket } from "socket.io-client";
// import Image from "next/image";
// import img from "@/assets/images/icon.jpg"; // Update the path if necessary
// import { useUserContext } from "@/context/UserContext";
// import ACTIVEUSERs from "@/assets/images/activeUsers.png"

// // Define the structure of a chat message
// interface Message {
//   username: string;
//   text: string;
//   avatar: string;
//   timestamp: string; // ISO string for consistency
// }

// // Define the structure of the avatar object
// interface Avatar {
//   small: string;
//   // Add other fields if necessary
// }



// interface ChatProps {
//   isOpen: boolean;
// }

// const Chat: React.FC<ChatProps> = ({ isOpen }) => {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [inputMessage, setInputMessage] = useState<string>("");
//   const messagesEndRef = useRef<HTMLDivElement | null>(null);
//   const socket = useRef<Socket | null>(null);
//   const { username, avatar } = useUserContext()



//   interface ChatProps {
//     isOpen: boolean;
//   }

//   // Initialize Socket.IO client
//   useEffect(() => {
//     if (socket.current) return; // Prevent multiple connections

//     // Replace with your actual Socket.IO server URL or use environment variables
//     const socketURL =
//       process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000/chat";
//     socket.current = io(socketURL);

//     // Listen for initial messages
//     socket.current.on("initialMessages", (msgs: Message[]) => {
//       setMessages(msgs);
//     });

//     // Listen for incoming chat messages
//     socket.current.on("chatMessage", (msg: Message) => {
//       setMessages((prevMessages) => [...prevMessages, msg]);
//     });

//     // Clean up on component unmount
//     return () => {
//       socket.current?.disconnect();
//       socket.current = null;
//     };
//   }, []);

//   // Scroll to the latest message when messages change
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // Handle sending messages
//   const sendMessage = (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (inputMessage.trim() === "") return;

//     if (!username || !avatar) {
//       alert("Please log in to send messages.");
//       return;
//     }

//     const message: Message = {
//       username: username,
//       text: inputMessage,
//       avatar: avatar,
//       timestamp: new Date().toISOString(),
//     };

//     // Emit the message to the server
//     socket.current?.emit("chatMessage", message);

//     // Remove the optimistic update
//     // setMessages((prevMessages) => [...prevMessages, message]);

//     // Clear the input field
//     setInputMessage("");
//   };

//   return (
// <div className={`${isOpen ? 'w-full lg:w-[20%]' : 'w-0'} h-[90%] lg:h-auto transition-all duration-300 `}>
//   <div className="w-full flex justify-between items-center py-2 px-5">
//   <p className="text-headerText text-xl font-semibold text-center">Chat</p>
//     <span className="flex text-red-500 items-end text-sm gap-1">1000 <Image src={ACTIVEUSERs} width={25} alt="activeUsers"/></span>
//   </div>

//   <div className="mt-3 h-[88%] overflow-y-auto flex flex-col gap-[1px]">
//     {messages.map((msg, index) => (
//       <div
//         key={index}
//         className="flex gap-1 bg-headerBackground mx-2 px-2 py-1 items-start"
//       >
//         <Image
//           alt={msg.username}
//           width={30}
//           height={30}
//           className="rounded-full"
//           src={msg.avatar || img.src}
//         />
//         <div className="flex flex-col justify-start max-w-[75%]"> {/* Added max-w */}
//           <h5 className="text-sm text-white">{msg.username}:</h5>
//           <p className="text-sm font-medium text-gray-300 -mt-1 ml-2 break-words">
//             {msg.text}
//           </p>
//         </div>
//       </div>
//     ))}
//     <div ref={messagesEndRef} />
//   </div>
  
//   <div className="w-full flex justify-center mt-10 lg:mt-2">
//     <form onSubmit={sendMessage} className="w-full flex justify-center">
//       <input
//         type="text"
//         placeholder="Chat Here (English)"
//         className="w-[90%] pl-3 text-sm text-white bg-headerBackground h-8 focus:outline-none font-[Roboto Flex]"
//         value={inputMessage}
//         onChange={(e) => setInputMessage(e.target.value)}
//       />
//     </form>
//   </div>
// </div>


//   );
// };

// export default Chat;


import { useEffect, useState, useRef, FormEvent } from "react";
import { io, Socket } from "socket.io-client";
import Image from "next/image";
import img from "@/assets/images/icon.jpg"; // Update the path if necessary
import { useUserContext } from "@/context/UserContext";
import ACTIVEUSERs from "@/assets/images/activeUsers.png";

// Define the structure of a chat message
interface Message {
  username: string;
  text: string;
  avatar: string;
  timestamp: string; // ISO string for consistency
}

interface ChatProps {
  isOpen: boolean;
}

const Chat: React.FC<ChatProps> = ({ isOpen }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [activeUsers, setActiveUsers] = useState<number>(0); // New state for active users
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const socket = useRef<Socket | null>(null);
  const { username, avatar } = useUserContext();

  // Initialize Socket.IO client
  useEffect(() => {
    if (socket.current) return; // Prevent multiple connections

    // Replace with your actual Socket.IO server URL or use environment variables
    const socketURL =
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000/chat";
    socket.current = io(socketURL);

    // Listen for initial messages
    socket.current.on("initialMessages", (msgs: Message[]) => {
      setMessages(msgs);
    });

    // Listen for incoming chat messages
    socket.current.on("chatMessage", (msg: Message) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Listen for active user count
    socket.current.on("activeUsers", (count: number) => {
      setActiveUsers(count);
    });

    // Clean up on component unmount
    return () => {
      socket.current?.disconnect();
      socket.current = null;
    };
  }, []);

  // Scroll to the latest message when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending messages
  const sendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (inputMessage.trim() === "") return;

    if (!username || !avatar) {
      alert("Please log in to send messages.");
      return;
    }

    const message: Message = {
      username: username,
      text: inputMessage,
      avatar: avatar,
      timestamp: new Date().toISOString(),
    };

    // Emit the message to the server
    socket.current?.emit("chatMessage", message);

    // Clear the input field
    setInputMessage("");
  };

  return (
    <div className={`${isOpen ? 'w-full lg:w-[20%]' : 'w-0'} h-[90%] lg:h-auto transition-all duration-300 `}>
      <div className="w-full flex justify-between items-center py-2 px-5">
        <p className="text-headerText text-xl font-semibold text-center">Chat</p>
        <span className="flex text-red-500 items-end text-sm gap-1">
          {activeUsers} <Image src={ACTIVEUSERs} width={25} alt="activeUsers"/>
        </span>
      </div>

      <div className="mt-3 h-[88%] overflow-y-auto flex flex-col gap-[1px]">
        {messages.map((msg, index) => (
          <div
            key={index}
            className="flex gap-1 bg-headerBackground mx-2 px-2 py-1 items-start"
          >
            <Image
              alt={msg.username}
              width={30}
              height={30}
              className="rounded-full"
              src={msg.avatar || img.src}
            />
            <div className="flex flex-col justify-start max-w-[75%]"> {/* Added max-w */}
              <h5 className="text-sm text-white">{msg.username}:</h5>
              <p className="text-sm font-medium text-gray-300 -mt-1 ml-2 break-words">
                {msg.text}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="w-full flex justify-center mt-10 lg:mt-2">
        <form onSubmit={sendMessage} className="w-full flex justify-center">
          <input
            type="text"
            placeholder="Chat Here (English)"
            className="w-[90%] pl-3 text-sm text-white bg-headerBackground h-8 focus:outline-none font-[Roboto Flex]"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />
        </form>
      </div>
    </div>
  );
};

export default Chat;
