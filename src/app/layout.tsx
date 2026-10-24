import type { Metadata } from "next";
import "./globals.css";
import { WeddingProvider } from "@/context/WeddingContext";

export const metadata: Metadata = {
  title: "Hosni & Eyerusalem | Save The Date",
  description: "Join us in celebrating the holy matrimony and wedding of Hosni Mubarek & Eyerusalem Alemayehu at Lideta Mekane Yesus, Addis Ababa. እሑድ፣ ህዳር 6፣ 2019 ዓ.ም (November 15, 2026).",
  keywords: ["Hosni and Eyerusalem", "Wedding Invitation", "Yene Serg", "Habesha Wedding", "Ethiopian Wedding", "ልደታ መካነየሱስ"],
  metadataBase: new URL('https://digitalweddinginvitation.vercel.app'),
  openGraph: {
    title: "Hosni & Eyerusalem | Save The Date",
    description: "You are invited to celebrate the royal wedding of Hosni & Eyerusalem. Click to open your invitation.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Hosni & Eyerusalem Royal Wedding Celebration",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hosni & Eyerusalem | Save The Date",
    description: "You are invited to celebrate the royal wedding of Hosni & Eyerusalem. Click to open your invitation.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;800;900&family=Great+Vibes&family=Pinyon+Script&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Noto+Serif+Ethiopic:wght@400;600;700;800&family=Outfit:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="font-sans antialiased bg-[#051812] text-[#fef3c7] min-h-screen selection:bg-[#d4af37]/30 selection:text-amber-200"
      >
        <WeddingProvider>
          {children}
        </WeddingProvider>
      </body>
    </html>
  );
}
