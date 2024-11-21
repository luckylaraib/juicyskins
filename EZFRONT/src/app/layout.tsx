
import Layout from "@/components/Layout";
import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";
import "@/styles/globals.css";
import * as React from "react";

export const metadata = {
  title: "Home | ~ EZ Skins",
  description: "Home | Infinite Craft",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com"></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght@8..144,100..1000&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <body>
        <ThemeRegistry>
          <Layout>
            <>{children}</>
          </Layout>
        </ThemeRegistry>
      </body>
    </html>
  );
}
