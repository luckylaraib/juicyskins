





// "use client";
// import back from "@/assets/images/home.jpg";
// import Chat from "@/components/chat";
// import JackpotStatus from "@/components/jacpotStatusapifetch/page";
// import Image from "next/image";
// import SdCardSharpIcon from "@mui/icons-material/SdCardSharp";
// import QuizSharpIcon from "@mui/icons-material/QuizSharp";
// import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
// import { useEffect, useState, useMemo } from "react";
// import { io, Socket } from "socket.io-client";
// import axios, { AxiosError } from "axios";
// import { motion, AnimatePresence } from "framer-motion";
// import HistoryContent from "@/components/historyContent";
// import MenuBarSvg from "@/assets/svg/menuBARS";
// import MobileChat from "@/components/mobileChatModel";

// // Import useQuery and useQueryClient from React Query
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import LastFourJackpots from "@/components/LastFourJackpots";

// const SOCKET_SERVER_URL =
//   process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "http://localhost:5000";

// // Utility function to extract price
// const extractPrice = (priceString: string): number => {
//   const match = priceString.match(/([\d,.]+)/);
//   if (match) {
//     return parseFloat(match[1].replace(/,/g, ""));
//   }
//   return 0;
// };

// // ----------------------
// // Type Definitions
// // ----------------------

// // Interface for an individual item
// interface Item {
//   _id: string;
//   name: string;
//   iconUrl: string;
//   price: string; // e.g., "12.34 USD"
//   tradable: boolean;
//   owner: string;
//   assetId: string;
//   appId: number;
//   contextId: number;
//   createdAt: string; // ISO date string
//   __v: number;
// }

// interface User {
//   avatar: {
//     small: string;
//     medium?: string;
//     large?: string;
//   };
//   _id: string;
//   steamId: string;
//   username: string;
//   inventory: string[];
//   createdAt: string; // ISO date string
//   __v: number;
// }

// // Interface for participant data received from the server
// interface ParticipantData {
//   user: User;
//   items: Item[];
//   color: string; // Added color property
// }

// // Interface for a participant in the frontend state
// interface Participant {
//   id: string; // Unique identifier (user ID)
//   username: string;
//   items: Item[]; // Array of invested items
//   totalValue: number;
//   skinCount: number;
//   img: string;
//   color: string; // Color assigned by backend
// }

// // Interface for the jackpot status response from the server
// interface JackpotStatusResponse {
//   _id: string;
//   participants: ParticipantData[];
// }

// // Utility to map backend data to frontend Participant structure
// const mapParticipants = (
//   participantsData: ParticipantData[],
// ): Participant[] => {
//   return participantsData.map((participant) => {
//     const user = participant.user;
//     const totalValue = participant.items.reduce((acc, item) => {
//       const price = extractPrice(item.price);
//       return acc + price;
//     }, 0);

//     return {
//       id: user._id,
//       username: user.username || "Unknown",
//       items: participant.items,
//       totalValue: totalValue,
//       skinCount: participant.items.length,
//       img: user.avatar.small || "/default-avatar.png",
//       color: participant.color,
//     };
//   });
// };

// export default function HomePage() {
//   const [selectedTab, setSelectedTab] = useState("Home");
//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const [isOpen, setIsOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);
//   const queryClient = useQueryClient();

//   const handleOpen = () => setIsOpen(true);
//   const handleClose = () => setIsOpen(false);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 1024);
//     };

//     handleResize();
//     window.addEventListener("resize", handleResize);

//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const handleToggleChat = () => {
//     if (!isMobile) {
//       setIsChatOpen((prev) => !prev);
//     }
//   };

//   // Fetch function for React Query
//   const fetchJackpotData = async (): Promise<JackpotStatusResponse> => {
//     const response = await axios.get(
//       `${SOCKET_SERVER_URL}/jackpotSystem/status`,
//     );
//     return response.data;
//   };

//   // Use useQuery to fetch data with the new object syntax
//   const { data, isLoading, isError, error, refetch } = useQuery<JackpotStatusResponse, AxiosError>({
//     queryKey: ["jackpotData"],
//     queryFn: fetchJackpotData,
//     retry: false, // Prevent retrying on failure
//   });

//   // Determine if the error is a 404
//   const isNoActiveJackpot = isError && error?.response?.status === 404;

//   // Handle Socket.IO updates
//   useEffect(() => {
//     const socket: Socket = io(SOCKET_SERVER_URL);

//     // Listen for participants update and refetch data
//     socket.on("participants", () => {
//       refetch();
//     });

//     // Cleanup the socket connection when the component is unmounted
//     return () => {
//       socket.disconnect();
//     };
//   }, [refetch]);

//   // Process participants data
//   const participants = data ? mapParticipants(data.participants) : [];
//   const roundHash = data ? data._id : "";

//   const handleOnSpinComplete = () => {
//     queryClient.invalidateQueries({ queryKey: ["jackpotData"] });
//   };

//   // Calculate all skins from participants
//   const allSkins = useMemo(() => {
//     return participants.flatMap((participant) =>
//       participant.items.map((item) => ({
//         ...item,
//         participantColor: participant.color,
//         participantImg: participant.img,
//         participantUsername: participant.username,
//       })),
//     );
//   }, [participants]);

//   // Determine if there's an active jackpot
//   const hasActiveJackpot = !!data;

//   // Handle loading and error states
//   if (isLoading) {
//     return (
//       <div className="w-full h-screen flex items-center justify-center bg-[#404040]">
//         <div className="text-white">Loading...</div>
//       </div>
//     );
//   }

//   if (isError && !isNoActiveJackpot) {
//     return (
//       <div className="w-full h-screen flex items-center justify-center bg-[#404040]">
//         <div className="text-red-500">
//           Error: {error?.message || "An error occurred"}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="w-full h-[calc(100vh-72px)] overflow-y-hidden flex bg-[#404040] ">
//         <div className="h-full flex border-r-[1px] border-black  pt-2 items-center flex-col bg-[#2C2C2E] w-14">
//           <button onClick={handleToggleChat}>
//             <MenuBarSvg />
//           </button>
//           <div className="h-full w-full flex flex-col gap-y-6 py-14 items-center">
//             <button className="text-sm flex flex-col items-center font-semibold leading-6">
//               <SdCardSharpIcon htmlColor="#5B595C" />
//               <span className="text-xs text-[#5B595C]">ToS</span>
//             </button>
//             <a
//               href="/FAQ"
//               className="text-sm flex flex-col items-center font-semibold leading-6"
//             >
//               <QuizSharpIcon htmlColor="#5B595C" />
//               <span className="text-xs text-[#5B595C]">FAQ's</span>
//             </a>
//             <div
//               className="text-sm lg:hidden flex flex-col items-center font-semibold leading-6"
//               onClick={handleOpen}
//             >
//               <ChatOutlinedIcon htmlColor="#5B595C" />
//               <span className="text-xs text-[#5B595C]">Chat</span>
//             </div>
//             <MobileChat isOpen={isOpen} handleClose={handleClose} />
//           </div>
//         </div>

//         <Chat isOpen={isChatOpen} />

//         <div
//           className={`w-full ${
//             isChatOpen ? "lg:w-[80%]" : "lg:w-full"
//           } overflow-y-auto h-auto blur-background`}
//           style={{
//             backgroundImage: `url(${back.src})`,
//             backgroundRepeat: "no-repeat",
//             backgroundSize: "cover",
//           }}
//         >
//           <div className="w-full mx-auto relative z-10">
//             <div className="flex items-center justify-start gap-5 py-3 bg-[#2C2C2E] w-full sticky top-0 z-50 px-4">
//               <motion.button
//                 className={`tabbutton w-32 flex justify-center py-2 text-center transition-all duration-300 ease-in-out ${
//                   selectedTab === "Home"
//                     ? "bg-white text-black"
//                     : "bg-headerBackground text-gray-300 hover:bg-gray-300 hover:text-gray-800"
//                 }`}
//                 onClick={() => setSelectedTab("Home")}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 transition={{ type: "spring", stiffness: 300 }}
//               >
//                 Home
//               </motion.button>
//               <motion.button
//                 className={`tabbutton w-32 flex justify-center py-2 text-center transition-all duration-300 ease-in-out ${
//                   selectedTab === "History"
//                     ? "bg-white text-black"
//                     : "bg-headerBackground text-gray-300 hover:bg-gray-300 hover:text-gray-800"
//                 }`}
//                 onClick={() => setSelectedTab("History")}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 transition={{ type: "spring", stiffness: 300 }}
//               >
//                 History
//               </motion.button>
//             </div>

//             <div className="w-full">
//               {selectedTab === "Home" ? (
//                 <div>
//                   <h2 className="text-4xl  md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-red-500 text-center my-5 ">
//                   Jackpot Items
//                   </h2>
//                   <div className="mx-auto flex justify-start gap-1 overflow-x-scroll my-5 w-[90%] h-36 scrollbar-hidden">
//                     <AnimatePresence initial={false}>
//                       {allSkins.map((skin) => (
//                         <motion.div
//                           key={skin._id}
//                           initial={{ opacity: 0, x: 50 }}
//                           animate={{ opacity: 1, x: 0 }}
//                           exit={{ opacity: 0, x: -50 }}
//                           transition={{ duration: 0.5 }}
//                           className="relative flex flex-shrink-0 items-center justify-center w-48 h-28 border-[#2C2C2E] border-t-4 border-l-0 border-r-0 border-b-4 border-[1px] bg-gradient-to-r from-[#404040] to-[#636363]"
//                           style={{ borderBottomColor: skin.participantColor }}
//                         >
//                           <Image
//                             alt="User Avatar"
//                             src={skin.participantImg}
//                             width={25}
//                             height={25}
//                             className="rounded-full absolute right-1 top-1"
//                           />
//                           <div className="flex items-center justify-start gap-0">
//                             <div className="text-[#EEC475] text-[11px] absolute left-0 top-0 bg-[#2C2C2E] w-12 h-6 flex justify-center items-center">
//                               ${extractPrice(skin.price).toFixed(2)}
//                             </div>
//                             <div className="inclined-div h-6 w-4 absolute left-12 top-0 rotate bg-[#2C2C2E]"></div>
//                           </div>
//                           <img
//                             src={skin.iconUrl}
//                             alt={skin.name}
//                             width={62}
//                             height={62}
//                           />
//                           <p className="text-white text-[10px] absolute bottom-0 text-left w-full px-1">
//                             {skin.name}
//                           </p>
//                         </motion.div>
//                       ))}
//                     </AnimatePresence>
//                   </div>
//                   <h2 className="text-4xl  md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-red-500 text-center mb-3 ">
//                   Current Jackpot
//                   </h2>
//                   <JackpotStatus
//                     participants={participants}
//                     roundhash={roundHash}
//                     onSpinCompleteInventryReload={handleOnSpinComplete}
//                     showTimer={isNoActiveJackpot} // Pass the new prop here
//                   />
//                   <LastFourJackpots />
//                 </div>
//               ) : (
//                 <HistoryContent />
//               )}
//             </div>
            
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }


// pages/HomePage.tsx
"use client";

import back from "@/assets/images/home.jpg";
import Chat from "@/components/chat";
import JackpotStatus from "@/components/jacpotStatusapifetch/page"; // Corrected import path
import Image from "next/image";
import SdCardSharpIcon from "@mui/icons-material/SdCardSharp";
import QuizSharpIcon from "@mui/icons-material/QuizSharp";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import { useEffect, useState, useMemo, useRef } from "react";
import { io, Socket } from "socket.io-client";
import axios, { AxiosError } from "axios";
import { motion, useAnimation } from "framer-motion"; // Updated import
import HistoryContent from "@/components/historyContent";
import MenuBarSvg from "@/assets/svg/menuBARS";
import MobileChat from "@/components/mobileChatModel";

// Import useQuery and useQueryClient from React Query
import { useQuery, useQueryClient } from "@tanstack/react-query";
import LastFourJackpots from "@/components/LastFourJackpots";
import SlotMachine from "@/components/SlotMachine";

const SOCKET_SERVER_URL =
  process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "http://localhost:5000";

// Utility function to extract price
const extractPrice = (priceString: string): number => {
  const match = priceString.match(/([\d,.]+)/);
  if (match) {
    return parseFloat(match[1].replace(/,/g, ""));
  }
  return 0;
};

// ----------------------
// Type Definitions
// ----------------------

// Interface for an individual item
interface Item {
  _id: string;
  name: string;
  iconUrl: string;
  price: string; // e.g., "12.34 USD"
  tradable: boolean;
  owner: string;
  assetId: string;
  appId: number;
  contextId: number;
  createdAt: string; // ISO date string
  __v: number;
}

interface User {
  avatar: {
    small: string;
    medium?: string;
    large?: string;
  };
  _id: string;
  steamId: string;
  username: string;
  inventory: string[];
  createdAt: string; // ISO date string
  __v: number;
}

// Interface for participant data received from the server
interface ParticipantData {
  user: User;
  items: Item[];
  color: string; // Added color property
}

// Interface for a participant in the frontend state
interface Participant {
  id: string; // Unique identifier (user ID)
  username: string;
  items: Item[]; // Array of invested items
  totalValue: number;
  skinCount: number;
  img: string;
  color: string; // Color assigned by backend
}

// Interface for the jackpot status response from the server
interface JackpotStatusResponse {
  _id: string;
  participants: ParticipantData[];
}

// Interface for Jackpot Status Response Extended (assuming 'winner' and 'status' fields)
interface ExtendedJackpotStatusResponse extends JackpotStatusResponse {
  winner: {
    username: string;
    avatar: {
      small: string;
      medium?: string;
      large?: string;
    };
  };
  status: "active" | "completed" | "pending"; // Example statuses
}

// Utility to map backend data to frontend Participant structure
const mapParticipants = (
  participantsData: ParticipantData[]
): Participant[] => {
  return participantsData.map((participant) => {
    const user = participant.user;
    const totalValue = participant.items.reduce((acc, item) => {
      const price = extractPrice(item.price);
      return acc + price;
    }, 0);

    return {
      id: user._id,
      username: user.username || "Unknown",
      items: participant.items,
      totalValue: totalValue,
      skinCount: participant.items.length,
      img: user.avatar.small || "/default-avatar.png",
      color: participant.color,
    };
  });
};

export default function HomePage() {
  const initialReels = [
    ['J', 'A', 'C', 'K', 'P', 'O', 'T'],
    ['A', 'C', 'K', 'P', 'P', 'O', 'T'],
    ['C', 'K', 'P', 'O', 'P', 'O', 'T'],
    ['K', 'P', 'O', 'T', 'P', 'O', 'T'],
    ['P', 'O', 'T', 'J', 'A', 'C', 'K'],
    ['O', 'T', 'J', 'A', 'C', 'K', 'P'],
    ['T', 'J', 'A', 'C', 'K', 'P', 'O'],
  ];
  const JackpotItemReel = [
    ['J', 'A', 'C', 'K', 'P', 'O', 'T'],
    ['A', 'C', 'K', 'P', 'P', 'O', 'T'],
    ['C', 'K', 'P', 'O', 'P', 'O', 'T'],
    ['K', 'P', 'O', 'T', 'P', 'O', 'T'],
    ['P', 'O', 'T', 'J', 'A', 'C', 'K'],
    ['O', 'T', 'J', 'A', 'C', 'K', 'P'],
    ['T', 'J', 'A', 'C', 'K', 'P', 'O'],
    ['.', 'J', 'A', 'C', 'K', 'P', 'O'],
    ['I', 'J', 'A', 'C', 'K', 'P', 'O'],
    ['T', 'J', 'A', 'C', 'K', 'P', 'O'],
    ['E', 'J', 'A', 'C', 'K', 'P', 'O'],
    ['M', 'J', 'A', 'C', 'K', 'P', 'O'],
    ['S', 'J', 'A', 'C', 'K', 'P', 'O'],
  ];

  // ----------------------
  // Hooks
  // ----------------------
  
  // State Hooks
  const [selectedTab, setSelectedTab] = useState("Home");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const queryClient = useQueryClient();

  // Animation Controls for the Carousel
  const controls = useAnimation();

  // Refs
  const skinsRef = useRef<number>(0);

  // Handlers
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleToggleChat = () => {
    if (!isMobile) {
      setIsChatOpen((prev) => !prev);
    }
  };

  // Effect: Handle Window Resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch function for React Query
  const fetchJackpotData = async (): Promise<ExtendedJackpotStatusResponse> => {
    const response = await axios.get(
      `${SOCKET_SERVER_URL}/jackpotSystem/status`
    );
    return response.data;
  };

  // React Query: Fetch Jackpot Data
  const { data, isLoading, isError, error, refetch } = useQuery<
    ExtendedJackpotStatusResponse,
    AxiosError
  >({
    queryKey: ["jackpotData"],
    queryFn: fetchJackpotData,
    retry: false, // Prevent retrying on failure
  });

  // Determine if the error is a 404
  const isNoActiveJackpot = isError && error?.response?.status === 404;

  // Effect: Handle Socket.IO Updates
  useEffect(() => {
    const socket: Socket = io(SOCKET_SERVER_URL);

    // Listen for participants update and refetch data
    socket.on("participants", () => {
      refetch();
    });

    // Cleanup the socket connection when the component is unmounted
    return () => {
      socket.disconnect();
    };
  }, [refetch]);

  // Process participants data
  const participants = data ? mapParticipants(data.participants) : [];
  const roundHash = data ? data._id : "";

  const handleOnSpinComplete = () => {
    queryClient.invalidateQueries({ queryKey: ["jackpotData"] });
  };

  // Calculate all skins from participants
  const allSkins = useMemo(() => {
    return participants.flatMap((participant) =>
      participant.items.map((item) => ({
        ...item,
        participantColor: participant.color,
        participantImg: participant.img,
        participantUsername: participant.username,
      }))
    );
  }, [participants]);

  // Determine if there's an active jackpot
  const hasActiveJackpot = !!data;

  // Effect: Start the Carousel Animation
  useEffect(() => {
    if (allSkins.length > 0 && skinsRef.current !== allSkins.length) {
      skinsRef.current = allSkins.length;

      // Start the auto-scrolling animation
      controls.start({
        x: ["0%", "-50%"], // Shift by half since we have duplicated items
        transition: {
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 20, // Adjust duration for speed
            ease: "linear",
          },
        },
      });
    }
  }, [controls, allSkins.length]);

  // Handle loading state
  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#404040]">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  // Handle error state
  if (isError && !isNoActiveJackpot) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#404040]">
        <div className="text-red-500 text-lg">
          Error: {error?.message || "An error occurred"}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full h-[calc(100vh-72px)] overflow-y-hidden flex bg-[#404040]">
        {/* Sidebar */}
        <div className="h-full flex border-r-[1px] border-black pt-2 items-center flex-col bg-[#2C2C2E] w-14">
          {/* Sidebar Buttons */}
          <button onClick={handleToggleChat} className="hidden lg:block mb-6">
            <MenuBarSvg />
          </button>
          <div className="h-full w-full flex flex-col gap-y-6 py-14 items-center">
            <button className="text-sm flex flex-col items-center font-semibold leading-6">
              <SdCardSharpIcon htmlColor="#5B595C" />
              <span className="text-xs text-[#5B595C]">ToS</span>
            </button>
            <a
              href="/FAQ"
              className="text-sm flex flex-col items-center font-semibold leading-6"
            >
              <QuizSharpIcon htmlColor="#5B595C" />
              <span className="text-xs text-[#5B595C]">FAQ's</span>
            </a>
            <div
              className="text-sm lg:hidden flex flex-col items-center font-semibold leading-6 cursor-pointer"
              onClick={handleOpen}
            >
              <ChatOutlinedIcon htmlColor="#5B595C" />
              <span className="text-xs text-[#5B595C]">Chat</span>
            </div>
            <MobileChat isOpen={isOpen} handleClose={handleClose} />
          </div>
        </div>

        {/* Chat Component */}
        <Chat isOpen={isChatOpen} />

        {/* Main Content */}
        <div
          className={`w-full ${
            isChatOpen ? "lg:w-[80%]" : "lg:w-full"
          } overflow-y-auto h-auto bg-transparent`}
          style={{
            backgroundImage: `url(${back.src})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        >
          <div className="w-full mx-auto relative z-10">
            {/* Header with Tabs */}
            <div className="flex items-center justify-start gap-5 py-3  w-full sticky top-0 z-50 px-4 bg-[#2C2C2E] border border-b-gray-900 border-l-0 border-r-0 border-t-0 md:border-none">
              <motion.button
                className={`tabbutton w-32 flex justify-center py-2 text-center transition-all duration-300 ease-in-out ${
                  selectedTab === "Home"
                    ? "bg-white text-black"
                    : "bg-headerBackground text-gray-300 hover:bg-gray-300 hover:text-gray-800"
                }`}
                onClick={() => setSelectedTab("Home")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Home
              </motion.button>
              <motion.button
                className={`tabbutton w-32 flex justify-center py-2 text-center transition-all duration-300 ease-in-out ${
                  selectedTab === "History"
                    ? "bg-white text-black"
                    : "bg-headerBackground text-gray-300 hover:bg-gray-300 hover:text-gray-800"
                }`}
                onClick={() => setSelectedTab("History")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                History
              </motion.button>
            </div>

            {/* Tab Content */}
            <div className="w-full">
              {selectedTab === "Home" ? (
                <div>
                  {/* Conditional Rendering of Jackpot Items */}
                  {allSkins.length > 0 && (
                    <>
                      <SlotMachine reels={JackpotItemReel} />

                      {/* Animated Jackpot Items Carousel */}
                      <div className="relative mx-auto w-full md:w-11/12 overflow-hidden my-5">
                        <motion.div
                          className="flex gap-2"
                          animate={controls}
                          whileHover={{ scale: 1.02 }}
                          onHoverStart={() => controls.stop()}
                          onHoverEnd={() =>
                            controls.start({
                              x: ["0%", "-50%"],
                              transition: {
                                x: {
                                  repeat: Infinity,
                                  repeatType: "loop",
                                  duration: 20, // Adjust duration for speed
                                  ease: "linear",
                                },
                              },
                            })
                          }
                        >
                          {/* Original Items */}
                          {allSkins.map((skin) => (
                            <motion.div
                              key={skin._id}
                              className="border-[#2C2C2E] border-t-4 border-b-2 relative flex-shrink-0 items-center justify-center w-48 h-32 md:w-[220px] md:h-32  bg-gradient-to-r from-[#404040] to-[#636363] shadow-md hover:shadow-lg transition-shadow duration-300"
                            >
                              {/* Participant Avatar */}
                              <Image
                                alt={`${skin.participantUsername}'s Avatar`}
                                src={skin.participantImg}
                                width={25}
                                height={25}
                                className="rounded-full absolute right-1 top-1 border-2 border-white"
                              />

                              {/* Price Badge */}
                              <div className="flex items-center justify-start gap-0" 
                              key={skin._id}
                              >
                                <div className="text-[#EEC475] text-[11px] absolute left-0 top-0 w-12 h-6 flex justify-center items-center"
                                style={{ backgroundColor: skin.participantColor, }}
                                >
                                  ${extractPrice(skin.price).toFixed(2)}
                                </div>
                                <div className="inclined-div h-6 w-4 absolute left-[46px] top-0 rotate"
                                style={{ backgroundColor: skin.participantColor, }}
                                ></div>
                              </div>

                              {/* Item Icon */}
                              <Image
                                src={skin.iconUrl}
                                alt={skin.name}
                                width={62}
                                height={62}
                                className="items-center justify-center absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%]"
                              />

                              {/* Item Name */}
                              <p className="text-white text-[10px] absolute bottom-0 text-left w-full px-1 truncate">
                                {skin.name}
                              </p>
                            </motion.div>
                          ))}

                          {/* Duplicate Items for Seamless Scroll */}
                          {allSkins.map((skin) => (
                            <motion.div
                              key={`${skin._id}-duplicate`}
                              className="border-[#2C2C2E] border-t-4 relative flex-shrink-0 items-center justify-center w-48 h-32  md:w-[220px] md:h-32  bg-gradient-to-r from-[#404040] to-[#636363] shadow-md hover:shadow-lg transition-shadow duration-300"
                              // style={{ borderColor: skin.participantColor }}
                            >
                              {/* Participant Avatar */}
                              <Image
                                alt={`${skin.participantUsername}'s Avatar`}
                                src={skin.participantImg}
                                width={25}
                                height={25}
                                className="rounded-full absolute right-1 top-1 border-2 border-white"
                              />

                              {/* Price Badge */}
                              <div className="flex items-center justify-start gap-0">
                                <div className="text-[#EEC475] text-[11px] absolute left-0 top-0 bg-[#2C2C2E] w-12 h-6 flex justify-center items-center">
                                  ${extractPrice(skin.price).toFixed(2)}
                                </div>
                                <div className="inclined-div h-6 w-4 absolute left-12 top-0 rotate bg-[#2C2C2E]"></div>
                              </div>

                              {/* Item Icon */}
                              <Image
                                src={skin.iconUrl}
                                alt={skin.name}
                                width={62}
                                height={62}
                                className="items-center justify-center absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%]"
                              />

                              {/* Item Name */}
                              <p className="text-white text-[10px] absolute bottom-0 text-left w-full px-1 truncate">
                                {skin.name}
                              </p>
                            </motion.div>
                          ))}
                        </motion.div>
                      </div>
                    </>
                  )}

                  <SlotMachine reels={initialReels} />

                  <JackpotStatus
                    participants={participants}
                    roundhash={roundHash}
                    onSpinCompleteInventryReload={handleOnSpinComplete}
                    showTimer={isNoActiveJackpot} // Pass the new prop here
                  />

                  {/* Last Four Jackpots */}
                  <LastFourJackpots />
                </div>
              ) : (
                <HistoryContent />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
