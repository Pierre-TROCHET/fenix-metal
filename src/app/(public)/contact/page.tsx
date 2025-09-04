import ContactForm from "../../../components/ContactForm";
import { headers } from 'next/headers';

// Fonction pour générer un token CSRF simple
function generateCSRFToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export default function ContactPage() {
  const csrfToken = generateCSRFToken();

  return (
    <main className="min-h-screen bg-black text-gray-200">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800 via-black to-black" />
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(120deg,rgba(255,80,0,0.15)_0%,rgba(255,0,0,0.1)_35%,transparent_35%,transparent_65%,rgba(255,80,0,0.15)_65%,rgba(255,0,0,0.1)_100%)]" />
        <div className="relative container mx-auto px-6 py-16 sm:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="bg-clip-text text-transparent bg-[linear-gradient(180deg,#e5e7eb_0%,#cdd0d5_45%,#aeb3bb_60%,#9aa1aa_100%)] drop-shadow">
                Contact
              </span>
            </h1>
            <p className="mt-6 text-lg text-gray-300 sm:text-xl max-w-2xl mx-auto">
              Prêt à donner vie à votre projet en fer forgé ? Contactez-moi pour discuter de vos idées.
            </p>
          </div>
        </div>
      </section>

      {/* Formulaire de Contact */}
      <section className="container mx-auto px-6 py-16 sm:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Texte d'introduction */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-100">
                  Mes œuvres vous ont plu ?
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  Vous souhaitez que l'on travaille ensemble sur un projet ?
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Vous pouvez m'envoyer un message via le formulaire ci-contre.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Je prendrais contact avec vous le plus rapidement possible.
                </p>
              </div>

              {/* Types de projets */}
              <div className="mt-8 p-6 bg-gray-950/60 rounded-xl border border-gray-800">
                <h3 className="text-lg font-semibold text-gray-100 mb-4">
                  Types de projets
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <span>Escaliers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <span>Rambardes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <span>Portails</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <span>Portes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <span>Marquises</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <span>Barreaux</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <span>Grillages</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <span>Pièces d'art</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulaire */}
            <div className="lg:pl-8">
              <div className="p-8 bg-gray-950/60 rounded-xl border border-gray-800">
                <h2 className="text-2xl font-bold text-gray-100 mb-6">
                  Envoyez-moi un message
                </h2>
                <ContactForm csrfToken={csrfToken} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}


