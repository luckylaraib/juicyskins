
// "use client";
// import "@/assets/css/tailwind.css";
// import { Box, CircularProgress } from "@mui/material";
// import { usePathname, useRouter } from "next/navigation";
// import Header from "../Header";
// import { UserProvider } from "@/context/UserContext";
// import { useEffect, useState } from "react";

// type Prop = {
//   children: JSX.Element;
// };

// export default function Layout({ children }: Prop) {
//   const pathname = usePathname();
//   const router = useRouter();
//   const [isAuthProcessing, setIsAuthProcessing] = useState(true);
//   const noHeaderPaths = ["/login"];

//   // Detect auth-callback path and process the redirect
//   useEffect(() => {
//     if (pathname?.startsWith("/auth-callback")) {
//       setIsAuthProcessing(true); // Indicate auth callback is being processed

//       // Simulate a brief delay to handle auth, JWT exchange, and redirect
//       setTimeout(() => {
//         router.replace("/"); // Redirect to the base URL after the process
//         setIsAuthProcessing(false); // Auth processing is done
//       }, 1000); // Adjust the delay if needed
//     } else {
//       setIsAuthProcessing(false); // No auth callback, render normally
//     }
//   }, [pathname, router]);

//   return (
//     <>
//     <Box
//       sx={{
//         backgroundColor: isAuthProcessing ? "#2c2c2c" : "#f9f9f9", // Grey background during processing
//         minHeight: "100vh", // Ensure full viewport height
//         display: "flex",
//         flexDirection: "column",
//       }}
//     >
//       <UserProvider>
//         {pathname && !noHeaderPaths.includes(pathname) && <Header />}

//         {/* Render attractive loading spinner during auth processing */}
//         {isAuthProcessing ? (
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               minHeight: "100vh", // Vertically center the spinner
//               backgroundColor: "#2c2c2c", // Grey background
//             }}
//           >
//             <Box sx={{ textAlign: "center" }}>
//               <CircularProgress
//                 sx={{
//                   color: "#00d1b2", // Attractive spinner color (light green)
//                   size: 60, // Bigger size
//                   thickness: 4.5, // Thicker spinner line
//                 }}
//               />
//             </Box>
//           </Box>
//         ) : (
//           children
//         )}
//       </UserProvider>
//     </Box>
//     </>
//   );
// }

// Layout.tsx

"use client";
import "@/assets/css/tailwind.css";
import { Box, CircularProgress } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import Header from "../Header";
import { UserProvider } from "@/context/UserContext";
import { useEffect, useState } from "react";

// Import QueryClient and QueryClientProvider from React Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type Prop = {
  children: JSX.Element;
};

export default function Layout({ children }: Prop) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthProcessing, setIsAuthProcessing] = useState(true);
  const noHeaderPaths = ["/login"];

  // Initialize a QueryClient instance
  const queryClient = new QueryClient();

  // Detect auth-callback path and process the redirect
  useEffect(() => {
    if (pathname?.startsWith("/auth-callback")) {
      setIsAuthProcessing(true); // Indicate auth callback is being processed

      // Simulate a brief delay to handle auth, JWT exchange, and redirect
      setTimeout(() => {
        router.replace("/"); // Redirect to the base URL after the process
        setIsAuthProcessing(false); // Auth processing is done
      }, 1000); // Adjust the delay if needed
    } else {
      setIsAuthProcessing(false); // No auth callback, render normally
    }
  }, [pathname, router]);

  return (
    <Box
      sx={{
        backgroundColor: isAuthProcessing ? "#2c2c2c" : "#f9f9f9",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Wrap your app with QueryClientProvider */}
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          {pathname && !noHeaderPaths.includes(pathname) && <Header />}

          {/* Render loading spinner during auth processing */}
          {isAuthProcessing ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                backgroundColor: "#2c2c2c",
              }}
            >
              <Box sx={{ textAlign: "center" }}>
                <CircularProgress
                  sx={{
                    color: "#00d1b2",
                    size: 60,
                    thickness: 4.5,
                  }}
                />
              </Box>
            </Box>
          ) : (
            children
          )}
        </UserProvider>
      </QueryClientProvider>
    </Box>
  );
}
