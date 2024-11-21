
"use client";

import React, { useEffect, Suspense } from "react";
import AccountSetting from "@/components/Header/iconsdropdown";
import LogoutIcon from "@mui/icons-material/Logout";
import { useUserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation"; // Keep using next/navigation
import { useSearchParams } from "next/navigation"; // Keep using useSearchParams

const SteamLogin: React.FC = () => {
  const { isLoggedIn, setUsername, setAvatar, setSteamId64, setIsLoggedIn } =
    useUserContext();

  const SOCKET_SERVER_URL =
    process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "http://localhost:5000";
  const router = useRouter();

  // Check if JWT exists in localStorage on page load
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      // If JWT exists, fetch user info to set login state
      fetchUserInfo(token);
    }
  }, []); // Empty dependency array ensures this runs only on initial load

  const exchangeAuthCodeForJWT = async (code: string) => {
    try {
      const response = await fetch(`${SOCKET_SERVER_URL}/auth/exchange`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem("jwtToken", token); // Store JWT in localStorage
        await fetchUserInfo(token); // Fetch user info using the JWT

        // After exchanging the code and fetching user info, remove the 'code' from the URL
        router.replace("/"); // Redirect to base URL without reloading the page
      } else {
        console.log("Failed to exchange auth code for JWT.");
      }
    } catch (error) {
      console.error("Error exchanging auth code for JWT:", error);
    }
  };

  const fetchUserInfo = async (token: string) => {
    try {
      const response = await fetch(`${SOCKET_SERVER_URL}/api/user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Include JWT in header
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUsername(userData.username);
        setAvatar(userData.avatar.large);
        setSteamId64(userData.steamID64);
        setIsLoggedIn(true);
      } else {
        console.log("User is not logged in or error occurred.");
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const handleLogin = () => {
    window.location.href = `${SOCKET_SERVER_URL}/auth/steam`;
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken"); // Remove JWT on logout
    setIsLoggedIn(false);
    setUsername("");
    setAvatar("");
  };

  return (
    <div>
      <Suspense fallback={null}>
        <SearchParamsHandler exchangeAuthCodeForJWT={exchangeAuthCodeForJWT} />
      </Suspense>
      {!isLoggedIn ? (
        <button id="loginButton" onClick={handleLogin}>
          <img
            src="https://community.akamai.steamstatic.com/public/images/signinthroughsteam/sits_01.png"
            alt="steam login"
          />
        </button>
      ) : (
        <div className="flex gap-x-8 items-center">
          <AccountSetting />
          <button id="logoutButton" onClick={handleLogout}>
            <LogoutIcon htmlColor="white" />
          </button>
        </div>
      )}
    </div>
  );
};

export default SteamLogin;

// Separate component that uses useSearchParams
const SearchParamsHandler: React.FC<{
  exchangeAuthCodeForJWT: (code: string) => void;
}> = ({ exchangeAuthCodeForJWT }) => {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams) {
      const authCode = searchParams.get("code");
      if (authCode) {
        exchangeAuthCodeForJWT(authCode);
      }
    }
  }, [searchParams]);

  return null; // This component doesn't render anything
};







// "use client";

// import React, { useEffect } from "react";
// import AccountSetting from "@/components/Header/iconsdropdown";
// import LogoutIcon from "@mui/icons-material/Logout";
// import { useUserContext } from "@/context/UserContext";
// import { useSearchParams, useRouter } from "next/navigation"; // Import useRouter for navigation

// const SteamLogin: React.FC = () => {
//   const { isLoggedIn, setUsername, setAvatar, setSteamId64, setIsLoggedIn } =
//     useUserContext();

//   const SOCKET_SERVER_URL =
//     process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "http://localhost:5000";
//   const searchParams = useSearchParams(); // Get the current search parameters
//   const router = useRouter(); // Get the Next.js router

//   // Check if JWT exists in localStorage on page load
//   useEffect(() => {
//     const token = localStorage.getItem("jwtToken");
//     if (token) {
//       // If JWT exists, fetch user info to set login state
//       fetchUserInfo(token);
//     }
//   }, []); // Empty dependency array ensures this runs only on initial load

//   useEffect(() => {
//     if (searchParams) {
//       // Check if searchParams is not null
//       const authCode = searchParams.get("code"); // Get the 'code' parameter from the URL
//       if (authCode) {
//         exchangeAuthCodeForJWT(authCode);
//       }
//     }
//   }, [searchParams]);

//   const exchangeAuthCodeForJWT = async (code: string) => {
//     try {
//       const response = await fetch(`${SOCKET_SERVER_URL}/auth/exchange`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ code }),
//       });

//       if (response.ok) {
//         const { token } = await response.json();
//         localStorage.setItem("jwtToken", token); // Store JWT in localStorage
//         await fetchUserInfo(token); // Fetch user info using the JWT

//         // After exchanging the code and fetching user info, remove the 'code' from the URL
//         router.replace("/"); // Redirect to base URL without reloading the page
//       } else {
//         console.log("Failed to exchange auth code for JWT.");
//       }
//     } catch (error) {
//       console.error("Error exchanging auth code for JWT:", error);
//     }
//   };

//   const fetchUserInfo = async (token: string) => {
//     try {
//       const response = await fetch(`${SOCKET_SERVER_URL}/api/user`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`, // Include JWT in header
//         },
//       });

//       if (response.ok) {
//         console.log(document.cookie);

//         const userData = await response.json();
//         setUsername(userData.username);
//         setAvatar(userData.avatar.large);
//         setSteamId64(userData.steamID64);
//         setIsLoggedIn(true);
//       } else {
//         console.log("User is not logged in or error occurred.");
//       }
//     } catch (error) {
//       console.error("Error fetching user info:", error);
//     }
//   };

//   const handleLogin = () => {
//     window.location.href = `${SOCKET_SERVER_URL}/auth/steam`;
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("jwtToken"); // Remove JWT on logout
//     setIsLoggedIn(false);
//     setUsername("");
//     setAvatar("");
//   };

//   return (
//     <div>
//       {!isLoggedIn ? (
//         <button id="loginButton" onClick={handleLogin}>
//           <img
//             src="https://community.akamai.steamstatic.com/public/images/signinthroughsteam/sits_01.png"
//             alt="steam login"
//           />
//         </button>
//       ) : (
//         <div className="flex gap-x-8 items-center">
//           <AccountSetting />
//           <button id="logoutButton" onClick={handleLogout}>
//             <LogoutIcon htmlColor="white" />
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SteamLogin;

// "use client";
// import React, { useEffect } from "react";
// import AccountSetting from "@/components/Header/iconsdropdown";
// import LogoutIcon from "@mui/icons-material/Logout";
// import { useUserContext } from '@/context/UserContext';

// const SteamLogin: React.FC = () => {
//   const { isLoggedIn, setUsername, setAvatar, setSteamId64, setIsLoggedIn } = useUserContext();
//   const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "http://localhost:5000";

//   useEffect(() => {
//     const fetchUserInfo = async () => {
//       try {
//         const response = await fetch(`${SOCKET_SERVER_URL}/api/user`, {
//           method: 'GET',
//           credentials: 'include', // Ensures the cookie is sent with the request
//         });

//         if (response.ok) {
//           const userData = await response.json();
//           console.log("hello",userData);

//           // setUsername(userData.username);
//           // setAvatar(userData.avatar.large);
//           // setSteamId64(userData.steamID64);
//           // setIsLoggedIn(true);
//         } else {
//           console.log("User is not logged in or error occurred.");
//         }
//       } catch (error) {
//         console.error("Error fetching user info:", error);
//       }
//     };

//     fetchUserInfo();
//   }, []);

//   const handleLogin = () => {
//     window.location.href = `${SOCKET_SERVER_URL}/auth/steam`;
//   };

//   const handleLogout = async () => {
//     try {
//       await fetch(`${SOCKET_SERVER_URL}/auth/logout`, {
//         method: "POST",
//         credentials: "include", // Include cookie to ensure server knows the user
//       });
//       setIsLoggedIn(false);
//       setUsername("");
//       setAvatar("");
//     } catch (error) {
//       console.error("Error logging out:", error);
//     }
//   };

//   return (
//     <div>
//       {!isLoggedIn ? (
//         <button id="loginButton" onClick={handleLogin}>
//           <img
//             src="https://community.akamai.steamstatic.com/public/images/signinthroughsteam/sits_01.png"
//             alt="steam login"
//           />
//         </button>
//       ) : (
//         <div className="flex gap-x-8 items-center">
//           <AccountSetting />
//           <button id="logoutButton" onClick={handleLogout}>
//             <LogoutIcon htmlColor="white" />
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SteamLogin;

// useEffect(() => {
//   // Function to fetch the specific cookie by name
//   const getCookieByName = (name : string) => {
//     const cookieArr = document.cookie.split(';');
//     for (let i = 0; i < cookieArr.length; i++) {
//       const cookiePair = cookieArr[i].split('=');
//       if (name === cookiePair[0].trim()) {
//         return decodeURIComponent(cookiePair[1]);
//       }
//     }
//     return null;
//   };

//   // Function to delete the cookie from the browser
//   const deleteCookie = (name : string) => {
//     document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
//   };

//   // Fetch user info securely from the server
//   const fetchUserInfo = async () => {
//     try {
//       console.log("SOCKET_SERVER_URL", document.cookie);

//       const response = await fetch(`${SOCKET_SERVER_URL}/api/user`, {
//         method: 'GET',
//         credentials: 'include', // This ensures the cookie is sent with the request
//       });

//       if (response.ok) {
//         const userData = await response.json();
//         setUsername(userData.username);
//         setAvatar(userData.avatar.large);
//         setSteamId64(userData.steamID64);
//         setIsLoggedIn(true);
//         console.log(userData);

//         // Fetch the 'FBI' cookie
//         const fbiCookie = getCookieByName('FBI');
//         console.log('FBI Cookie:', fbiCookie);

//         // Store the FBI cookie in a variable
//         if (fbiCookie) {
//           // Store FBI cookie in a variable
//           const storedFbiCookie = fbiCookie;
//           console.log('Stored FBI Cookie:', storedFbiCookie);

//           // Delete the cookie from the browser
//           deleteCookie('FBI');
//           console.log('FBI Cookie deleted');
//         } else {
//           console.log('FBI Cookie not found');
//         }
//       } else {
//         console.log('User is not logged in.');
//       }
//     } catch (error) {
//       console.error('Error fetching user info:', error);
//     }
//   };

//   fetchUserInfo();
// }, []);

// useEffect(() => {
//   // Fetch user info securely from the server
//   const fetchUserInfo = async () => {
//     try {
//       console.log("SOCKET_SERVER_URL",document.cookie);

//       const response = await fetch(`${SOCKET_SERVER_URL}/api/user`, {
//         method: 'GET',
//         credentials: 'include' // This ensures the cookie is sent with the request
//       });

//       if (response.ok) {
//         const userData = await response.json();
//         setUsername(userData.username);
//         setAvatar(userData.avatar.large);
//         setSteamId64(userData.steamID64);
//         setIsLoggedIn(true);
//         console.log(userData);
//       } else {
//         console.log("User is not logged in.");
//       }
//     } catch (error) {
//       console.error("Error fetching user info:", error);
//     }
//   };

//     fetchUserInfo();

// }, []);

// "use client";
// import React, { useEffect, useState } from "react";
// import AccountSetting from "@/components/Header/iconsdropdown";
// import LogoutIcon from "@mui/icons-material/Logout";
// import { useUserContext } from '@/context/UserContext';
// import IMGSTEAMBTN from "@/assets/images/SteamLoginButton.png";
// import Image from "next/image";

// const SteamLogin: React.FC = () => {
//   const { isLoggedIn } = useUserContext()
//   const { setUsername, setAvatar, setSteamId64, setIsLoggedIn } = useUserContext();
//   const SOCKET_SERVER_URL =
//     process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "http://localhost:5000";

//     useEffect(() => {
//       const fetchUserInfo = async () => {
//         try {
//           console.log("Before fetch:", document.cookie); // Log cookies before fetching

//           const response = await fetch(`${SOCKET_SERVER_URL}/api/user`, {
//             method: 'GET',
//             credentials: 'include' // Ensures the cookie is sent with the request
//           });

//           console.log("Response Status:", response.status); // Log response status

//           if (response.ok) {
//             const userData = await response.json();
//             setUsername(userData.username);
//             setAvatar(userData.avatar.large);
//             setSteamId64(userData.steamID64);
//             setIsLoggedIn(true);
//             console.log("User data:", userData);
//           } else {
//             console.log("User is not logged in or error occurred.");
//           }
//         } catch (error) {
//           console.error("Error fetching user info:", error);
//         }
//       };

//       fetchUserInfo();
//     }, []);
//   const handleLogin = () => {

//     window.location.href = `${SOCKET_SERVER_URL}/auth/steam`;
//   };

//   const handleLogout = async () => {
//     try {
//       console.log("SOCKET_SERVER_URL",document.cookie);
//       await fetch(`${SOCKET_SERVER_URL}/auth/logout`, {
//         method: "POST",
//         credentials: "include",
//       });
//       setIsLoggedIn(false);
//       setUsername("");
//       setAvatar("");
//     } catch (error) {
//       console.error("Error logging out:", error);
//     }
//   };

//   return (
//     <div>
//       {!isLoggedIn && (
//         <div>
//           <button id="loginButton" onClick={handleLogin}>
//             <Image
//               src={IMGSTEAMBTN}
//               alt="SteamLogin"
//             />
//           </button>
//         </div>
//       )}
//       {isLoggedIn && (
//         <div className="flex gap-x-8 items-center">
//           <AccountSetting />
//           <button id="logoutButton" onClick={handleLogout}>
//             <LogoutIcon htmlColor="white" />
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SteamLogin;
