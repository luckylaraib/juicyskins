// utils/mapParticipants.ts

import { ParticipantData, Item } from "@/types/types";
import { extractPrice } from "@/utils/enums/extractPrice";

export interface Participant {
  id: string;
  username: string;
  items: Item[];
  totalValue: number;
  skinCount: number;
  img: string;
  color: string;
}

export const mapParticipants = (participantsData: ParticipantData[]): Participant[] => {
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
