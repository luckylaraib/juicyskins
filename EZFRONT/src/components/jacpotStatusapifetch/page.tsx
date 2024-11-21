// "use client";

// import { useEffect, useState, useMemo } from "react";
// import { io, Socket } from "socket.io-client";
// import Image from "next/image";
// import styled from "styled-components";
// import { motion } from "framer-motion";

// import HorizontalWheel from "../wheel/index"; 
// import TimerBox from "../timer/timer"; 
// import Modal from "../ModalInventory"; 
// import ItemBadge from "./itembadge"

// const SOCKET_SERVER_URL =
//   process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "http://localhost:5000";

// interface Item {
//   _id: string;
//   name: string;
//   iconUrl: string;
//   price: string; 
//   tradable: boolean;
//   owner: string;
//   assetId: string;
//   appId: number;
//   contextId: number;
//   createdAt: string; 
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
//   createdAt: string; 
//   __v: number;
// }

// interface ParticipantData {
//   user: User;
//   items: Item[];
//   color: string; 
// }

// interface Participant {
//   id: string; 
//   username: string;
//   items: Item[]; 
//   totalValue: number;
//   skinCount: number;
//   img: string;
//   color: string; 
// }

// interface WinnerData {
//   id: string;
//   username: string;
//   items: Item[];
//   totalValue: number;
//   skinCount: number;
//   img: string;
//   color: string;
// }

// // interface RoundResult {
// //   winner: WinnerData;
// // }


// interface SpinEventData {
//   winnerId: WinnerData;
//   startTime: number; 
//   duration: number; 
// }

// const WinnerAnnouncement = styled(motion.div)<{ bgColor: string }>`
//   width: 100%;
//   background-color: ${({ bgColor }) => bgColor || "#000"};
//   padding: 20px;
//   color: #fff;
//   margin-top: 20px; 
//   position: relative;
//   overflow: hidden;
//   display: flex;
//   justify-content: center;
//   align-items: center;

//   &::before {
//     content: "";
//     position: absolute;
//     top: 0;
//     left: 0;
//     width: 200%; 
//     height: 200%; 
//     background: linear-gradient(
//       135deg,
//       rgba(255, 255, 255, 0.2) 25%,
//       transparent 25%,
//       transparent 50%,
//       rgba(255, 255, 255, 0.2) 50%,
//       rgba(255, 255, 255, 0.2) 75%,
//       transparent 75%,
//       transparent
//     );
//     background-size: 20px 20px; 
//     pointer-events: none; 
//     animation: moveBackground 2s linear infinite;
//   }

//   @keyframes moveBackground {
//     from {
//       background-position: 0 0;
//     }
//     to {
//       background-position: 40px 40px;
//     }
//   }

//   .content {
//     position: relative;
//     z-index: 1;
//     font-size: 1.5rem;
//     font-weight: bold;
//   }
// `;

// interface JackpotStatusProps {
//   roundhash: string;
//   participants: Participant[];
//   onSpinCompleteInventryReload: any
// }

// export default function JackpotStatus({ participants, roundhash, onSpinCompleteInventryReload }: JackpotStatusProps) {
//   const [winner, setWinner] = useState<Participant | null>(null);
//   const [spinDuration, setSpinDuration] = useState<number>(5000); 
//   const [totalPotValue, setTotalPotValue] = useState<number>(0);

//   const [showWinnerAnnouncement, setShowWinnerAnnouncement] = useState(false);

//   useEffect(() => {
//     const socket: Socket = io(SOCKET_SERVER_URL);

//     // socket.on("roundResult", (data: RoundResult) => {
//     //   const winnerData = data.winner;

//     //   const winnerParticipant: Participant = {
//     //     id: winnerData.id,
//     //     username: winnerData.username || "Unknown",
//     //     items: winnerData.items,
//     //     totalValue: winnerData.totalValue,
//     //     skinCount: winnerData.skinCount,
//     //     img: winnerData.img || "/default-avatar.png",
//     //     color: winnerData.color,
//     //   };

//     //   setWinner(winnerParticipant);

//     // });

//     socket.on("spin", (data: SpinEventData) => {
      
//       const { winnerId, startTime, duration } = data;
//       const winnerData = winnerId;
  
//       const winnerParticipant: Participant = {
//         id: winnerData.id,
//         username: winnerData.username || "Unknown",
//         items: winnerData.items,
//         totalValue: winnerData.totalValue,
//         skinCount: winnerData.skinCount,
//         img: winnerData.img || "/default-avatar.png",
//         color: winnerData.color,
//       };
//       setTotalPotValue(+totalJackpotValue.toFixed(2));
//       setWinner(winnerParticipant);

//       setSpinDuration(duration);
//       const delay = startTime - Date.now();

//       if (delay < 0) {

//         initiateSpin(winnerId, duration);
//       } else {

//         setTimeout(() => {
//           initiateSpin(winnerId, duration);
//         }, delay);
//       }
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, [participants]);

//   const initiateSpin = (winnerId: WinnerData, duration: number) => {
//     const winnerParticipant = participants.find((p) => p.color === winnerId.color);
//     if (winnerParticipant) {

//       setShowWinnerAnnouncement(false); 
//     }
//   };

// /*************  ✨ Codeium Command 🌟  *************/
//   /**
//    * Handles the spin completion by showing the winner announcement and reloading the inventory
//    */
//   const handleOnSpinComplete = () => {
//     // Show the winner announcement
//     setShowWinnerAnnouncement(true);

//     // Reload the inventory
//     onSpinCompleteInventryReload();
//   };


//   const totalJackpotValue: number = useMemo(() => {
//     return participants.reduce((acc, participant) => acc + participant.totalValue, 0);
//   }, [participants]);

//   const totalSkins: number = useMemo(() => {
//     return participants.reduce((acc, participant) => acc + participant.skinCount, 0);
//   }, [participants]);

//   return (
//     <>
//       <div className="w-full mt-10 text-center">
//         <div className="w-full relative">
//           <div className="flex justify-between items-center z-30 -top-3 px-5 absolute w-full">
//             <div className="bg-[#3D3A40]  text-[10px] md:text-sm text-white px-2 py-1 w-40 itemsOfWHEEL">
//               Total pot Value:{" "}
//               <span className="text-yellow-300">${totalJackpotValue.toFixed(2)}</span>
//             </div>
//             <div className="bg-[#3D3A40] rounded-md text-[10px] md:text-sm text-white px-2 py-1 w-40 itemsOfWHEEL">
//               Skinscount: <span className="text-yellow-300">{totalSkins}</span>
//             </div>
//           </div>
//           <HorizontalWheel
//             participants={participants}
//             winner={winner}
//             spinDuration={spinDuration}
//             onSpinComplete={() => handleOnSpinComplete()}
//           />
//         </div>
//       </div>

//       <div className="-mt-10">
//         <TimerBox />
//       </div>

//       <div className="w-full">
//         <div className="w-11/12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-7 mx-auto">
//           {participants.map((participant) => (
//             <ParticipantCard key={participant.id} participant={participant} total={totalJackpotValue}/>
//           ))}
//         </div>
//         <p className="text-gray-300 text-[10px] md:text-sm text-center mt-10">
//           Round hash: {roundhash}
//         </p>
//       </div>
//       {showWinnerAnnouncement && winner && (

//         <div className="flex justify-center">
//           <WinnerAnnouncement
//             bgColor={winner.color}
//             initial={{ opacity: 0, y: 50 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 1 }}
//           >
//           <div className="bg-[#392A08] text-sm md:text-base text-white px-5 rounded-lg ">
//             dot <span className="text-[#FFC839]"> | </span> {winner.username} {"  "}
//             ezskin.com won the pot valued at{" "}
//             <span className="text-[#FFC839]"> {totalPotValue}</span> with the chance
//             of {(winner.totalValue / totalPotValue * 100).toFixed(2)}%
//           </div>
//           </WinnerAnnouncement>
//         </div>
//       )}
//     </>
//   );
// }

// interface ParticipantCardProps {
//   participant: Participant;
//   total: number
// }

// const ParticipantCard: React.FC<ParticipantCardProps> = ({ participant, total }) => {
//   const [showAll, setShowAll] = useState<boolean>(false);

//   const handleShowAll = () => {
//     setShowAll(true);
//   };

//   const handleClose = () => {
//     setShowAll(false);
//   };

//   return (
//     <>
//       <div
//       className="w-full rounded-r-xl"
//         style={{  
//           background: `${participant.color}`,
//           paddingRight: "8px",
//         }}
//       >
//         {participant.items.length > 0 && (
//           <div
//             className="flex items-center pl-4 col-span-2 p-2 cursor-pointer transition-colors duration-200 hover:bg-headerBackground h-20"
//             onClick={handleShowAll}
//             style={{ background: "rgba(72, 64, 68, 0.9)" }}
//             title="View all skins"
//           >
//             <Image
//               width={45}
//               height={45}
//               className="rounded-full border-5"
//               src={participant.img}
//               alt={participant.username}
//             />
//             <div className="flex flex-col pl-2">
//               <div className="flex ">
//                 <div className="h-5 px-1 rounded-sm flex items-center justify-center bg-[#FFC839] text-[8px]">
//                   {}
//                 </div>
//                 <p className="text-headerText ml-1 text-[12px]">
//                   <span className="font-semibold text-white">{participant.username}</span>{" "}
//                 </p>
//               </div>
//               <p className="text-[12px] text-white">
//                 {participant.skinCount} {participant.skinCount === 1 ? "Skin" : "Skins"} | $
//                 {participant.totalValue.toFixed(2)} | 
//                 {(participant.totalValue/total  * 100).toFixed(2)} %
//               </p>
//             </div>
//           </div>
//         )}
//       </div>
//       <Modal 
//         isOpen={showAll} 
//         onClose={handleClose} 
//         title={`${participant.username}'s Skins`} 
//         borderColor={participant.color}
//       >
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-h-[90%] h-96 lg:h-auto overflow-y-auto px-2 pb-5">
//           {participant.items.map((item) => (
//             <ItemBadge key={item.assetId} item={item} />
//           ))}
//         </div>
//       </Modal>

//     </>
//   );

// };





"use client";

import { useEffect, useState, useMemo } from "react";
import { io, Socket } from "socket.io-client";
import Image from "next/image";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

import HorizontalWheel from "../wheel/index"; 
import TimerBox from "../timer/timer"; 
import Modal from "../ModalInventory"; 
import ItemBadge from "./itembadge";

const SOCKET_SERVER_URL =
  process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "http://localhost:5000";

// Interfaces
interface Item {
  _id: string;
  name: string;
  iconUrl: string;
  price: string; 
  tradable: boolean;
  owner: string;
  assetId: string;
  appId: number;
  contextId: number;
  createdAt: string; 
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
  createdAt: string; 
  __v: number;
}

interface ParticipantData {
  user: User;
  items: Item[];
  color: string; 
}

interface Participant {
  id: string; 
  username: string;
  items: Item[]; 
  totalValue: number;
  skinCount: number;
  img: string;
  color: string; 
}

interface WinnerData {
  id: string;
  username: string;
  items: Item[];
  totalValue: number;
  skinCount: number;
  img: string;
  color: string;
}

interface SpinEventData {
  winnerId: WinnerData;
  startTime: number; 
  duration: number; 
}

interface JackpotStatusProps {
  roundhash: string;
  participants: Participant[];
  onSpinCompleteInventryReload: () => void;
  showTimer: boolean;
}

// Styled Component for Winner Announcement
const WinnerAnnouncement = styled(motion.div)<{ bgColor: string }>`
  width: 100%;
  background-color: ${({ bgColor }) => bgColor || "#000"};
  padding: 20px;
  color: #fff;
  margin-top: 20px; 
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 200%; 
    height: 200%; 
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.2) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0.2) 75%,
      transparent 75%,
      transparent
    );
    background-size: 20px 20px; 
    pointer-events: none; 
    animation: moveBackground 2s linear infinite;
  }

  @keyframes moveBackground {
    from {
      background-position: 0 0;
    }
    to {
      background-position: 40px 40px;
    }
  }

  .content {
    position: relative;
    z-index: 1;
    font-size: 1.5rem;
    font-weight: bold;
  }
`;

// Animation Variants for Countdown and Announcement
const countdownVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const announcementVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
};

// JackpotStatus Component
export default function JackpotStatus({
  participants,
  roundhash,
  onSpinCompleteInventryReload,
  showTimer,
}: JackpotStatusProps) {
  const [winner, setWinner] = useState<Participant | null>(null);
  const [spinDuration, setSpinDuration] = useState<number>(5000); 
  const [totalPotValue, setTotalPotValue] = useState<number>(0);

  const [showWinnerAnnouncement, setShowWinnerAnnouncement] = useState(false);
  const [nextRoundCountdown, setNextRoundCountdown] = useState<number | null>(null);
  const [socketConnected, setSocketConnected] = useState<boolean>(false); // Optional: To track connection

  // Calculate Total Jackpot Value
  const totalJackpotValue: number = useMemo(() => {
    return participants.reduce((acc, participant) => acc + participant.totalValue, 0);
  }, [participants]);

  // Calculate Total Number of Skins
  const totalSkins: number = useMemo(() => {
    return participants.reduce((acc, participant) => acc + participant.skinCount, 0);
  }, [participants]);

  useEffect(() => {
    const socket: Socket = io(SOCKET_SERVER_URL);

    // Handle connection events (optional)
    socket.on("connect", () => {
      setSocketConnected(true);
    });

    socket.on("disconnect", () => {
      setSocketConnected(false);
    });
    console.log(showTimer);
    
    // Listen for 'spin' event to initiate the wheel spin
    socket.on("spin", (data: SpinEventData) => {
      const { winnerId, startTime, duration } = data;
      const winnerParticipant: Participant = {
        id: winnerId.id,
        username: winnerId.username || "Unknown",
        items: winnerId.items,
        totalValue: winnerId.totalValue,
        skinCount: winnerId.skinCount,
        img: winnerId.img || "/default-avatar.png",
        color: winnerId.color,
      };
      setTotalPotValue(totalJackpotValue); // Ensure totalPotValue is correctly set
      setWinner(winnerParticipant);

      setSpinDuration(duration);
      const delay = startTime - Date.now();

      if (delay < 0) {
        initiateSpin(winnerParticipant, duration);
      } else {
        setTimeout(() => {
          initiateSpin(winnerParticipant, duration);
        }, delay);
      }
    });

    // Listen for 'nextRoundTimer' event to update the countdown
    socket.on("nextRoundTimer", (data: { timeLeft: number }) => {
      const { timeLeft } = data;
      setNextRoundCountdown(timeLeft);
    });

    // Listen for 'newRoundStarted' event to handle any post-countdown logic
    socket.on("newRoundStarted", () => {
      // Optionally, reset any state or show a message
      setNextRoundCountdown(null); // Reset the countdown
    });

    return () => {
      socket.disconnect();
    };
  }, [participants, totalPotValue]);

  /**
   * Initiates the wheel spin animation
   * @param winner - The participant who won
   * @param duration - Duration of the spin animation in milliseconds
   */
  const initiateSpin = (winnerParticipant: Participant, duration: number) => {
    // Trigger the spin animation in HorizontalWheel
    setWinner(winnerParticipant);
    setSpinDuration(duration);
  };

  /**
   * Handles the spin completion by showing the winner announcement and reloading the inventory
   */
  const handleOnSpinComplete = () => {
    // Show the winner announcement
    setShowWinnerAnnouncement(true);

    // Reload the inventory
    onSpinCompleteInventryReload();
  };

  return (
    <>
      {/* Connection Status */}
      {!socketConnected && (
        <motion.div
          className="mt-4 text-center text-red-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          Disconnected from the server. Please check your connection.
        </motion.div>
      )}

      {/* Jackpot Wheel and Stats */}
      <div className="w-full mt-10 text-center">
        <div className="w-full relative mx-auto">
          <div className="flex justify-between items-center gap-x-6 md:gap-x-0 z-30 -top-2 md:-top-3 px-[2px] md:px-5 absolute w-full">
            <div className="bg-[#3D3A40]  text-[8px] md:text-sm text-white px-2 py-1 w-40 itemsOfWHEEL border-headerBackground border-2">
              Total pot Value:{" "}
              <span className="text-yellow-300">${totalJackpotValue.toFixed(2)}</span>
            </div>
            <div className="bg-[#3D3A40] rounded-md text-[8px] md:text-sm text-white px-2 py-1 w-40 itemsOfWHEEL border-headerBackground border-2">
              Skinscount: <span className="text-yellow-300">{totalSkins}</span>
            </div>
          </div>
          <HorizontalWheel
            participants={participants}
            winner={winner}
            spinDuration={spinDuration}
            onSpinComplete={handleOnSpinComplete}
          />
        </div>
      </div>

      {/* Timer Box */}
      <div className="-mt-10">
        <TimerBox />
      </div>

      {/* Participants Grid */}
      <div className="w-full">
        <div className="w-11/12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-7 mx-auto">
          {participants.map((participant) => (
            <ParticipantCard key={participant.id} participant={participant} total={totalJackpotValue}/>
          ))}
        </div>
        <p className="text-gray-300 text-[10px] md:text-sm text-center mt-10">
          Round hash: {roundhash}
        </p>
      </div>
      
      {/* Winner Announcement */}
      {showWinnerAnnouncement && winner && (
        <div className="flex justify-center">
          <WinnerAnnouncement
            bgColor={winner.color}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <div className="bg-[#392A08] text-sm md:text-base text-white px-5 rounded-lg ">
              🎉 <span className="text-[#FFC839]"> | </span> {winner.username}{" "}
              ezskin.com won the pot valued at{" "}
              <span className="text-[#FFC839]"> ${winner.totalValue.toFixed(2)}</span> with a chance
              of {(winner.totalValue / totalPotValue * 100).toFixed(2)}%
            </div>
          </WinnerAnnouncement>
        </div>
      )}

      {/* Next Round Countdown & Announcement */}
      <div className="w-full flex justify-center mt-6">
        <AnimatePresence>
          {nextRoundCountdown !== null && nextRoundCountdown > 0 && (
            <motion.div
              key="countdown"
              className="px-6 py-4 bg-gradient-to-r from-blue-600 to-slate-600 rounded-lg shadow-lg text-center text-white cursor-default"
              variants={countdownVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              role="alert"
              aria-live="polite"
            >
              <div className="flex items-center justify-center space-x-3">
                <span className="text-3xl animate-pulse">⏰</span>
                <span className="text-lg md:text-xl font-semibold">
                  Next jackpot starts in:{" "}
                  <span className="font-extrabold text-yellow-300">
                    {nextRoundCountdown}
                  </span>{" "}
                  second{nextRoundCountdown !== 1 ? "s" : ""}
                </span>
              </div>
            </motion.div>
          )}

          {nextRoundCountdown === 0 && (
            <motion.div
              key="announcement"
              className="px-6 py-4 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg shadow-lg text-center text-white cursor-default"
              variants={announcementVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              role="alert"
              aria-live="assertive"
            >
              <div className="flex items-center justify-center space-x-3">
                <span className="text-3xl animate-bounce">🎉</span>
                <span className="text-lg md:text-xl font-semibold">
                  New jackpot has started!
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

// ParticipantCard Component
interface ParticipantCardProps {
  participant: Participant;
  total: number;
}

const ParticipantCard: React.FC<ParticipantCardProps> = ({ participant, total }) => {
  const [showAll, setShowAll] = useState<boolean>(false);

  const handleShowAll = () => {
    setShowAll(true);
  };

  const handleClose = () => {
    setShowAll(false);
  };

  return (
    <>
      <div
        className="w-full rounded-r-xl"
        style={{  
          background: `${participant.color}`,
          paddingRight: "8px",
        }}
      >
        {participant.items.length > 0 && (
          <div
            className="flex items-center pl-4 p-2 cursor-pointer transition-colors duration-200 hover:bg-headerBackground h-20"
            onClick={handleShowAll}
            style={{ background: "rgba(72, 64, 68, 0.9)" }}
            title="View all skins"
          >
            <Image
              width={45}
              height={45}
              className="rounded-full border-5"
              src={participant.img}
              alt={participant.username}
            />
            <div className="flex flex-col pl-2">
              <div className="flex items-center">
                <div className="h-5 px-1 rounded-sm flex items-center justify-center bg-[#FFC839] text-[8px]">
                  {/* Placeholder for any badge or indicator */}
                </div>
                <p className="text-headerText ml-1 text-[12px]">
                  <span className="font-semibold text-white">{participant.username}</span>{" "}
                </p>
              </div>
              <p className="text-[12px] text-white">
                {participant.skinCount} {participant.skinCount === 1 ? "Skin" : "Skins"} | $
                {participant.totalValue.toFixed(2)} | 
                {(participant.totalValue / total * 100).toFixed(2)}%
              </p>
            </div>
          </div>
        )}
      </div>
      <Modal 
        isOpen={showAll} 
        onClose={handleClose} 
        title={`${participant.username}'s Skins`} 
        borderColor={participant.color}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-h-[90%] h-96 lg:h-auto overflow-y-auto px-2 pb-5">
          {participant.items.map((item) => (
            <ItemBadge key={item.assetId} item={item} />
          ))}
        </div>
      </Modal>
    </>
  );
};
