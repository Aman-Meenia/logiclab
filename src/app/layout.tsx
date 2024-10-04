import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import Header from "@/components/header/Header";
import { Toaster } from "react-hot-toast";
import { ProblemContextProvider } from "@/store/ProblemContextProvider";
import { Provider } from "@/Provider/SessionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LogicLab",
  description: "Coding Platform To Solve DSA Problems",
  icons: {
    icon: "/logiclab.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster />
          <Provider>
            <Header />
            <ProblemContextProvider>{children}</ProblemContextProvider>
          </Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
