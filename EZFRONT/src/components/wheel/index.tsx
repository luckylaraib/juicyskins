// import audiom from "@/assets/audio/dice.mp3";
// import { motion, useAnimation } from "framer-motion";
// import { useEffect, useState, useMemo, useRef } from "react";
// import styled from "styled-components";
// import Pointer from "../pointer";

// const WheelContainer = styled.div`
//   width: 100%;
//   overflow: hidden;
//   position: relative;
//   height: 100px; 
//   border: 2px solid #2C2C2E
// `;

// const Wheel = styled(motion.div)<{ totalValue: number }>`
//   display: flex;
//   flex-direction: row;
//   width: 500%; 
//   height: 100%;
// `;

// const WheelItem = styled.div<{ bgColor: string; value: number; totalValue: number }>`
//   width: ${({ value, totalValue }) => (value / totalValue) * 100}%;
//   height: 100%;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   background-color: ${({ bgColor }) => bgColor || "#fff"};
//   position: relative; 
//   overflow: hidden;
//   transition: background-color 0.3s;

//   &::before {
//     content: "";
//     position: absolute;
//     top: 0;
//     left: 0;
//     width: 200%; 
//     height: 200%; 
//     background: linear-gradient(
//       45deg,
//       rgba(255, 255, 255, 0.1) 25%,
//       transparent 25%,
//       transparent 50%,
//       rgba(255, 255, 255, 0.1) 50%,
//       rgba(255, 255, 255, 0.1) 75%,
//       transparent 75%,
//       transparent
//     );
//     background-size: 20px 20px; 
//     pointer-events: none; 
//   }

//   &:not(:last-child) {
//     border-right: 2px solid #2e3746;
//   }
// `;

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

// interface Participant {
//   id: string; 
//   username: string;
//   items: Item[];
//   totalValue: number;
//   skinCount: number;
//   img: string;
//   color: string;
// }

// interface HorizontalWheelProps {
//   participants: Participant[];
//   winner: Participant | null; 
//   spinDuration: number; 
//   onSpinComplete?: () => void; 
// }

// interface WheelItemData {
//   id: string;
//   name: string;
//   value: number;
//   color: string;
// }

// const HorizontalWheel: React.FC<HorizontalWheelProps> = ({
//   participants,
//   winner,
//   spinDuration,
//   onSpinComplete,
// }) => {
//   const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
//   const controls = useAnimation();
//   const wheelRef = useRef<HTMLDivElement>(null);
//   const wheelContainerRef = useRef<HTMLDivElement>(null); 

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const newAudio = new Audio(audiom);
//       setAudio(newAudio);
//     }
//   }, []);

//   const totalValue = useMemo(() => {
//     return participants.reduce((acc, participant) => acc + participant.totalValue, 0);
//   }, [participants]);

//   const wheelItems: WheelItemData[] = useMemo(() => {
//     return participants.map((participant) => ({
//       id: participant.id, 
//       name: participant.username,
//       value: participant.totalValue, 
//       color: participant.color,
//     }));
//   }, [participants]);

//   const duplicatedWheelItems = useMemo(() => {
//     return [...wheelItems, ...wheelItems, ...wheelItems, ...wheelItems, ...wheelItems];
//   }, [wheelItems]);

//   useEffect(() => {
//     if (winner) {
//       handleSpin(winner);
//     }

//   }, [winner]);

//   const handleSpin = (winner: Participant) => {
//     if (audio) {
//       audio.play().catch((error) => {
//         console.error("Audio playback failed:", error);
//       });
//     }

//     const wheelItemColors = wheelItems.map((item) => item.color);
//     const winnerIndex = wheelItemColors.indexOf(winner.color);
//     if (winnerIndex === -1) return;

//     const cumulativeProportions: number[] = [];
//     wheelItems.reduce((acc, item, index) => {
//       cumulativeProportions[index] = acc + item.value / totalValue;
//       return cumulativeProportions[index];
//     }, 0);

//     const winnerCumulativeStart =
//       cumulativeProportions[winnerIndex] - wheelItems[winnerIndex].value / totalValue;
//     const winnerProportion = wheelItems[winnerIndex].value / totalValue;
//     const winnerMidpoint = winnerCumulativeStart + winnerProportion / 2;

//     const wheelElement = wheelRef.current;
//     if (!wheelElement) return;
//     const originalWheelWidth = wheelElement.scrollWidth / 5; 

//     const containerWidth = wheelContainerRef.current ? wheelContainerRef.current.offsetWidth : 0;

//     const spinDistancePixels = winnerMidpoint * originalWheelWidth - containerWidth / 2;

//     const loops = 3; 
//     const totalRotationPixels = originalWheelWidth * loops + spinDistancePixels;

//     controls
//       .start({
//         x: -totalRotationPixels,
//         transition: { duration: spinDuration / 1000, ease: "easeOut" },
//       })
//       .then(() => {

//         // controls.set({ x: 0 });

//         if (onSpinComplete) {
//           onSpinComplete();
//           controls.set({ x: 0 });
//         }
//       });
//   };

//   return (
//     <div className="relative flex flex-col items-center">
//       {}
//       <svg
//         fill="#2C2C2E"
//         className="absolute z-30 top-[2px] left-1/2 transform -translate-x-1/2 -rotate-180"
//         height="30px"
//         width="30px"
//         viewBox="0 0 490 490"
//         xmlns="http://www.w3.org/2000/svg"
//       >
//         <polygon points="245,0 490,490 0,490" />
//       </svg>

//       {}
//       <WheelContainer ref={wheelContainerRef}>
//         <Wheel animate={controls} totalValue={totalValue} ref={wheelRef}>
//           {duplicatedWheelItems.map((item, index) => (
//             <WheelItem
//               key={`${item.id}-${index}`}
//               value={item.value}
//               bgColor={item.color}
//               totalValue={totalValue}
//             >
//               {}
//               <div className="w-full flex justify-center items-center h-full">
//                 <span className="text-white font-bold">{item.name}</span>
//               </div>
//             </WheelItem>
//           ))}
//         </Wheel>
//       </WheelContainer>

//       {}
//       <svg
//         fill="#2C2C2E"
//         className="absolute z-30 bottom-[2px] left-1/2 transform -translate-x-1/2"
//         height="30px"
//         width="30px"
//         viewBox="0 0 490 490"
//         xmlns="http://www.w3.org/2000/svg"
//       >
//         <polygon points="245,0 490,490 0,490" />
//       </svg>
//     </div>
//   );
// };

// export default HorizontalWheel;



// components/wheel/HorizontalWheel.tsx

import audiom from "@/assets/audio/dice.mp3";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState, useMemo, useRef } from "react";
import styled from "styled-components";
import Pointer from "../pointer"; // Ensure you have a Pointer component or adjust accordingly

const WheelContainer = styled.div`
  width: 100%;
  overflow: hidden;
  position: relative;
  height: 100px;
  border: 2px solid #2c2c2e;
  border-radius: 10px; /* Added for better aesthetics */
  background-color: #1e1e1e; /* Dark background for contrast */
`;

const Wheel = styled(motion.div)<{ totalValue: number }>`
  display: flex;
  flex-direction: row;
  width: 500%;
  height: 100%;
`;

const WheelItem = styled.div<{ bgColor: string; value: number; totalValue: number }>`
  width: ${({ value, totalValue }) => (value / totalValue) * 100}%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ bgColor }) => bgColor || "#fff"};
  position: relative;
  overflow: hidden;
  transition: background-color 0.3s;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.1) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0.1) 75%,
      transparent 75%,
      transparent
    );
    background-size: 20px 20px;
    pointer-events: none;
  }

  &:not(:last-child) {
    border-right: 2px solid #2e3746;
  }
`;

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

interface Participant {
  id: string;
  username: string;
  items: Item[];
  totalValue: number;
  skinCount: number;
  img: string;
  color: string;
}

interface HorizontalWheelProps {
  participants: Participant[];
  winner: Participant | null;
  spinDuration: number;
  onSpinComplete?: () => void;
}

interface WheelItemData {
  id: string;
  name: string;
  value: number;
  color: string;
}

const HorizontalWheel: React.FC<HorizontalWheelProps> = ({
  participants,
  winner,
  spinDuration,
  onSpinComplete,
}) => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const controls = useAnimation();
  const wheelRef = useRef<HTMLDivElement>(null);
  const wheelContainerRef = useRef<HTMLDivElement>(null);
  const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Ref to store the timeout ID

  useEffect(() => {
    if (typeof window !== "undefined") {
      const newAudio = new Audio(audiom);
      setAudio(newAudio);
    }

    // Cleanup function to clear timeout when component unmounts
    return () => {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  const totalValue = useMemo(() => {
    return participants.reduce((acc, participant) => acc + participant.totalValue, 0);
  }, [participants]);

  const wheelItems: WheelItemData[] = useMemo(() => {
    return participants.map((participant) => ({
      id: participant.id,
      name: participant.username,
      value: participant.totalValue,
      color: participant.color,
    }));
  }, [participants]);

  const duplicatedWheelItems = useMemo(() => {
    // Duplicate the wheel items 5 times for seamless spinning
    return [...wheelItems, ...wheelItems, ...wheelItems, ...wheelItems, ...wheelItems];
  }, [wheelItems]);

  useEffect(() => {
    if (winner) {
      handleSpin(winner);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [winner]); // Removed dependencies on wheelItems and totalValue to prevent unnecessary re-renders

  const handleSpin = async (winner: Participant) => {
    if (audio) {
      try {
        await audio.play();
      } catch (error) {
        console.error("Audio playback failed:", error);
      }
    }

    const wheelItemColors = wheelItems.map((item) => item.color);
    const winnerIndex = wheelItemColors.indexOf(winner.color);
    if (winnerIndex === -1) return;

    const cumulativeProportions: number[] = [];
    wheelItems.reduce((acc, item, index) => {
      cumulativeProportions[index] = acc + item.value / totalValue;
      return cumulativeProportions[index];
    }, 0);

    const winnerCumulativeStart =
      cumulativeProportions[winnerIndex] - wheelItems[winnerIndex].value / totalValue;
    const winnerProportion = wheelItems[winnerIndex].value / totalValue;
    const winnerMidpoint = winnerCumulativeStart + winnerProportion / 2;

    const wheelElement = wheelRef.current;
    if (!wheelElement) return;
    const originalWheelWidth = wheelElement.scrollWidth / 5; // Because duplicated 5 times

    const containerWidth = wheelContainerRef.current
      ? wheelContainerRef.current.offsetWidth
      : 0;

    const spinDistancePixels = winnerMidpoint * originalWheelWidth - containerWidth / 2;

    const loops = 3;
    const totalRotationPixels = originalWheelWidth * loops + spinDistancePixels;

    try {
      // Start the spin animation
      await controls.start({
        x: -totalRotationPixels,
        transition: { duration: spinDuration / 1000, ease: "easeOut" },
      });

      // Trigger the onSpinComplete callback if provided
      if (onSpinComplete) {
        onSpinComplete();
      }

      // Set a delay before resetting the wheel
      const resetDelay = 1000; 

      resetTimeoutRef.current = setTimeout(async () => {
        // Animate the wheel back to the initial position smoothly
        await controls.start({
          x: 0,
          transition: { duration: 1, ease: "easeInOut" }, // Adjust duration as needed
        });
      }, resetDelay);
    } catch (error) {
      console.error("Animation error:", error);
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Top Pointer SVG */}
      <svg
        fill="#2C2C2E"
        className="absolute z-30 top-[2px] left-1/2 transform -translate-x-1/2 -rotate-180"
        height="30px"
        width="30px"
        viewBox="0 0 490 490"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polygon points="245,0 490,490 0,490" />
      </svg>

      {/* Wheel */}
      <WheelContainer ref={wheelContainerRef}>
        <Wheel animate={controls} totalValue={totalValue} ref={wheelRef}>
          {duplicatedWheelItems.map((item, index) => (
            <WheelItem
              key={`${item.id}-${index}`}
              value={item.value}
              bgColor={item.color}
              totalValue={totalValue}
            >
              {/* Wheel Item Content */}
              {/* <div className="w-full flex justify-center items-center h-full">
                <span className="text-white font-bold">{item.name}</span>
              </div> */}
            </WheelItem>
          ))}
        </Wheel>
      </WheelContainer>

      {/* Bottom Pointer SVG */}
      <svg
        fill="#2C2C2E"
        className="absolute z-30 bottom-[2px] left-1/2 transform -translate-x-1/2"
        height="30px"
        width="30px"
        viewBox="0 0 490 490"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polygon points="245,0 490,490 0,490" />
      </svg>

      {/* Optional: Add Pointer component if you have one */}
      {/* <Pointer /> */}
    </div>
  );
};

export default HorizontalWheel;





// import audiom from "@/assets/audio/dice.mp3";
// import { motion, useAnimation } from "framer-motion";
// import { useEffect, useState, useMemo, useRef } from "react";
// import styled from "styled-components";
// // import Pointer from "../pointer"; // Ensure you have a Pointer component or adjust accordingly

// const WheelContainer = styled.div`
//   width: 100%;
//   overflow: hidden;
//   position: relative;
//   height: 100px;
//   border: 2px solid #2c2c2e;
//   border-radius: 10px; /* Added for better aesthetics */
//   background-color: #1e1e1e; /* Dark background for contrast */
// `;

// const Wheel = styled(motion.div)<{ totalValue: number }>`
//   display: flex;
//   flex-direction: row;
//   width: 500%;
//   height: 100%;
// `;

// const WheelItem = styled.div<{ bgColor: string; value: number; totalValue: number }>`
//   width: ${({ value, totalValue }) => (value / totalValue) * 100}%;
//   height: 100%;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   background-color: ${({ bgColor }) => bgColor || "#fff"};
//   position: relative;
//   overflow: hidden;
//   transition: background-color 0.3s;

//   &::before {
//     content: "";
//     position: absolute;
//     top: 0;
//     left: 0;
//     width: 200%;
//     height: 200%;
//     background: linear-gradient(
//       45deg,
//       rgba(255, 255, 255, 0.1) 25%,
//       transparent 25%,
//       transparent 50%,
//       rgba(255, 255, 255, 0.1) 50%,
//       rgba(255, 255, 255, 0.1) 75%,
//       transparent 75%,
//       transparent
//     );
//     background-size: 20px 20px;
//     pointer-events: none;
//   }

//   &:not(:last-child) {
//     border-right: 2px solid #2e3746;
//   }
// `;

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

// interface Participant {
//   id: string;
//   username: string;
//   items: Item[];
//   totalValue: number;
//   skinCount: number;
//   img: string;
//   color: string;
// }

// interface HorizontalWheelProps {
//   participants: Participant[];
//   winner: Participant | null;
//   spinDuration: number;
//   onSpinComplete?: () => void;
// }

// interface WheelItemData {
//   id: string;
//   name: string;
//   value: number;
//   color: string;
// }

// const HorizontalWheel: React.FC<HorizontalWheelProps> = ({
//   participants,
//   winner,
//   spinDuration,
//   onSpinComplete,
// }) => {
//   const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
//   const controls = useAnimation();
//   const wheelRef = useRef<HTMLDivElement>(null);
//   const wheelContainerRef = useRef<HTMLDivElement>(null);
//   const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Ref to store the timeout ID

//   // State to manage current wheel items
//   const [currentWheelItems, setCurrentWheelItems] = useState<WheelItemData[]>([]);

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const newAudio = new Audio(audiom);
//       setAudio(newAudio);
//     }

//     // Initialize wheel items based on participants
//     const items = participants.map((participant) => ({
//       id: participant.id,
//       name: participant.username,
//       value: participant.totalValue,
//       color: participant.color,
//     }));
//     setCurrentWheelItems(items);

//     // Cleanup function to clear timeout when component unmounts
//     return () => {
//       if (resetTimeoutRef.current) {
//         clearTimeout(resetTimeoutRef.current);
//       }
//     };
//   }, [participants]);

//   const totalValue = useMemo(() => {
//     return currentWheelItems.reduce((acc, participant) => acc + participant.value, 0);
//   }, [currentWheelItems]);

//   const duplicatedWheelItems = useMemo(() => {
//     // Duplicate the wheel items 5 times for seamless spinning
//     return [...currentWheelItems, ...currentWheelItems, ...currentWheelItems, ...currentWheelItems, ...currentWheelItems];
//   }, [currentWheelItems]);

//   useEffect(() => {
//     if (winner) {
//       handleSpin(winner);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [winner]); // Removed dependencies on wheelItems and totalValue to prevent unnecessary re-renders

//   const handleSpin = async (winner: Participant) => {
//     if (audio) {
//       try {
//         await audio.play();
//       } catch (error) {
//         console.error("Audio playback failed:", error);
//       }
//     }

//     const wheelItemColors = currentWheelItems.map((item) => item.color);
//     const winnerIndex = wheelItemColors.indexOf(winner.color);
//     if (winnerIndex === -1) return;

//     const cumulativeProportions: number[] = [];
//     currentWheelItems.reduce((acc, item, index) => {
//       cumulativeProportions[index] = acc + item.value / totalValue;
//       return cumulativeProportions[index];
//     }, 0);

//     const winnerCumulativeStart =
//       cumulativeProportions[winnerIndex] - currentWheelItems[winnerIndex].value / totalValue;
//     const winnerProportion = currentWheelItems[winnerIndex].value / totalValue;
//     const winnerMidpoint = winnerCumulativeStart + winnerProportion / 2;

//     const wheelElement = wheelRef.current;
//     if (!wheelElement) return;
//     const originalWheelWidth = wheelElement.scrollWidth / 5; // Because duplicated 5 times

//     const containerWidth = wheelContainerRef.current
//       ? wheelContainerRef.current.offsetWidth
//       : 0;

//     const spinDistancePixels = winnerMidpoint * originalWheelWidth - containerWidth / 2;

//     const loops = 3;
//     const totalRotationPixels = originalWheelWidth * loops + spinDistancePixels;

//     try {
//       // Start the spin animation
//       await controls.start({
//         x: -totalRotationPixels,
//         transition: { duration: spinDuration / 1000, ease: "easeOut" },
//       });

//       // Trigger the onSpinComplete callback if provided
//       if (onSpinComplete) {
//         onSpinComplete();
//       }

//       // Set a delay before resetting the wheel
//       const resetDelay = 1000; // 1 second delay (adjust as needed)

//       resetTimeoutRef.current = setTimeout(async () => {
//         // Animate the wheel back to the initial position smoothly
//         await controls.start({
//           x: 0,
//           transition: { duration: 1, ease: "easeInOut" }, // Adjust duration as needed
//         });

//         // Clear the wheel items after reset
//         setCurrentWheelItems([]);
//       }, resetDelay);
//     } catch (error) {
//       console.error("Animation error:", error);
//     }
//   };

//   return (
//     <div className="relative flex flex-col items-center">
//       {/* Top Pointer SVG */}
//       <svg
//         fill="#2C2C2E"
//         className="absolute z-30 top-[2px] left-1/2 transform -translate-x-1/2 -rotate-180"
//         height="30px"
//         width="30px"
//         viewBox="0 0 490 490"
//         xmlns="http://www.w3.org/2000/svg"
//       >
//         <polygon points="245,0 490,490 0,490" />
//       </svg>

//       {/* Wheel */}
//       <WheelContainer ref={wheelContainerRef}>
//         <Wheel animate={controls} totalValue={totalValue} ref={wheelRef}>
//           {duplicatedWheelItems.map((item, index) => (
//             <WheelItem
//               key={`${item.id}-${index}`}
//               value={item.value}
//               bgColor={item.color}
//               totalValue={totalValue}
//             >
//               {/* Wheel Item Content */}
//               <div className="w-full flex justify-center items-center h-full">
//                 <span className="text-white font-bold">{item.name}</span>
//               </div>
//             </WheelItem>
//           ))}
//         </Wheel>
//       </WheelContainer>

//       {/* Bottom Pointer SVG */}
//       <svg
//         fill="#2C2C2E"
//         className="absolute z-30 bottom-[2px] left-1/2 transform -translate-x-1/2"
//         height="30px"
//         width="30px"
//         viewBox="0 0 490 490"
//         xmlns="http://www.w3.org/2000/svg"
//       >
//         <polygon points="245,0 490,490 0,490" />
//       </svg>

//       {/* Optional: Add Pointer component if you have one */}
//       {/* <Pointer /> */}
//     </div>
//   );
// };

// export default HorizontalWheel;

