"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import { useState, useEffect } from "react";

interface ContactMessage {
  nom: string;
  email: string;
  telephone: string | null;
  sujet: string;
  message: string;
  createdAt: string;
}

export default function MessagesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/admin/messages");
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des messages");
      }
      const data = await response.json();
      setMessages(data);
    } catch (err) {
      setError("Impossible de charger les messages");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/admin" });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <AuthGuard>
        <main className="min-h-screen bg-black text-gray-200">
          <div className="container mx-auto p-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Chargement des messages...</p>
              </div>
            </div>
          </div>
        </main>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <main className="min-h-screen bg-black text-gray-200">
        <div className="container mx-auto p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <button
                onClick={() => router.push("/admin/dashboard")}
                className="text-orange-500 hover:text-orange-400 mb-2 flex items-center"
              >
                ← Retour au tableau de bord
              </button>
              <h1 className="text-3xl font-bold text-white">Messages de contact</h1>
              <p className="text-gray-400 mt-2">
                {messages.length} message{messages.length > 1 ? "s" : ""} reçu{messages.length > 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Se déconnecter
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Messages list */}
          {messages.length === 0 ? (
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 text-center">
              <p className="text-gray-400 text-lg">Aucun message reçu pour le moment.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:bg-gray-900/70 transition-colors"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Informations de contact */}
                    <div className="lg:col-span-1">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-2">
                            {message.nom}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {formatDate(message.createdAt)}
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <span className="text-gray-500 text-sm">Email:</span>
                            <p className="text-gray-300">{message.email}</p>
                          </div>
                          
                          {message.telephone && (
                            <div>
                              <span className="text-gray-500 text-sm">Téléphone:</span>
                              <p className="text-gray-300">{message.telephone}</p>
                            </div>
                          )}
                          
                          <div>
                            <span className="text-gray-500 text-sm">Sujet:</span>
                            <p className="text-gray-300 font-medium">{message.sujet}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="lg:col-span-2">
                      <div>
                        <span className="text-gray-500 text-sm">Message:</span>
                        <div className="mt-2 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                          <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                            {message.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </AuthGuard>
  );
}
