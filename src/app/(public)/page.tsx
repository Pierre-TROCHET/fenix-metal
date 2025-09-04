import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="bg-black text-gray-200">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800 via-black to-black" />
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(120deg,rgba(255,80,0,0.15)_0%,rgba(255,0,0,0.1)_35%,transparent_35%,transparent_65%,rgba(255,80,0,0.15)_65%,rgba(255,0,0,0.1)_100%)]" />
        <div className="relative container mx-auto px-6 py-16 sm:py-28 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Contenu texte */}
            <div className="max-w-3xl">
              <span className="inline-block rounded-full border border-gray-700/70 bg-gray-900/40 px-3 py-1 text-xs tracking-widest text-gray-400">FERRONNIER D'ART</span>
              <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                <span className="bg-clip-text text-transparent bg-[linear-gradient(180deg,#e5e7eb_0%,#cdd0d5_45%,#aeb3bb_60%,#9aa1aa_100%)] drop-shadow">Fenix Metal</span>
              </h1>
              <p className="mt-5 max-w-2xl text-lg text-gray-300 sm:text-xl">
              Bienvenue dans mon atelier,<br/>
Je m'appelle Pablo Kofteci j'ai 30 d'expérience dans la ferronnerie. <br/>
Je réalise vos aménagements métalliques: clôtures, portails, fenêtres, décorations, etc. J'effectue aussi la pose.
Je réalise ce dont vous avez besoin sur commande.<br/>
Vous trouverez sur mon site  une partie de mes réalisations. Je me déplace dans un rayon de 40 km autour de Melun.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/art"
                  className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-orange-600 to-red-600 px-5 py-3 text-sm font-semibold text-white shadow hover:from-orange-500 hover:to-red-500 focus:outline-none focus:ring-2 focus:ring-red-600/50"
                >
                  Découvrir l'art en fer
                </Link>
                <Link
                  href="/amenagement"
                  className="inline-flex items-center justify-center rounded-md border border-gray-700 bg-gray-900/40 px-5 py-3 text-sm font-semibold text-gray-200 hover:bg-gray-800/60 focus:outline-none focus:ring-2 focus:ring-gray-600/50"
                >
                  Voir les aménagements
                </Link>
              </div>
            </div>
            
            {/* Image */}
            <div className="relative h-full min-h-[300px] lg:min-h-[350px]">
              <div className="absolute inset-0 rounded-xl overflow-hidden border border-gray-800/50 bg-gradient-to-b from-gray-900/20 to-black/40">
                <Image
                  src="/accueil.jpg"
                  alt="Fenix-metal - Créations en fer forgé"
                  fill
                  className="object-cover opacity-90"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Signature */}
      <section className="border-t border-gray-800 bg-gray-950/60">
        <div className="container mx-auto px-6 py-10 sm:py-12">
          <p className="text-center text-xs text-gray-500">
            Acier, feu et précision — créations Fenix-metal.
          </p>
        </div>
      </section>
    </main>
  );
}
