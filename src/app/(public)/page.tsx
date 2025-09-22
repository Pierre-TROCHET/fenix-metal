import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="bg-black text-gray-200 min-h-screen flex flex-col">
      {/* Hero - Prend toute la hauteur disponible */}
      <section className="relative overflow-hidden flex-1 flex items-center pt-8 md:pt-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800 via-black to-black" />
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(120deg,rgba(255,80,0,0.15)_0%,rgba(255,0,0,0.1)_35%,transparent_35%,transparent_65%,rgba(255,80,0,0.15)_65%,rgba(255,0,0,0.1)_100%)]" />
        <div className="relative container mx-auto px-4 sm:px-6 py-4 sm:py-6 w-full">
          <div className="grid lg:grid-cols-2 gap-4 lg:gap-6 items-center h-full">
            {/* Contenu texte */}
            <div className="max-w-3xl">
              <span className="inline-block rounded-full border border-gray-700/70 bg-gray-900/40 px-3 py-1 text-xs tracking-widest text-gray-400">FERRONNIER D&apos;ART</span>
              <h1 className="mt-2 sm:mt-3 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight">
                <span className="bg-clip-text text-transparent bg-[linear-gradient(180deg,#e5e7eb_0%,#cdd0d5_45%,#aeb3bb_60%,#9aa1aa_100%)] drop-shadow">Phenix Ferronnerie</span>
              </h1>
              <p className="mt-2 sm:mt-3 max-w-2xl text-sm sm:text-base lg:text-lg xl:text-xl text-gray-300 leading-relaxed">
              <strong>Ferronnier d'art à Paris et Île-de-France</strong><br/>
              Je m&apos;appelle Pablo Kofteci, j&apos;ai 30 ans d&apos;expérience dans la ferronnerie d'art. <br/>
              Je réalise vos aménagements métalliques sur mesure : <strong>portails fer forgé, escaliers, rambardes, marquises, barreaux de fenêtres</strong> et décorations métalliques. J&apos;effectue aussi la pose.<br/>
              Spécialisé dans les créations artistiques en fer forgé, je travaille sur commande selon vos besoins.<br/>
              Vous trouverez sur mon site une partie de mes réalisations. <strong>Je me déplace dans tout l'Île-de-France : Paris, Seine-et-Marne (77), Yvelines (78), Essonne (91), Hauts-de-Seine (92), Seine-Saint-Denis (93), Val-de-Marne (94), Val-d'Oise (95).</strong>
              </p>
              <div className="mt-4 sm:mt-5 flex flex-wrap gap-3 sm:gap-4">
                <Link
                  href="/art"
                  className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-orange-600 to-red-600 px-4 py-2.5 sm:px-5 sm:py-3 text-sm sm:text-base font-semibold text-white shadow hover:from-orange-500 hover:to-red-500 focus:outline-none focus:ring-2 focus:ring-red-600/50"
                >
                  Découvrir l&apos;art en fer
                </Link>
                <Link
                  href="/amenagement"
                  className="inline-flex items-center justify-center rounded-md border border-gray-700 bg-gray-900/40 px-4 py-2.5 sm:px-5 sm:py-3 text-sm sm:text-base font-semibold text-gray-200 hover:bg-gray-800/60 focus:outline-none focus:ring-2 focus:ring-gray-600/50"
                >
                  Voir les aménagements
                </Link>
              </div>
            </div>
            
            {/* Image - Responsive et adaptée à l'espace disponible */}
            <div className="relative w-full max-w-sm mx-auto lg:max-w-none">
              <div className="w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[350px] xl:max-w-[400px] mx-auto relative" style={{aspectRatio: '945/1254'}}>
                <div className="absolute inset-0 rounded-xl overflow-hidden border border-gray-800/50 bg-gradient-to-b from-gray-900/20 to-black/40">
                  <Image
                    src="/accueil.jpg"
                    alt="Phenix Ferronnerie - Créations en fer forgé"
                    fill
                    className="object-cover opacity-90"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Signature - Fixée en bas */}
      <section className="border-t border-gray-800 bg-gray-950/60 mt-auto">
        <div className="container mx-auto px-4 sm:px-6 py-2 sm:py-3">
          <p className="text-center text-xs text-gray-500">
            Acier, feu et précision — créations Phenix Ferronnerie.
          </p>
        </div>
      </section>
    </main>
  );
}
