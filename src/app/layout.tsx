import type { Metadata } from "next";
import { Press_Start_2P, VT323 } from "next/font/google";
import Header from "@/components/Header";
import "./globals.css";

const pixelFont = Press_Start_2P({
  variable: "--font-pixel",
  weight: "400",
  subsets: ["latin"],
});

const retroFont = VT323({
  variable: "--font-retro",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "고구마마켓",
  description: "보글보글 거품처럼 가볍게, 우리 동네 중고거래 - 고구마마켓",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${pixelFont.variable} ${retroFont.variable} h-full antialiased`}
    >
      <body className="ggm-body min-h-full flex flex-col">
        <Header />
        <div className="ggm-page">{children}</div>
      </body>
    </html>
  );
}
