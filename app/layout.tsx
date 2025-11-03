import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { RegisterServiceWorker } from "./register-sw";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VoiceNote - 자동 음성 문서화 서비스",
  description: "녹음 버튼 하나만 누르면, 자동으로 정리된 문서를 받아볼 수 있는 자동문서화 솔루션",
  manifest: "/manifest.json",
  themeColor: "#6366f1",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <RegisterServiceWorker />
        {children}
      </body>
    </html>
  );
}
