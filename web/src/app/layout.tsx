import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import { AuthSessionProvider } from "@/components/providers/session-provider";
import { BackgroundBlobs } from "@/components/ui/background-blobs";
import { ModalProvider } from "@/components/modal/modal-provider";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Staycation — book the whole place",
  description:
    "Apartments, hotels, villas and homes kept by people who live there. Book the whole place in two minutes.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${archivo.variable} h-full antialiased`}>
      <body className="relative min-h-full bg-bg text-ink">
        <AuthSessionProvider>
          <ModalProvider>
            <BackgroundBlobs />
            {children}
          </ModalProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
