"use client";

import { useState } from 'react';

interface ContactFormData {
  nom: string;
  email: string;
  telephone: string;
  sujet: string;
  message: string;
}

interface ContactFormProps {
  csrfToken: string;
}

export default function ContactForm({ csrfToken }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    nom: '',
    email: '',
    telephone: '',
    sujet: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          csrfToken
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: result.message
        });
        // Réinitialiser le formulaire
        setFormData({
          nom: '',
          email: '',
          telephone: '',
          sujet: '',
          message: ''
        });
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.error || 'Une erreur est survenue'
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Erreur de connexion. Veuillez réessayer.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Message de statut */}
        {submitStatus.type && (
          <div className={`p-4 rounded-lg border ${
            submitStatus.type === 'success' 
              ? 'bg-green-900/20 border-green-700 text-green-300' 
              : 'bg-red-900/20 border-red-700 text-red-300'
          }`}>
            {submitStatus.message}
          </div>
        )}

        {/* Nom */}
        <div>
          <label htmlFor="nom" className="block text-sm font-medium text-gray-300 mb-2">
            Nom complet *
          </label>
          <input
            type="text"
            id="nom"
            name="nom"
            value={formData.nom}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-600/50 focus:border-orange-600 transition-colors"
            placeholder="Votre nom complet"
            maxLength={100}
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Adresse email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-600/50 focus:border-orange-600 transition-colors"
            placeholder="votre@email.com"
          />
        </div>

        {/* Téléphone */}
        <div>
          <label htmlFor="telephone" className="block text-sm font-medium text-gray-300 mb-2">
            Téléphone
          </label>
          <input
            type="tel"
            id="telephone"
            name="telephone"
            value={formData.telephone}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-600/50 focus:border-orange-600 transition-colors"
            placeholder="06 12 34 56 78 (optionnel)"
          />
        </div>

        {/* Sujet */}
        <div>
          <label htmlFor="sujet" className="block text-sm font-medium text-gray-300 mb-2">
            Sujet *
          </label>
          <input
            type="text"
            id="sujet"
            name="sujet"
            value={formData.sujet}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-600/50 focus:border-orange-600 transition-colors"
            placeholder="Objet de votre message"
            maxLength={200}
          />
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
            rows={6}
            className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-600/50 focus:border-orange-600 transition-colors resize-vertical"
            placeholder="Décrivez votre projet ou votre demande..."
            maxLength={2000}
          />
          <div className="mt-1 text-xs text-gray-500">
            {formData.message.length}/2000 caractères
          </div>
        </div>

        {/* Bouton de soumission */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
              isSubmitting
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-500 hover:to-red-500 focus:outline-none focus:ring-2 focus:ring-orange-600/50 shadow-lg hover:shadow-xl'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Envoi en cours...
              </span>
            ) : (
              'Envoyer le message'
            )}
          </button>
        </div>

        {/* Note de sécurité */}
        <div className="text-xs text-gray-500 text-center">
          * Champs obligatoires. Vos données sont protégées et ne seront pas partagées.
        </div>
      </form>
    </div>
  );
}
