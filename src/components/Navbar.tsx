"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-gray-800/80 bg-black/70 backdrop-blur supports-[backdrop-filter]:bg-black/50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-gray-100 font-extrabold tracking-wide text-lg">
          Fenix-metal
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/" className="text-gray-300 hover:text-white">Accueil</Link>
          <Link href="/art" className="text-gray-300 hover:text-white">Art</Link>
          <Link href="/amenagement" className="text-gray-300 hover:text-white">Aménagement</Link>
          <Link href="/contact" className="text-gray-300 hover:text-white">Contact</Link>
        </nav>

        {/* Mobile toggle */}
        <button
          aria-label="Ouvrir le menu"
          className="md:hidden text-gray-200 hover:text-white"
          onClick={() => setOpen((v) => !v)}
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile sheet */}
      {open && (
        <div className="md:hidden border-t border-gray-800/80 bg-black">
          <nav className="container mx-auto px-6 py-3 flex flex-col gap-3 text-sm">
            <Link href="/" className="text-gray-300 hover:text-white" onClick={() => setOpen(false)}>Accueil</Link>
            <Link href="/art" className="text-gray-300 hover:text-white" onClick={() => setOpen(false)}>Art</Link>
            <Link href="/amenagement" className="text-gray-300 hover:text-white" onClick={() => setOpen(false)}>Aménagement</Link>
            <Link href="/contact" className="text-gray-300 hover:text-white" onClick={() => setOpen(false)}>Contact</Link>
          </nav>
        </div>
      )}
    </header>
  );
}


