"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import { useState, useEffect } from "react";

interface Artwork {
  id: number;
  titre: string;
  description: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

interface ArtworkFormData {
  titre: string;
  description: string;
  images: string[];
}

interface UploadedImage {
  file: File;
  preview: string;
}

export default function AmenagementPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<ArtworkFormData>({
    titre: "",
    description: "",
    images: []
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(0);

  useEffect(() => {
    fetchArtworks();
  }, []);

  const fetchArtworks = async () => {
    try {
      const response = await fetch("/api/admin/amenagement");
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des aménagements");
      }
      const data = await response.json();
      setArtworks(data);
    } catch (err) {
      setError("Impossible de charger les aménagements");
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

  // Fonction pour déterminer si une image est une URL complète (Vercel Blob) ou un nom de fichier local
  const getImageSrc = (imagePath: string) => {
    // Si c'est une URL complète (commence par http/https), on l'utilise directement
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    // Si le chemin commence déjà par "/amenagement/", on l'utilise tel quel
    if (imagePath.startsWith('/amenagement/')) {
      return imagePath;
    }
    // Sinon, c'est juste le nom du fichier, on ajoute le préfixe "/amenagement/"
    return `/amenagement/${imagePath}`;
  };

  const handleAddNew = () => {
    setFormData({ titre: "", description: "", images: [] });
    setEditingId(null);
    setUploadedImages([]);
    setFileInputKey(prev => prev + 1);
    setShowForm(true);
  };

  const handleEdit = (artwork: Artwork) => {
    setFormData({
      titre: artwork.titre,
      description: artwork.description,
      images: artwork.images
    });
    setEditingId(artwork.id);
    setUploadedImages([]); // Pas de nouvelles images pour l'édition
    setFileInputKey(prev => prev + 1);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      const response = await fetch(`/api/admin/amenagement/${deleteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      setArtworks(artworks.filter(artwork => artwork.id !== deleteId));
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (err) {
      setError("Impossible de supprimer l'aménagement");
      console.error(err);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Valider les types de fichiers
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const invalidFiles = files.filter(file => !allowedTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      setError("Types de fichiers non supportés. Utilisez JPEG, PNG ou WebP.");
      return;
    }

    // Valider la taille (10MB max par fichier)
    const oversizedFiles = files.filter(file => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError("Certains fichiers sont trop volumineux (max 10MB).");
      return;
    }

    // Créer les prévisualisations
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setUploadedImages(prev => [...prev, ...newImages]);
    setError("");
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
    // Réinitialiser l'input file pour permettre la re-sélection
    setFileInputKey(prev => prev + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titre.trim() || !formData.description.trim()) {
      setError("Titre et description sont requis");
      return;
    }

    // Pour les nouveaux aménagements, au moins 1 image est requise
    if (!editingId && uploadedImages.length === 0) {
      setError("Au moins une image est requise");
      return;
    }

    setUploading(true);
    setError("");

    try {
      let imageUrls = [...formData.images];

      // Upload des nouvelles images si il y en a
      if (uploadedImages.length > 0) {
        const uploadFormData = new FormData();
        uploadedImages.forEach(img => {
          uploadFormData.append("images", img.file);
        });

        const uploadResponse = await fetch("/api/admin/upload", {
          method: "POST",
          body: uploadFormData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.error || "Erreur lors de l'upload");
        }

        const uploadData = await uploadResponse.json();
        imageUrls = [...imageUrls, ...uploadData.urls];
      }

      // Sauvegarder l'aménagement avec les URLs d'images
      const url = editingId ? `/api/admin/amenagement/${editingId}` : "/api/admin/amenagement";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          images: imageUrls
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la sauvegarde");
      }

      const savedArtwork = await response.json();

      if (editingId) {
        setArtworks(artworks.map(artwork => 
          artwork.id === editingId ? savedArtwork : artwork
        ));
      } else {
        setArtworks([...artworks, savedArtwork]);
      }

      setShowForm(false);
      setEditingId(null);
      setFormData({ titre: "", description: "", images: [] });
      setUploadedImages([]);
      setFileInputKey(prev => prev + 1);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de sauvegarder l'aménagement");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    // Nettoyer les prévisualisations
    uploadedImages.forEach(img => URL.revokeObjectURL(img.preview));
    
    setShowForm(false);
    setEditingId(null);
    setFormData({ titre: "", description: "", images: [] });
    setUploadedImages([]);
    setFileInputKey(prev => prev + 1);
    setError("");
  };

  if (loading) {
    return (
      <AuthGuard>
        <main className="min-h-screen bg-black text-gray-200">
          <div className="container mx-auto p-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Chargement des aménagements...</p>
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
              <h1 className="text-3xl font-bold text-white">Gestion des aménagements</h1>
              <p className="text-gray-400 mt-2">
                {artworks.length} aménagement{artworks.length > 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleAddNew}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <span className="text-xl">+</span>
                Ajouter un aménagement
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Se déconnecter
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-white mb-6">
                  {editingId ? "Modifier l'aménagement" : "Nouvel aménagement"}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="titre" className="block text-sm font-medium text-gray-300 mb-2">
                      Titre *
                    </label>
                    <input
                      id="titre"
                      type="text"
                      value={formData.titre}
                      onChange={(e) => setFormData({...formData, titre: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Titre de l'aménagement"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                      Description *
                    </label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Description de l'aménagement"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="images" className="block text-sm font-medium text-gray-300 mb-2">
                      Images {!editingId && "*"}
                    </label>
                    
                    {!editingId && (
                      <div className="mb-4">
                        <input
                          key={fileInputKey}
                          id="images"
                          type="file"
                          multiple
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          onChange={handleImageUpload}
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-600 file:text-white hover:file:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          Formats acceptés: JPEG, PNG, WebP. Taille max: 10MB par fichier.
                        </p>
                        <p className="text-xs text-orange-400 mt-1">
                          ⚡ Les nouvelles images seront automatiquement uploadées sur Vercel Blob.
                        </p>
                      </div>
                    )}

                    {/* Prévisualisation des images uploadées */}
                    {uploadedImages.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-300 mb-2">Images sélectionnées:</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {uploadedImages.map((img, index) => (
                            <div key={index} className="relative">
                              <img
                                src={img.preview}
                                alt={`Prévisualisation ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg border border-gray-700"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Affichage des images existantes pour l'édition */}
                    {editingId && formData.images.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-300 mb-2">Images actuelles:</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {formData.images.map((imagePath, index) => (
                            <div key={index} className="relative">
                              <img
                                src={getImageSrc(imagePath)}
                                alt={`Image ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg border border-gray-700"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                }}
                              />
                              <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                {imagePath.startsWith('http') ? 'Vercel Blob' : 'Local'}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={uploading}
                      className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                    >
                      {uploading && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      )}
                      {uploading 
                        ? (editingId ? "Mise à jour..." : "Création...") 
                        : (editingId ? "Mettre à jour" : "Créer")
                      }
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={uploading}
                      className="bg-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md">
                <h3 className="text-xl font-bold text-white mb-4">Confirmer la suppression</h3>
                <p className="text-gray-300 mb-6">
                  Êtes-vous sûr de vouloir supprimer cet aménagement ? Cette action est irréversible.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={confirmDelete}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Supprimer
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setDeleteId(null);
                    }}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Artworks list */}
          {artworks.length === 0 ? (
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 text-center">
              <p className="text-gray-400 text-lg">Aucun aménagement pour le moment.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {artworks.map((artwork) => (
                <div
                  key={artwork.id}
                  className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:bg-gray-900/70 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <h3 className="text-xl font-semibold text-white">
                          {artwork.titre}
                        </h3>
                        <span className="text-sm text-gray-500">ID: {artwork.id}</span>
                      </div>
                      
                      <p className="text-gray-300 mb-4 leading-relaxed">
                        {artwork.description}
                      </p>

                      {artwork.images.length > 0 && (
                        <div className="mb-4">
                          <span className="text-gray-500 text-sm">Images:</span>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                            {artwork.images.map((imagePath, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={getImageSrc(imagePath)}
                                  alt={`Image ${index + 1}`}
                                  className="w-full h-20 object-cover rounded border border-gray-700"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                  }}
                                />
                                <div className="absolute top-1 left-1 bg-black/70 text-white text-xs px-1 py-0.5 rounded text-[10px]">
                                  {imagePath.startsWith('http') ? 'Blob' : 'Local'}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-4 text-sm text-gray-500">
                        <span>Créé: {formatDate(artwork.createdAt)}</span>
                        <span>Modifié: {formatDate(artwork.updatedAt)}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(artwork)}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(artwork.id)}
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
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

