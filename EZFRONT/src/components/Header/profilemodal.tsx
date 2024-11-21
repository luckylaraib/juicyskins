// ProfileModal.tsx

"use client";
import { useUserContext } from "@/context/UserContext";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query"; // Import useQuery

type ProfileModalProps = {
  open: boolean;
  onClose: () => void;
};

type RecentWinning = {
  winner: string;
  amount: string;
  chance: string;
  gamemode: string;
};

type Stats = {
  deposited: number;
  totalWon: number;
  profit: number;
  recentWinnings: RecentWinning[];
};

export default function ProfileModal({ open, onClose }: ProfileModalProps) {
  const { username, avatar } = useUserContext(); // Ensure you have the token
  const SOCKET_SERVER_URL =
    process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "http://localhost:5000";

  // Fetch function for React Query
  const fetchProfileStats = async (): Promise<Stats> => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("jwtToken") : null;

    if (!token) {
      throw new Error("User not authenticated");
    }

    const response = await axios.get(`${SOCKET_SERVER_URL}/jackpotSystem/statistics`, {
      headers: {
        Authorization: `Bearer ${token}`, // Send the JWT token
      },
    });

    // Ensure recentWinnings is always an array
    const data = {
      ...response.data,
      recentWinnings: Array.isArray(response.data.recentWinnings)
        ? response.data.recentWinnings
        : [],
    };

    return data;
  };

  // Use React Query's useQuery hook
  const {
    data: stats,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["profileStats"],
    queryFn: fetchProfileStats,
    enabled: open, // Fetch only when modal is open
  });

  // Refetch data when modal is opened
  React.useEffect(() => {
    if (open) {
      refetch();
    }
  }, [open, refetch]);

  const handleBoxClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="p-4 w-11/12 sm:w-full mx-auto"
    >
      <Box
        sx={{
          position: "absolute" as "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          maxWidth: 700,
          height: "auto",
          maxHeight: "90vh",
          bgcolor: "#2C2C2E",
          boxShadow: 24,
          borderRadius: 8,
        }}
        onClick={handleBoxClick}
        className="relative"
      >
        <div className="w-full">
          {/* Header Section */}
          <div
            className="w-full flex flex-col gap-y-4 justify-center items-center p-4"
            style={{
              backgroundImage:
                'url("https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/252490/ss_271feae67943bdc141c1249aba116349397e9ba9.1920x1080.jpg?t=1727957298")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundColor: "#8E7BF6",
            }}
          >
            <img
              src={avatar}
              className="rounded-full w-24 h-24 border-4 border-white p-1 object-cover"
              alt="User Avatar"
            />
            <span className="text-2xl uppercase text-white font-bold">
              {username}
            </span>
          </div>

          {/* Statistics Section */}
          <div className="p-6 bg-gray-800 rounded-b-lg">
            {isLoading ? (
              <div className="text-center text-white">Loading statistics...</div>
            ) : isError ? (
              <div className="text-center text-red-500">
                {error instanceof Error
                  ? error.message
                  : "An error occurred while fetching statistics."}
              </div>
            ) : stats ? (
              <div className="flex flex-col md:flex-row justify-around gap-6">
                <div className="flex flex-col items-center ">
                  <div className="text-yellow-500 font-semibold text-xl transition-transform duration-300 ease-out transform hover:-translate-y-1 hover:scale-110 cursor-pointer">
                    ${stats.deposited.toFixed(2)}
                  </div>
                  <h4 className="text-md text-white">Deposited</h4>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-green-500 font-semibold text-xl transition-transform duration-300 ease-out transform hover:-translate-y-1 hover:scale-110 cursor-pointer">
                    ${stats.totalWon.toFixed(2)}
                  </div>
                  <h4 className="text-md text-white">Total Won</h4>
                </div>
                <div className="flex flex-col items-center">
                  <div
                    className={`${
                      stats.profit >= 0 ? "text-green-500" : "text-red-500"
                    } font-semibold text-xl transition-transform duration-300 ease-out transform hover:-translate-y-1 hover:scale-110 cursor-pointer`}
                  >
                    ${stats.profit.toFixed(2)}
                  </div>
                  <h4 className="text-md text-white">Profit</h4>
                </div>
              </div>
            ) : null}
          </div>

          {/* Recent Winnings Table */}
          <div className="w-full p-6 overflow-x-auto">
            <table className="min-w-full bg-gray-700 rounded-lg">
              <thead>
                <tr className="w-full bg-gray-900 text-white">
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                    Winner
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                    Chance
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                    Gamemode
                  </th>
                </tr>
              </thead>
              <tbody className="text-white">
                {stats && stats.recentWinnings.length > 0 ? (
                  stats.recentWinnings.map((winning, index) => (
                    <tr
                      key={index}
                      className={`${
                        winning.winner !== "N/A" ? "bg-green-700" : "bg-red-700"
                      } hover:bg-gray-600 transition-colors`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        {winning.winner !== "N/A" ? winning.winner : "Not a Winner"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {winning.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {winning.chance}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {winning.gamemode}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-4 text-center text-gray-300"
                    >
                      No recent winnings to display.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Close Button */}
        <div
          className="absolute top-0 right-0 p-4 cursor-pointer ease-out hover:scale-125 transition-transform duration-300"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={25}
            height={25}
            viewBox="0 0 50 50"
            fill="red"
            className="hover:fill-red-950"
          >
            <path d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z" />
          </svg>
        </div>
      </Box>
    </Modal>
  );
}





// "use client";
// import { useUserContext } from "@/context/UserContext";
// import Box from "@mui/material/Box";
// import Modal from "@mui/material/Modal";
// import React, { useEffect, useState } from "react";
// import axios from "axios"; // For API requests

// const style = {
//   position: "absolute" as "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: "100%",
//   maxWidth: 700, // Increased maxWidth for better table display
//   height: "auto",
//   maxHeight: "90vh",
//   // overflowY: "auto",
//   bgcolor: "#2C2C2E",
//   boxShadow: 24,
//   borderRadius: 8, // Increased border radius for a smoother look
// };

// type ProfileModalProps = {
//   open: boolean;
//   onClose: () => void;
// };

// type RecentWinning = {
//   winner: string;
//   amount: string;
//   chance: string;
//   gamemode: string;
// };

// type Stats = {
//   deposited: number;
//   totalWon: number;
//   profit: number;
//   recentWinnings: RecentWinning[];
// };

// export default function ProfileModal({
//   open,
//   onClose,
// }: ProfileModalProps) {
//   const { username, avatar } = useUserContext(); // Ensure you have the token
//   const [stats, setStats] = useState<Stats | null>(null);
//   const token =
//     typeof window !== "undefined" ? localStorage.getItem("jwtToken") : null;
//   const SOCKET_SERVER_URL =
//     process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "http://localhost:5000";

//   const fetchProfileStats = async () => {
//     try {
//       const response = await axios.get(
//         `${SOCKET_SERVER_URL}/jackpotSystem/statistics`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`, // Send the JWT token
//           },
//         }
//       );

//       // Ensure recentWinnings is always an array
//       const data = {
//         ...response.data,
//         recentWinnings: Array.isArray(response.data.recentWinnings)
//           ? response.data.recentWinnings
//           : [],
//       };

//       setStats(data);
//     } catch (error) {
//       console.error("Error fetching profile stats:", error);
//       // Optionally handle error (e.g., show a message to the user)
//     }
//   };

//   useEffect(() => {
//     if (open) {
//       fetchProfileStats();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [open]);

//   const handleBoxClick = (event: React.MouseEvent<HTMLDivElement>) => {
//     event.stopPropagation();
//   };

//   return (
//     <Modal
//       open={open}
//       onClose={onClose}
//       aria-labelledby="modal-modal-title"
//       aria-describedby="modal-modal-description"
//       className="p-4 w-11/12 sm:w-full mx-auto"
//     >
//       <Box sx={style} onClick={handleBoxClick} className="relative">
//         <div className="w-full">
//           {/* Header Section */}
//           <div
//             className="w-full flex flex-col gap-y-4 justify-center items-center p-4 "
//             style={{
//               backgroundImage:
//                 'url("https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/252490/ss_271feae67943bdc141c1249aba116349397e9ba9.1920x1080.jpg?t=1727957298")',
//               backgroundSize: "cover",
//               backgroundPosition: "center",
//               backgroundColor: "#8E7BF6",
//             }}
//           >
//             <img
//               src={avatar}
//               className="rounded-full w-24 h-24 border-4 border-white p-1 object-cover"
//               alt="User Avatar"
//             />
//             <span className="text-2xl uppercase text-white font-bold">
//               {username}
//             </span>
//           </div>

//           {/* Statistics Section */}
//           <div className="p-6 bg-gray-800 rounded-b-lg">
//             {stats ? (
//               <div className="flex flex-col md:flex-row justify-around gap-6">
//                 <div className="flex flex-col items-center ">
//                   <div className="text-yellow-500 font-semibold text-xl transition-transform duration-300 ease-out transform hover:-translate-y-1 hover:scale-110 cursor-pointer">
//                     ${stats.deposited.toFixed(2)}
//                   </div>
//                   <h4 className="text-md text-white">Deposited</h4>
//                 </div>
//                 <div className="flex flex-col items-center">
//                   <div className="text-green-500 font-semibold text-xl transition-transform duration-300 ease-out transform hover:-translate-y-1 hover:scale-110 cursor-pointer">
//                     ${stats.totalWon.toFixed(2)}
//                   </div>
//                   <h4 className="text-md text-white">Total Won</h4>
//                 </div>
//                 <div className="flex flex-col items-center">
//                   <div
//                     className={`${
//                       stats.profit >= 0
//                         ? "text-green-500"
//                         : "text-red-500"
//                     } font-semibold text-xl transition-transform duration-300 ease-out transform hover:-translate-y-1 hover:scale-110 cursor-pointer`}
//                   >
//                     ${stats.profit.toFixed(2)}
//                   </div>
//                   <h4 className="text-md text-white">Profit</h4>
//                 </div>
//               </div>
//             ) : (
//               <div className="text-center text-white">Loading statistics...</div>
//             )}
//           </div>

//           {/* Recent Winnings Table */}
//           <div className="w-full p-6 overflow-x-auto">
//             <table className="min-w-full bg-gray-700 rounded-lg">
//               <thead>
//                 <tr className="w-full bg-gray-900 text-white">
//                   <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
//                     Winner
//                   </th>
//                   <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
//                     Amount
//                   </th>
//                   <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
//                     Chance
//                   </th>
//                   <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
//                     Gamemode
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="text-white">
//                 {stats && stats.recentWinnings.length > 0 ? (
//                   stats.recentWinnings.map((winning, index) => (
//                     <tr
//                       key={index}
//                       className={`${
//                         winning.winner !== "N/A"
//                           ? "bg-green-700"
//                           : "bg-red-700"
//                       } hover:bg-gray-600 transition-colors`}
//                     >
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         {winning.winner !== "N/A"
//                           ? winning.winner
//                           : "Not a Winner"}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         {winning.amount}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         {winning.chance}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         {winning.gamemode}
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan={4}
//                       className="px-6 py-4 text-center text-gray-300"
//                     >
//                       No recent winnings to display.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Close Button */}
//         <div
//           className="absolute top-0 right-0 p-4 cursor-pointer ease-out hover:scale-125 transition-transform duration-300"
//           onClick={onClose}
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width={25}
//             height={25}
//             viewBox="0 0 50 50"
//             fill="red"
//             className="hover:fill-red-950"
//           >
//             <path d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z" />
//           </svg>
//         </div>
//       </Box>
//     </Modal>
//   );
// }
