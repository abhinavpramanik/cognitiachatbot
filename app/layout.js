import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { AppContextProvider } from "@/context/AppContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});


export const metadata = {
  title: "Cognitia AI",
  description: "Innovate with AI - Your Personal Assistant for Work and Life",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <AppContextProvider>
      <html lang="en">
        <body
          className={`${inter.className} antialiased`}
        >
          {children}
        </body>
      </html>
      </AppContextProvider>
    </ClerkProvider>
  );
}
