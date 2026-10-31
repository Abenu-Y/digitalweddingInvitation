import type { Metadata } from "next";
import "./globals.css";
import { WeddingProvider } from "@/context/WeddingContext";

export const metadata: Metadata = {
  title: "Hosni & Eyerusalem | Save The Date (የሰርግ ጥሪ)",
  description: "You are invited to celebrate the holy matrimony and wedding of Hosni Mubarek & Eyerusalem Alemayehu at Lideta Mekane Yesus, Addis Ababa. እሑድ፣ ህዳር 6፣ 2019 ዓ.ም (November 15, 2026).",
  keywords: ["Hosni and Eyerusalem", "Hosni & Jerry", "Wedding Invitation", "Yene Serg", "Habesha Wedding", "Ethiopian Wedding", "ልደታ መካነየሱስ"],
  metadataBase: new URL('https://hosniandjerry.vercel.app'),
  alternates: {
    canonical: 'https://hosniandjerry.vercel.app',
  },
  openGraph: {
    title: "Hosni & Eyerusalem | Save The Date (የሰርግ ጥሪ)",
    description: "You are invited to celebrate the wedding of Hosni & Eyerusalem. Click to open your interactive invitation.",
    url: 'https://hosniandjerry.vercel.app',
    siteName: 'Hosni & Eyerusalem Wedding Invitation',
    locale: 'am_ET',
    type: "website",
    images: [
      {
        url: "/og-image.png",
        secureUrl: "https://hosniandjerry.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Hosni & Eyerusalem Royal Wedding Celebration",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hosni & Eyerusalem | Save The Date (የሰርግ ጥሪ)",
    description: "You are invited to celebrate the wedding of Hosni & Eyerusalem. Click to open your interactive invitation.",
    images: ["https://hosniandjerry.vercel.app/og-image.png"],
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
        {/* Suppress third-party Chrome extension timeouts from triggering Next.js dev error overlay */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window === 'undefined') return;
                var isExtensionError = function(e) {
                  var str = (e ? (e.message || e.filename || (e.reason && (e.reason.message || e.reason.stack)) || '') : '') + '';
                  return str.indexOf('chrome-extension') !== -1 || str.indexOf('chrome:') !== -1;
                };
                window.addEventListener('unhandledrejection', function(e) {
                  if (isExtensionError(e)) {
                    e.preventDefault();
                    if (e.stopImmediatePropagation) e.stopImmediatePropagation();
                  }
                }, true);
                window.addEventListener('error', function(e) {
                  if (isExtensionError(e)) {
                    e.preventDefault();
                    if (e.stopImmediatePropagation) e.stopImmediatePropagation();
                  }
                }, true);
              })();
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;800;900&family=Great+Vibes&family=Pinyon+Script&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Noto+Serif+Ethiopic:wght@400;600;700;800&family=Outfit:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Explicit OpenGraph & Social Share Meta for WhatsApp, Telegram, and Social Networks */}
        <meta property="og:title" content="Hosni & Eyerusalem | Save The Date (የሰርግ ጥሪ)" />
        <meta property="og:description" content="You are invited to celebrate the wedding of Hosni & Eyerusalem. Click to open your interactive invitation." />
        <meta property="og:image" content="https://hosniandjerry.vercel.app/og-image.png" />
        <meta property="og:image:secure_url" content="https://hosniandjerry.vercel.app/og-image.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content="https://hosniandjerry.vercel.app/" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://hosniandjerry.vercel.app/og-image.png" />
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
