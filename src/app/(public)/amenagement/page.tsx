import { prisma } from "../../../lib/prisma";
import type { Artwork } from "../../../generated/prisma";
import ImageCarousel from "../../../components/ImageCarousel";

export const dynamic = "force-dynamic";

// Tri utilitaire par suffixe numérique si présent
function sortByNumericSuffix(images: string[]): string[] {
  return [...images].sort((a, b) => {
    const numA = parseInt(a.match(/(\d+)(?=\.[a-zA-Z]+$)/)?.[1] || a.match(/(\d+)$/)?.[1] || "0", 10);
    const numB = parseInt(b.match(/(\d+)(?=\.[a-zA-Z]+$)/)?.[1] || b.match(/(\d+)$/)?.[1] || "0", 10);
    return numA - numB;
  });
}

export default async function AmenagementPage() {
  const artworks = await prisma.artwork.findMany({
    where: { category: "amenagement" },
    orderBy: { createdAt: "desc" },
  });

  // Normaliser le champ images (Json -> string[]), et trier
  const artworksWithAllImages = artworks.map((artwork) => {
    const rawImages = Array.isArray(artwork.images)
      ? (artwork.images as unknown as string[])
      : typeof artwork.images === "string"
      ? (JSON.parse(artwork.images as unknown as string) as string[])
      : [];

    const images = sortByNumericSuffix(rawImages);

    return {
      ...artwork,
      images,
    } as Artwork & { images: string[] };
  });

  return (
    <main className="min-h-screen bg-black text-gray-200">
      <section className="container mx-auto px-6 py-10 sm:py-12">
        <h1 className="text-3xl font-bold">Aménagements métalliques</h1>
        <p className="mt-3 text-gray-400">Toutes les créations de la catégorie "aménagement".</p>
      </section>

      <section className="container mx-auto px-6 pb-16 sm:pb-20">
        {artworksWithAllImages.length === 0 ? (
          <p className="text-gray-500">Aucun aménagement disponible pour le moment.</p>
        ) : (
          <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {artworksWithAllImages.map((artwork) => (
              <article key={artwork.id} className="group overflow-hidden rounded-xl border border-gray-800 bg-gray-950/60">
                <ImageCarousel images={artwork.images} title={artwork.titre} folder="amenagement" />
                <div className="p-5 sm:p-6">
                  <h2 className="text-lg font-semibold text-gray-100">{artwork.titre}</h2>
                  <p className="mt-2 line-clamp-3 text-sm text-gray-400">{artwork.description}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}