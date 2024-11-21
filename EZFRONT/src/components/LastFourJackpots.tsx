// components/LastFourJackpots.tsx

"use client";

import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { mapParticipants, Participant } from "@/utils/enums/mapParticipants";
import { Jackpot } from "@/types/types";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import SlotMachine from "./SlotMachine";
import { Socket, io } from "socket.io-client";
// Tooltip Component using Framer Motion
const Tooltip: React.FC<{ content: React.ReactNode; children: React.ReactNode }> = ({
  content,
  children,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm rounded-md px-2 py-1 z-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SOCKET_SERVER_URL =
  process.env.NEXT_PUBLIC_SOCKET_SERVER_URL ||
  "http://localhost:5000";

// Fetch function for the last four jackpots
const fetchLastFourJackpots = async (): Promise<Jackpot[]> => {
  const response = await axios.get(`${SOCKET_SERVER_URL}/jackpotSystem/last-four-jackpots`);
  return response.data;
};

const LastFourJackpots: React.FC = () => {
  const LastJackPot = [
    ['L', 'A', 'C', 'K', 'P', 'O', 'T'],
    ['A', 'A', 'C', 'K', 'P', 'O', 'T'],
    ['S', 'A', 'C', 'K', 'P', 'O', 'T'],
    ['T', 'A', 'C', 'K', 'P', 'O', 'T'],
    ['.', 'A', 'C', 'K', 'P', 'O', 'T'],
    ['J', 'A', 'C', 'K', 'P', 'O', 'T'],
    ['A', 'C', 'K', 'P', 'P', 'O', 'T'],
    ['C', 'K', 'P', 'O', 'P', 'O', 'T'],
    ['K', 'P', 'O', 'T', 'P', 'O', 'T'],
    ['P', 'O', 'T', 'J', 'A', 'C', 'K'],
    ['O', 'T', 'J', 'A', 'C', 'K', 'P'],
    ['T', 'J', 'A', 'C', 'K', 'P', 'O'],
    ['S', 'A', 'C', 'K', 'P', 'O', 'T'],
  ];
  const { data, isLoading, isError, error, refetch } = useQuery<Jackpot[], AxiosError>({
    queryKey: ["lastFourJackpots"],
    queryFn: fetchLastFourJackpots,
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Handle Socket.IO for real-time updates
  useEffect(() => {
    const socket: Socket = io(SOCKET_SERVER_URL);
    // const socket = require("socket.io-client").io(SOCKET_SERVER_URL);

    // Listen for a custom event, e.g., 'newJackpot'
    socket.on("newJackpot", (data : any) => {
      console.log("hellow",data);
      
      if (data.msg === "success") {
        refetch();
      }
    });

    // Cleanup the socket connection when the component is unmounted
    return () => {
      socket.disconnect();
    };
  }, [refetch]);

  // Tooltip content for extra participants
  const renderExtraParticipantsTooltip = (extraParticipants: Participant[]) => (
    <div className="flex flex-col">
      {extraParticipants.map((participant) => (
        <div key={participant.id} className="flex items-center space-x-2 mb-2">
          <Image
            src={participant.img}
            alt={participant.username}
            width={30}
            height={30}
            className="rounded-full border-2"
            style={{ borderColor: participant.color }}
          />
          <span className="text-white text-sm">{participant.username}</span>
        </div>
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <div className="w-full py-10 flex items-center justify-center bg-transparent">
        <div className="text-white text-lg">Loading Last Four Jackpots...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full py-10 flex items-center justify-center bg-transparent">
        <div className="text-red-500 text-lg">
          Error: {error?.message || "Failed to load last four jackpots."}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full py-10 flex items-center justify-center bg-transparent">
        <div className="text-white text-lg">No jackpots available.</div>
      </div>
    );
  }

  return (
    <div className="w-full py-8 bg-transparent">
      <div className="py-4">
        <SlotMachine reels={LastJackPot} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-2 md:px-6">
        <AnimatePresence>
          {data.map((jackpot) => {
            const participants: Participant[] = mapParticipants(jackpot.participants);
            const totalValue = jackpot.totalValue;
            const createdAt = new Date(jackpot.createdAt).toLocaleString();
            const winner = jackpot.winner;

            // Handle participant overflow
            const maxVisibleParticipants = 3;
            const visibleParticipants = participants.slice(0, maxVisibleParticipants);
            const extraParticipants = participants.length - maxVisibleParticipants;

            return (
              <motion.div
                key={jackpot._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-[#3A3A3C] p-6 rounded shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between"
              >
                {/* Jackpot Header */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-white text-xl font-bold">
                      Round: {jackpot._id.slice(-6).toUpperCase()}
                    </h3>
                    <p className="text-gray-400 text-sm">Date: {createdAt}</p>
                  </div>
                  <div className="text-[#EEC475] font-semibold text-lg">
                    Total: ${totalValue.toFixed(2)}
                  </div>
                </div>

                {/* Participants List */}
                <div className="flex flex-col gap-3 mb-4">
                  {visibleParticipants.map((participant) => (
                    <div key={participant.id} className="flex items-center space-x-3">
                      <div className="relative">
                        <Image
                          src={participant.img}
                          alt={participant.username}
                          width={50}
                          height={50}
                          className="rounded-full border-2"
                          style={{ borderColor: participant.color }}
                        />
                        {/* Colored Dot */}
                        <span
                          className="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[#2C2C2E]"
                          style={{ backgroundColor: participant.color }}
                        ></span>
                      </div>
                      <div>
                        <p className="text-white text-md font-medium">{participant.username}</p>
                        <p className="text-gray-400 text-sm">
                          Total: ${participant.totalValue.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}

                  {extraParticipants > 0 && (
                    <Tooltip content={renderExtraParticipantsTooltip(participants.slice(maxVisibleParticipants))}>
                      <div className="flex items-center">
                        <span className="text-gray-400 text-sm cursor-pointer">+{extraParticipants} more</span>
                      </div>
                    </Tooltip>
                  )}
                </div>

                {/* Winner and Status */}
                <div className="flex flex-col sm:flex-row justify-between items-center mt-auto">
                  {/* Winner */}
                  <div className="flex items-center space-x-3 mb-4 sm:mb-0">
                    <div className="relative">
                      <Image
                        src={winner.avatar.small}
                        alt={winner.username}
                        width={50}
                        height={50}
                        className="rounded-full border-2 border-[#FFD700]" // Gold border for winner
                      />
                      {/* Winner Badge */}
                      <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        🏆
                      </span>
                    </div>
                    <div>
                      <p className="text-white text-md font-medium">Winner: {winner.username}</p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="text-md">
                    Status:{" "}
                    <span
                      className={`${
                        jackpot.status === "completed"
                          ? "text-green-500"
                          : jackpot.status === "active"
                          ? "text-yellow-500"
                          : "text-red-500"
                      } capitalize font-semibold`}
                    >
                      {jackpot.status}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LastFourJackpots;
