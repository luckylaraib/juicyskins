// types/jackpot.ts

export interface Avatar {
  small: string;
  medium?: string;
  large?: string;
}

export interface User {
  avatar: Avatar;
  _id: string;
  steamId: string;
  username: string;
}

export interface Item {
  _id: string;
  name: string;
  iconUrl: string;
  price: string; // e.g., "0.1 USD"
}

export interface ParticipantData {
  user: User;
  items: Item[];
  color: string;
  _id: string;
}

export interface Winner {
  avatar: Avatar;
  _id: string;
  username: string;
}

export interface Jackpot {
  _id: string;
  participants: ParticipantData[];
  totalValue: number;
  commissionPercentage: number;
  status: string;
  countdown: number;
  createdAt: string; // ISO date string
  __v: number;
  winner: Winner;
}
