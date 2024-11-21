// File: @/components/InventoryModal.tsx

"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import InventoryPage from "@/pages/inventory";
import axios from "axios";
import TradeURLModalComponent from "./tradeUrlModal";
import { useUserContext } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

// Styled component for the main modal
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#3D3A40",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

// Styled component for the informational modal when deposit is disabled
const InfoModalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "#3D3A40",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
  color: "#fff",
  textAlign: "center" as "center",
};

interface InventoryItem {
  iconUrl: string;
  name: string;
  price: string;
  owner: string;
  _id: string;
}

export default function InventoryModal() {
  const [open, setOpen] = useState(false);
  const [tradeModalOpen, setTradeModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<InventoryItem[]>([]);
  const [isDepositSuccessful, setIsDepositSuccessful] = useState<boolean>(false); // Track deposit success
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [tradeOfferUrl, setTradeOfferUrl] = useState<string | null>(null);
  const [tradeUrlModalOpen, setTradeUrlModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>(""); // Search query state
  const { username } = useUserContext();

  const SOCKET_SERVER_URL =
    process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "http://localhost:5000";

  // New states for next round countdown
  const [nextRoundCountdown, setNextRoundCountdown] = useState<number | null>(null);
  const [remainingTimeModalOpen, setRemainingTimeModalOpen] = useState<boolean>(false);

  // Socket instance
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Initialize Socket.IO connection if not already connected
    if (!socket) {
      const newSocket = io(SOCKET_SERVER_URL);

      // Listen for 'nextRoundTimer' event to update the countdown
      newSocket.on("nextRoundTimer", (data: { timeLeft: number }) => {
        setNextRoundCountdown(data.timeLeft);
      });

      // Optionally, listen for 'newRoundStarted' event to reset countdown
      newSocket.on("newRoundStarted", () => {
        setNextRoundCountdown(null);
      });

      setSocket(newSocket);
    }

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket, SOCKET_SERVER_URL]);

  const handleOpen = (event: React.MouseEvent) => {
    event.stopPropagation();
    // If there's an active countdown, open the remaining time modal instead of the deposit modal
    if (nextRoundCountdown && nextRoundCountdown > 0) {
      setRemainingTimeModalOpen(true);
    } else {
      setOpen(true);
    }
  };

  const handleClose = (event: React.MouseEvent) => {
    event.stopPropagation();
    setTotalPrice(0);
    setSelectedItems([]);  // Clear selected items when modal is closed
    setOpen(false);  // Close the modal
  };

  const handleOpens = () => {
    if (!isDepositSuccessful) {
      setSelectedItems([]); // Reset selected items only if deposit was not successful
    }
    setIsDepositSuccessful(false);  // Reset deposit flag when modal is opened
    setOpen(true); // Open the modal
  };

  const handleModalContentClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const handleItemSelection = (item: InventoryItem[]) => {
    setSelectedItems(item); // Update selected items
  };

  const handlePrice = (totalPrice: number) => {
    setTotalPrice(totalPrice);
  };

  const handleJackpotDeposit = async () => {
    try {
      const transformedItems = selectedItems.map((item) => item._id);
      const userId = selectedItems[0].owner;
      const token = localStorage.getItem("jwtToken");
      const response = await axios.post(
        `${SOCKET_SERVER_URL}/jackpotSystem/join`,
        {
          itemIds: transformedItems,
          userId: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Use the retrieved token here
          },
        }
      );

      if (response.data.tradeOfferUrl) {
        setTradeOfferUrl(response.data.tradeOfferUrl);
        setTradeModalOpen(true);
        setSelectedItems([]);
        setTotalPrice(0);
      } else if (response.data.tradeUrl === false) {
        setTradeUrlModalOpen(true);
      }
      setOpen(false);
    } catch (error: any) {
      console.error(
        "Jackpot Deposit Error:",
        error.response ? error.response.data : error.message
      );
    }
  };



  // const handleJackpotDeposit = async () => {
  //   try {
  //     const transformedItems = selectedItems.map((item) => item._id);
  //     const userId = selectedItems[0].owner;
  //     const token = localStorage.getItem("jwtToken");

  //     const response = await axios.post(
  //       `${SOCKET_SERVER_URL}/jackpotSystem/join`,
  //       {
  //         itemIds: transformedItems,
  //         userId: userId,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     // After successful deposit, reset selected items and update deposit flag
  //     setSelectedItems([]);
  //     setTotalPrice(0);
  //     setIsDepositSuccessful(true);  // Mark deposit as successful

  //   } catch (error) {
  //     console.error('Error during jackpot deposit:', error);
  //     // Handle error if needed
  //   }
  // };

  const handleTradeModalClose = () => {
    setTradeModalOpen(false);
    setTradeOfferUrl(null);
  };

  const handleTradeUrlModalClose = (event: React.MouseEvent) => {
    event.stopPropagation();
    setTradeUrlModalOpen(false);
  };

  // Handler for closing the remaining time modal
  const handleRemainingTimeModalClose = () => {
    setRemainingTimeModalOpen(false);
  };

  return (
    <div>
      <Button onClick={handleOpen} disabled={false}>
        <div className="depositbutton h-11 w-32 flex items-center justify-center bg-[#004526] text-white hover:bg-green-900 capitalize font-medium text-base">
          Deposit
        </div>
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
        sx={{
          display: "flex", // Use flexbox
          justifyContent: "center", // Center horizontally
          alignItems: "center", // Center vertically
          height: "100vh", // Full viewport height for vertical centering
        }}
      >
        <Box
          sx={{
            // Default styles
            height: "100%",
            width: "100%",
            bgcolor: "#3D3A40",
            padding: "8px",

            // Mobile
            "@media (max-width: 600px)": {
              height: "80%",
              width: "90%",
            },
            // Tablet
            "@media (min-width: 601px) and (max-width: 960px)": {
              height: "70%",
              width: "85%",
            },
            // Laptop
            "@media (min-width: 961px) and (max-width: 1280px)": {
              height: "75%",
              width: "95%",
            },
            // Larger Screens
            "@media (min-width: 1281px)": {
              height: "85%",
              width: "60%",
            },
          }}
        >
          <div className="flex">
            <div className="h-10 rounded-t-md justify-center text-white font-light">
              Deposited Items ~
            </div>
            <div className="h-10 rounded-t-md justify-center text-green-600 ml-1">
              {selectedItems.length}/20
            </div>

          </div>
          <div className="h-full w-full flex mx-auto">
            <div className="w-full items-center gap-x-5">
              <div className="col-span-3 h-[500px] md:h-[470px] lg:h-[85%] border border-[#2C2C2E] rounded-md bg-[#16161d]">
                <div className="h-10 bg-[#2C2C2E] text-white rounded-t-md text-center flex justify-center items-center">
                  {username} Inventory
                </div>
                <InventoryPage
                  onSelectItem={handleItemSelection}
                  onTotalPrice={handlePrice}
                  searchQuery={searchQuery}
                />
              </div>

              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mt-3">
                <div className="flex items-center gap-x-3 py-2 w-full lg:w-2/5">
                  <div className="relative w-full">
                    <input
                      type="search"
                      className="w-full p-2 pl-10 text-white placeholder-gray-400 focus:outline-none transition duration-300 ease-in-out border border-transparent border-gray-500 bg-[#2C2C2E] rounded-sm"
                      placeholder="Search Inventory"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 4a6 6 0 100 12 6 6 0 000-12zm4 4h6m-6 0l-1-1m1 1l1 1"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 w-full lg:w-1/2 px-2">
                  <button
                    className={`cursor-pointer w-full lg:w-1/4 px-2 h-10 bg-green-700 text-white text-lg hover:bg-green-900 transition duration-200 transform hover:scale-105 flex justify-center items-center gap-x-2 ${selectedItems.length === 0
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                      }`}
                    onClick={handleJackpotDeposit}
                    disabled={
                      selectedItems.length === 0 ||
                      (nextRoundCountdown !== null && nextRoundCountdown > 0)
                    }
                  >
                    Deposit ${totalPrice.toFixed(2)}
                    <span className="text-xs block md:hidden">
                      Click Here To Submit
                    </span>
                  </button>
                  <button
                    className="cursor-pointer w-1/3 h-10 bg-[#2C2C2E] text-white text-lg hover:bg-[#2C2C2E] transition duration-200 transform hover:scale-105 flex justify-center items-center"
                    onClick={handleClose}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Box>
      </Modal>

      {/* Remaining Time Informational Modal */}
      <Modal
        open={remainingTimeModalOpen}
        onClose={handleRemainingTimeModalClose}
        aria-labelledby="remaining-time-modal-title"
        aria-describedby="remaining-time-modal-description"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Box sx={InfoModalStyle}>
          <Typography
            id="remaining-time-modal-title"
            variant="h6"
            component="h2"
            gutterBottom
          >
            Deposit Disabled
          </Typography>
          <Typography
            id="remaining-time-modal-description"
            sx={{ mb: 2 }}
          >
            You can deposit items when the next jackpot round starts.
          </Typography>
          {nextRoundCountdown !== null && nextRoundCountdown > 0 && (
            <Typography variant="body1" sx={{ mb: 2 }}>
              Remaining Time: {nextRoundCountdown} second
              {nextRoundCountdown !== 1 ? "s" : ""}
            </Typography>
          )}
          <Button variant="contained" onClick={handleRemainingTimeModalClose}>
            Close
          </Button>
        </Box>
      </Modal>

      {/* Trade Offer Modal */}
      <Modal
        open={tradeModalOpen}
        onClose={handleTradeModalClose}
        aria-labelledby="trade-modal-title"
        aria-describedby="trade-modal-description"
        closeAfterTransition
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 400 },
            bgcolor: "#1e1e1e",
            borderRadius: "12px",
            boxShadow: 24,
            p: 4,
            color: "#fff",
            textAlign: "center",
            outline: "none",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography id="trade-modal-title" variant="h5" component="h2">
              <SwapHorizIcon sx={{ verticalAlign: "middle", mr: 1 }} /> Steam Trade Offer
            </Typography>
            <IconButton onClick={handleTradeModalClose} sx={{ color: "#fff" }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Description */}
          <Typography
            id="trade-modal-description"
            sx={{ mb: 4 }}
          >
            Click the button below to navigate to your Steam Trade Offer and complete the transaction.
          </Typography>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {tradeOfferUrl && (
              <Button
                variant="contained"
                href={tradeOfferUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Navigate to Steam Trade Offer"
                sx={{
                  bgcolor: "#4fc3f7", // Custom background color
                  "&:hover": {
                    bgcolor: "#29b6f6", // Darker shade on hover
                  },
                  textTransform: "none", // Preserve original text casing
                  fontSize: "16px",
                  fontWeight: 600, // Optional: Make the text bold for better visibility
                  padding: "10px 20px", // Optional: Adjust padding for better click area
                }}
              >
                Go to Trade Offer
              </Button>
            )}
            {/* Optional: Render Cancel button even if tradeOfferUrl is null */}
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleTradeModalClose}
              sx={{
                borderColor: "#f44336",
                color: "#f44336",
                "&:hover": {
                  borderColor: "#d32f2f",
                  backgroundColor: "rgba(244, 67, 54, 0.1)",
                },
                textTransform: "none",
                fontSize: "16px",
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Trade URL Modal */}
      <TradeURLModalComponent
        open={tradeUrlModalOpen}
        onClose={handleTradeUrlModalClose}
      />
    </div>
  );
}