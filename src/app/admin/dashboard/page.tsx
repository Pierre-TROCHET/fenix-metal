"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = () => {
    signOut({ callbackUrl: "/admin" });
  };

  return (
    <AuthGuard>
      <main className="min-h-screen bg-black text-gray-200">
        <div className="container mx-auto p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Tableau de bord</h1>
              <p className="text-gray-400 mt-2">Bienvenue, {session?.user?.name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Se déconnecter
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Arts</h3>
              <p className="text-gray-400 mb-4">Gérez vos créations artistiques</p>
              <button 
                onClick={() => router.push("/admin/dashboard/art")}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Voir les œuvres
              </button>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Aménagements</h3>
              <p className="text-gray-400 mb-4">Gérez vos projets d&apos;aménagement</p>
              <button 
                onClick={() => router.push("/admin/dashboard/amenagement")}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Voir les aménagements
              </button>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Messages</h3>
              <p className="text-gray-400 mb-4">Voir les demandes de contact</p>
              <button 
                onClick={() => router.push("/admin/dashboard/messages")}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Voir les messages
              </button>
            </div>
          </div>
        </div>
      </main>
    </AuthGuard>
  );
}


