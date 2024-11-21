// components/TimerBox.tsx

import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import styled from "styled-components";

interface TimerData {
  timeLeft: number;
}

interface TimerBoxProps {
  onTimerEnd?: () => void; // Optional callback when timer ends
}

const TimeBarContainer = styled.div`
  width: 100%;
  max-width: 700px; /* Adjust as needed */
  background-color: #ddd;
  border-radius: 25px;
  overflow: hidden;
  margin: 20px auto; /* Center the bar */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const TimeBarFiller = styled.div<{ percentage: number }>`
  height: 5px; /* Adjust height as needed */
  width: ${({ percentage }) => percentage}%;
  background: linear-gradient(
    to right,
    #4caf50, /* Green */
    #8bc34a, /* Light Green */
    #4caf50  /* Lime */
  );
  transition: width 1s linear;
`;


const TimeText = styled.div`
  text-align: center;
  margin-top: 10px;
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
`;

const TimerBox: React.FC<TimerBoxProps> = ({ onTimerEnd }) => {
  const [timeLeft, setTimeLeft] = useState<number>(120); // Initialize with total duration
  const [percentage, setPercentage] = useState<number>(100); // Start full
  const SOCKET_SERVER_URL =
    process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "http://localhost:5000";

  useEffect(() => {
    const socket: Socket = io(SOCKET_SERVER_URL);

    // Listen for timer updates from the server
    socket.on("timer", (data: TimerData) => {
      setTimeLeft(data.timeLeft);
      // Calculate percentage based on initial time (assuming 120 seconds)
      const newPercentage = (data.timeLeft / 120) * 100;
      setPercentage(newPercentage);

      if (data.timeLeft === 0 && onTimerEnd) {
        onTimerEnd();
      }
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [SOCKET_SERVER_URL, onTimerEnd]);

  return (
    <div className="timer-container justify-center">
      <TimeBarContainer>
        <TimeBarFiller percentage={percentage} />
      </TimeBarContainer>
      {/* <TimeText>{timeLeft} second{timeLeft !== 1 ? "s" : ""} left</TimeText> */}
      <style jsx>{`
        .timer-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 20px;
          width: 90%;
        }

        @media (min-width: 768px) {
          .timer-container {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default TimerBox;


// // components/TimerBox.tsx

// import { useState, useEffect } from "react";
// import { io, Socket } from "socket.io-client";

// interface TimerData {
//   timeLeft: number;
// }

// interface TimerBoxProps {
//   onTimerEnd?: () => void; // Optional callback when timer ends
// }

// const TimerBox: React.FC<TimerBoxProps> = ({ onTimerEnd }) => {
//   const [timeLeft, setTimeLeft] = useState<number>(120);
//   const SOCKET_SERVER_URL =
//     process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "http://localhost:5000";

//   useEffect(() => {
//     const socket: Socket = io(SOCKET_SERVER_URL);

//     // Listen for timer updates from the server
//     socket.on("timer", (data: TimerData) => {
//       setTimeLeft(data.timeLeft);
//       if (data.timeLeft === 0 && onTimerEnd) {
//         onTimerEnd();
//       }
//     });

//     // Cleanup on unmount
//     return () => {
//       socket.disconnect();
//     };
//   }, [SOCKET_SERVER_URL, onTimerEnd]);

//   return (
//     <div className="timer-container mt-5 ml-8">
//       <div className="timer-box">{timeLeft}</div>
//       <style jsx>{`
//         .timer-container {
//           display: flex;
//           justify-content: center;
//           align-items: center;
//         }

//         .timer-box {
//           font-size: 3rem;
//           font-weight: bold;
//           background: linear-gradient(
//             90deg,
//             rgba(255, 87, 34, 1) 0%,
//             rgba(255, 193, 7, 1) 100%
//           );
//           padding: 20px;
//           width: 120px;
//           height: 120px;
//           border-radius: 50%;
//           box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
//           display: flex;
//           justify-content: center;
//           align-items: center;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default TimerBox;
