import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { put } from "@vercel/blob";

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll("images") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "Aucune image fournie" },
        { status: 400 }
      );
    }

    // Valider les types de fichiers
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: `Type de fichier non supporté: ${file.type}. Types acceptés: JPEG, PNG, WebP` },
          { status: 400 }
        );
      }
      
      // Limiter la taille à 10MB par fichier
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: `Fichier trop volumineux: ${file.name}. Taille maximale: 10MB` },
          { status: 400 }
        );
      }
    }

    // Upload des images vers Vercel Blob
    const uploadPromises = files.map(async (file) => {
      const filename = `artwork/${Date.now()}-${Math.random().toString(36).substring(2)}-${file.name}`;
      
      const blob = await put(filename, file, {
        access: "public",
      });

      return blob.url;
    });

    const uploadedUrls = await Promise.all(uploadPromises);

    return NextResponse.json({
      urls: uploadedUrls,
      message: `${uploadedUrls.length} image(s) uploadée(s) avec succès`
    });

  } catch (error) {
    console.error("Erreur lors de l'upload:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'upload des images" },
      { status: 500 }
    );
  }
}

