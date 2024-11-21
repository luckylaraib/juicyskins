// components/ParticipantCard.tsx

import React, { useState } from "react";
import Image from "next/image";
import Modal from "./ModalInventory";
import ItemBadge from "./jacpotStatusapifetch/itembadge";

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
  username: string;
  items: Item[];
  totalValue: number;
  skinCount: number;
  img: string;
  color: string;
}

interface ParticipantCardProps {
  participant: Participant;
}

const ParticipantCard: React.FC<ParticipantCardProps> = ({ participant }) => {
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
        className="w-full max-w-sm bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300"
        style={{ border: `2px solid ${participant.color}` }} // Added border color
      >
        <div className="flex items-center p-4">
          <Image
            width={60}
            height={60}
            className="rounded-full border-2 border-gray-600"
            src={participant.img}
            alt={participant.username}
          />
          <div className="ml-4">
            <h3 className="text-xl font-semibold text-white">
              {participant.username}
            </h3>
            <p className="text-sm text-gray-300">
              {participant.skinCount}{" "}
              {participant.skinCount === 1 ? "Skin" : "Skins"} | $
              {participant.totalValue.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-gray-600" />

        {/* Invested Skins */}
        <div className="p-4">
          <p className="text-sm font-medium text-yellow-400 mb-2">
            Invested Skins:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {participant.items.slice(0, 4).map((item) => (
              <ItemBadge key={item.assetId} item={item} />
            ))}
            {participant.items.length > 4 && (
              <div
                className="flex items-center justify-center col-span-2 p-2 bg-gray-600 rounded-md cursor-pointer hover:bg-gray-500 transition-colors duration-200"
                onClick={handleShowAll}
                title="View all skins"
              >
                <span className="text-xs text-gray-300">
                  +{participant.items.length - 4} more
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Modal to show all skins */}
      </div>
      <Modal
        isOpen={showAll}
        onClose={handleClose}
        title={`${participant.username}'s Skins`}
      >
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 overflow-y-auto max-h-96">
          {participant.items.map((item) => (
            <ItemBadge key={item.assetId} item={item} />
          ))}
        </div>
      </Modal>
    </>
  );
};

export default ParticipantCard;
