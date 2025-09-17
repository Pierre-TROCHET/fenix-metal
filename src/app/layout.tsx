import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import SessionProvider from "../components/SessionProvider";
import { Analytics } from '@vercel/analytics/react';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Phenix Ferronnerie - Ferronnier d'art Paris & Île-de-France | Portails, Escaliers, Décoration",
  description: "Ferronnier d'art à Paris et Île-de-France. Créations sur mesure : portails fer forgé, escaliers, rambardes, marquises. Départements 77, 78, 91, 92, 93, 94, 95. 30 ans d'expérience.",
  keywords: "ferronnier Paris, ferronnerie d'art Île-de-France, portail fer forgé 77, escalier métal 78, rambarde 91, marquise 92, barreaux 93, grillage 94, décoration métal 95",
  openGraph: {
    title: "Phenix Ferronnerie - Ferronnier d'art Paris & Île-de-France",
    description: "Ferronnier d'art spécialisé dans les créations métalliques sur mesure. Portails, escaliers, rambardes. Intervention dans tout l'Île-de-France.",
    type: "website",
    locale: "fr_FR",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Phenix Ferronnerie",
    "description": "Ferronnier d'art spécialisé dans les créations métalliques sur mesure à Paris et Île-de-France",
    "url": "https://phenix-ferronnerie.vercel.app",
    "telephone": "07 58 82 20 76",
    "email": "aslantaskin16@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "addressRegion": "Île-de-France",
      "addressCountry": "FR"
    },
    "areaServed": [
      "Paris",
      "Seine-et-Marne",
      "Yvelines", 
      "Essonne",
      "Hauts-de-Seine",
      "Seine-Saint-Denis",
      "Val-de-Marne",
      "Val-d'Oise"
    ],
    "serviceType": "Ferronnerie d'art",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Services de ferronnerie",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Portails fer forgé"
          }
        },
        {
          "@type": "Offer", 
          "itemOffered": {
            "@type": "Service",
            "name": "Escaliers métalliques"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service", 
            "name": "Rambardes et garde-corps"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Marquises et abris"
          }
        }
      ]
    }
  };

  return (
    <html lang="fr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <Navbar />
          {children}
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  );
}
