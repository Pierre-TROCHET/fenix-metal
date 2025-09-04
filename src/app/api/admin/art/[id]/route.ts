import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PUT - Mettre à jour une œuvre d'art
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    const body = await request.json();
    const { titre, description, images } = body;

    // Validation des champs requis
    if (!titre || !description) {
      return NextResponse.json(
        { error: "Titre et description sont requis" },
        { status: 400 }
      );
    }

    // Vérifier que l'œuvre existe et appartient à la catégorie "art"
    const existingArtwork = await prisma.artwork.findFirst({
      where: {
        id,
        category: "art"
      }
    });

    if (!existingArtwork) {
      return NextResponse.json({ error: "Œuvre non trouvée" }, { status: 404 });
    }

    // Mettre à jour l'œuvre (updatedAt sera automatiquement mis à jour)
    const artwork = await prisma.artwork.update({
      where: { id },
      data: {
        titre,
        description,
        images: images || [],
      },
      select: {
        id: true,
        titre: true,
        description: true,
        images: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(artwork);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'œuvre:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une œuvre d'art
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    // Vérifier que l'œuvre existe et appartient à la catégorie "art"
    const existingArtwork = await prisma.artwork.findFirst({
      where: {
        id,
        category: "art"
      }
    });

    if (!existingArtwork) {
      return NextResponse.json({ error: "Œuvre non trouvée" }, { status: 404 });
    }

    // Supprimer l'œuvre
    await prisma.artwork.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Œuvre supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'œuvre:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
