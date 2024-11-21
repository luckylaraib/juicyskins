// src/context/UserContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of your context
interface UserContextType {
  username: string;
  setUsername: (name: string) => void;
  avatar: string;
  setAvatar: (avatar: string) => void;
  steamID64: string;
  setSteamId64: (name: string) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (name: boolean) => void;
}

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create a provider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [username, setUsername] = useState<string>('');
  const [avatar, setAvatar] = useState<string>('');
  const [steamID64, setSteamId64] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  return (
    <UserContext.Provider value={{ username, setUsername, avatar, setAvatar, steamID64, setSteamId64, isLoggedIn, setIsLoggedIn }}>
      {children}
    </UserContext.Provider>
  );
};

// Create a custom hook for easier access to the context
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};



// // src/context/UserContext.tsx
// import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { io, Socket } from 'socket.io-client';

// // Define the shape of your user context
// interface UserContextType {
//   username: string;
//   setUsername: (name: string) => void;
//   avatar: string;
//   setAvatar: (avatar: string) => void;
//   steamID64: string;
//   setSteamId64: (id: string) => void;
//   isLoggedIn: boolean;
//   setIsLoggedIn: (status: boolean) => void;

//   // Game state properties
//   gameState: GameState;
// }

// // Define the shape of the game state
// interface GameState {
//   status: 'waiting' | 'in_progress' | 'spinning' | 'cooldown';
//   spinStartTime: number | null;
//   spinDuration: number;
//   nextRoundStartTime: number | null;
//   winner: any;
// }

// // Create the context
// const UserContext = createContext<UserContextType | undefined>(undefined);

// // Create a provider component
// export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   // User-related state
//   const [username, setUsername] = useState<string>('');
//   const [avatar, setAvatar] = useState<string>('');
//   const [steamID64, setSteamId64] = useState<string>('');
//   const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

//   // Game state
//   const [gameState, setGameState] = useState<GameState>({
//     status: 'waiting',
//     spinStartTime: null,
//     spinDuration: 5000,
//     nextRoundStartTime: null,
//     winner: null,
//   });

//   // Socket connection
//   const SOCKET_SERVER_URL =
//     process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || 'http://localhost:5000';

//   useEffect(() => {
//     const socket: Socket = io(SOCKET_SERVER_URL);

//     // Listen for game state updates
//     socket.on('gameStateUpdate', (data: GameState) => {
//       setGameState(data);
//     });

//     // Listen for timer updates
//     socket.on('timer', (data: { timeLeft: number }) => {
//       // You can update the game state with the time left if needed
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, [SOCKET_SERVER_URL]);

//   return (
//     <UserContext.Provider
//       value={{
//         username,
//         setUsername,
//         avatar,
//         setAvatar,
//         steamID64,
//         setSteamId64,
//         isLoggedIn,
//         setIsLoggedIn,
//         gameState, // Provide the game state to the context
//       }}
//     >
//       {children}
//     </UserContext.Provider>
//   );
// };

// // Create a custom hook for easier access to the context
// export const useUserContext = () => {
//   const context = useContext(UserContext);
//   if (context === undefined) {
//     throw new Error('useUserContext must be used within a UserProvider');
//   }
//   return context;
// };
