"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface ImageCarouselProps {
  images: string[];
  title: string;
  folder: "art" | "amenagement";
}

export default function ImageCarousel({ images, title, folder }: ImageCarouselProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [imageError, setImageError] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Fonction pour déterminer si une image est une URL complète (Vercel Blob) ou un nom de fichier local
  const getImageSrc = (imagePath: string) => {
    // Si c'est une URL complète (commence par http/https), on l'utilise directement
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    // Sinon, c'est un fichier local, on construit le chemin
    return `/${folder}/${imagePath}`;
  };

  // Réinitialiser l'erreur d'image quand on change d'image
  useEffect(() => {
    setImageError(false);
  }, [currentImageIndex]);

  // Configuration du swipe
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextImage();
    }
    if (isRightSwipe) {
      prevImage();
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };



  // Navigation clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextImage, prevImage]);

  if (!images || images.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center bg-gray-900 text-gray-600">
        Aucune image
      </div>
    );
  }

  const hasMultipleImages = images.length > 1;

  return (
    <div 
      ref={carouselRef}
      className="relative aspect-[4/3] w-full overflow-hidden bg-gray-900"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Image principale */}
      {!imageError ? (
        <Image
          src={getImageSrc(images[currentImageIndex])}
          alt={`${title} - Image ${currentImageIndex + 1}`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-contain"
          priority={currentImageIndex === 0}
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="flex items-center justify-center h-full bg-gray-800 text-gray-400">
          <div className="text-center">
            <svg className="w-12 h-12 mx-auto mb-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">Image non disponible</p>
          </div>
        </div>
      )}

      {/* Navigation flèches - visibles si plusieurs images et sur desktop uniquement */}
      {hasMultipleImages && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/70 p-3 text-white hover:bg-black/80 transition-all duration-200 shadow-lg hover:scale-110 z-20 border border-white/20 hidden sm:block"
            aria-label="Image précédente"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextImage}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/70 p-3 text-white hover:bg-black/80 transition-all duration-200 shadow-lg hover:scale-110 z-20 border border-white/20 hidden sm:block"
            aria-label="Image suivante"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Indicateurs de navigation (dots) */}
      {hasMultipleImages && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentImageIndex 
                  ? "bg-white scale-110" 
                  : "bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Aller à l'image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Compteur d'images */}
      {hasMultipleImages && (
        <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2.5 py-1 rounded-full font-medium z-20 border border-white/10">
          {currentImageIndex + 1} / {images.length}
        </div>
      )}

    </div>
  );
}
