// TradeURLModalComponent.tsx
import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import axios from "axios";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "#3D3A40",
  boxShadow: 24,
  borderRadius: 4,
  textAlign: "center",
  paddingTop: "50px",
};

interface TradeURLModalComponentProps {
  open: boolean;
  onClose: (event: React.MouseEvent) => void;
}

export default function TradeURLModalComponent({
  open,
  onClose,
}: TradeURLModalComponentProps) {
  const [tradeURL, setTradeURL] = React.useState("");
  const SOCKET_SERVER_URL =
  process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "http://localhost:5000";

  const handleModalContentClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTradeURL(event.target.value);
  };

  const handleSave = async (event: React.MouseEvent) => {
    event.stopPropagation();
    // Replace 'your-api-endpoint' with your actual API endpoint
    const token =localStorage.getItem('jwtToken')
    const apiEndpoint = `${SOCKET_SERVER_URL}/jackpotSystem/save-trade-url`;
    console.log(tradeURL);
    
    try {
        const response = await axios.post(
            apiEndpoint,
            {
              tradeUrl: tradeURL
            },
            {
              headers: {
                Authorization: `Bearer ${token}`, // Use the retrieved token here
              }
            }
          );

      if (response.data.success) {
        // Handle successful response
        console.log('Trade URL saved successfully.');
        // Optionally, close the modal
        onClose(event);
      }
    } catch (error: any) {
      console.error(
        "Jackpot Deposit Error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
    >
      <Box
        sx={{
          ...style,
          height: 250,
          width: 300,
          borderRadius: 0,
          textAlign: "center",
          paddingTop: "50px",
        }}
        onClick={handleModalContentClick}
      >
        <h2
          id="parent-modal-title"
          className="text-4xl font-bold text-center capitalize mb-4 text-white"
        >
          Trade URL
        </h2>
        <a
          href="https://steamcommunity.com/my/tradeoffers/privacy#trade_offer_access_url"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white"
        >
          Your Trade URL <span className="text-blue-500">here!</span>
        </a>
        <div className="flex gap-x-0 mt-1 p-5">
          <input
            type="text"
            value={tradeURL}
            onChange={handleInputChange}
            className="border-r-0 rounded-r-none w-full p-2 bg-slate-100 rounded-lg border border-gray-700 font-normal focus:outline-none"
            placeholder="Enter Your Trade URL Here"
          />
          <button
            onClick={handleSave}
            className="rounded-l-none px-2 rounded-lg bg-blue-500 hover:bg-blue-700 transition text-sm text-white font-medium"
          >
            Save
          </button>
        </div>
        <div
          className="absolute top-0 right-0 p-4 cursor-pointer ease-out hover:scale-y-150 duration-300"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={20}
            height={20}
            viewBox="0 0 50 50"
            fill="white"
            className="hover:fill-red-700"
          >
            <path d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z" />
          </svg>
        </div>
      </Box>
    </Modal>
  );
}
