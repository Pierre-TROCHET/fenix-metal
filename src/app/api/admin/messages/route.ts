import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Récupérer les messages de contact
    const messages = await prisma.contact.findMany({
      select: {
        nom: true,
        email: true,
        telephone: true,
        sujet: true,
        message: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc", // Du plus récent au plus ancien
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Erreur lors de la récupération des messages:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
