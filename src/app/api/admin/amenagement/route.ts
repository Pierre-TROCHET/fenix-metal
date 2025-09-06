import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Récupérer tous les aménagements
export async function GET() {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Récupérer les aménagements (catégorie "amenagement" uniquement)
    const artworks = await prisma.artwork.findMany({
      where: {
        category: "amenagement"
      },
      select: {
        id: true,
        titre: true,
        description: true,
        images: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        id: "asc", // Du plus petit au plus grand
      },
    });

    return NextResponse.json(artworks);
  } catch (error) {
    console.error("Erreur lors de la récupération des aménagements:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// POST - Créer un nouvel aménagement
export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
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

    // Créer le nouvel aménagement
    const artwork = await prisma.artwork.create({
      data: {
        titre,
        description,
        images: images || [],
        category: "amenagement", // Toujours "amenagement" pour cette page
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

    return NextResponse.json(artwork, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de l'aménagement:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

