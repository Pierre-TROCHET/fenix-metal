import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { headers } from 'next/headers';

// Fonction pour envoyer un email (simulation - à remplacer par un vrai service)
async function sendEmail(to: string, subject: string, message: string, from: string) {
  // Pour l'instant, on simule l'envoi d'email
  // Dans un vrai projet, vous utiliseriez un service comme SendGrid, Resend, ou Nodemailer
  console.log('📧 Email envoyé:');
  console.log(`À: ${to}`);
  console.log(`De: ${from}`);
  console.log(`Sujet: ${subject}`);
  console.log(`Message: ${message}`);
  
  // Simulation d'un délai d'envoi
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return { success: true };
}

// Fonction pour valider l'email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Fonction pour valider le téléphone (optionnel)
function isValidPhone(phone: string | null): boolean {
  if (!phone) return true; // Téléphone optionnel
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
}

// Fonction pour détecter les bots (protection basique)
function isBotRequest(userAgent: string | null, ipAddress: string | null): boolean {
  if (!userAgent) return true;
  
  const botPatterns = [
    'bot', 'crawler', 'spider', 'scraper', 'curl', 'wget', 'python', 'java'
  ];
  
  const userAgentLower = userAgent.toLowerCase();
  return botPatterns.some(pattern => userAgentLower.includes(pattern));
}

export async function POST(request: NextRequest) {
  try {
    const headersList = await headers();
    const userAgent = headersList.get('user-agent');
    const ipAddress = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';

    // Protection anti-bot
    if (isBotRequest(userAgent, ipAddress)) {
      return NextResponse.json(
        { error: 'Requête non autorisée' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { nom, email, telephone, sujet, message, csrfToken } = body;

    // Validation des champs requis
    if (!nom || !email || !sujet || !message) {
      return NextResponse.json(
        { error: 'Tous les champs obligatoires doivent être remplis' },
        { status: 400 }
      );
    }

    // Validation de la longueur des champs
    if (nom.length < 2 || nom.length > 100) {
      return NextResponse.json(
        { error: 'Le nom doit contenir entre 2 et 100 caractères' },
        { status: 400 }
      );
    }

    if (sujet.length < 5 || sujet.length > 200) {
      return NextResponse.json(
        { error: 'Le sujet doit contenir entre 5 et 200 caractères' },
        { status: 400 }
      );
    }

    if (message.length < 10 || message.length > 2000) {
      return NextResponse.json(
        { error: 'Le message doit contenir entre 10 et 2000 caractères' },
        { status: 400 }
      );
    }

    // Validation de l'email
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Adresse email invalide' },
        { status: 400 }
      );
    }

    // Validation du téléphone (optionnel)
    if (telephone && !isValidPhone(telephone)) {
      return NextResponse.json(
        { error: 'Numéro de téléphone invalide' },
        { status: 400 }
      );
    }

    // Protection CSRF basique (vérification que le token est présent)
    if (!csrfToken) {
      return NextResponse.json(
        { error: 'Token de sécurité manquant' },
        { status: 400 }
      );
    }

    // Sauvegarder en base de données
    const contact = await (prisma as any).contact.create({
      data: {
        nom: nom.trim(),
        email: email.trim().toLowerCase(),
        telephone: telephone?.trim() || null,
        sujet: sujet.trim(),
        message: message.trim(),
        ipAddress,
        userAgent,
      },
    });

    // Récupérer l'email de destination depuis la configuration
    const emailConfig = await (prisma as any).emailConfig.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });

    if (!emailConfig) {
      // Si aucun email configuré, on sauvegarde quand même le contact
      console.warn('⚠️ Aucun email de destination configuré');
      return NextResponse.json(
        { 
          success: true, 
          message: 'Votre message a été enregistré. Nous vous contacterons bientôt.',
          contactId: contact.id 
        },
        { status: 200 }
      );
    }

    // Préparer l'email
    const emailSubject = `Nouveau message de contact - ${sujet}`;
    const emailMessage = `
Nouveau message de contact reçu sur le site Fenix-metal :

Nom: ${nom}
Email: ${email}
Téléphone: ${telephone || 'Non renseigné'}
Sujet: ${sujet}

Message:
${message}

---
Message envoyé le ${new Date().toLocaleString('fr-FR')}
IP: ${ipAddress}
ID du contact: ${contact.id}
    `.trim();

    // Envoyer l'email
    const emailResult = await sendEmail(
      emailConfig.email,
      emailSubject,
      emailMessage,
      email
    );

    if (emailResult.success) {
      return NextResponse.json(
        { 
          success: true, 
          message: 'Votre message a été envoyé avec succès. Nous vous contacterons bientôt.',
          contactId: contact.id 
        },
        { status: 200 }
      );
    } else {
      // Si l'email échoue, on sauvegarde quand même le contact
      console.error('❌ Échec de l\'envoi de l\'email');
      return NextResponse.json(
        { 
          success: true, 
          message: 'Votre message a été enregistré. Nous vous contacterons bientôt.',
          contactId: contact.id 
        },
        { status: 200 }
      );
    }

  } catch (error) {
    console.error('❌ Erreur lors du traitement du formulaire de contact:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue. Veuillez réessayer plus tard.' },
      { status: 500 }
    );
  }
}
