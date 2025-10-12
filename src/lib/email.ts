import nodemailer from 'nodemailer';

export interface EmailData {
  to: string;
  from: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, from, subject, html, text }: EmailData) {
  try {
    console.log('📧 Tentative d\'envoi d\'email via Nodemailer...');
    console.log(`À: ${to}`);
    console.log(`De: ${from}`);
    console.log(`Sujet: ${subject}`);
    console.log(`SMTP_HOST configuré: ${!!process.env.SMTP_HOST}`);
    console.log(`SMTP_PORT configuré: ${!!process.env.SMTP_PORT}`);
    console.log(`SMTP_USER configuré: ${!!process.env.SMTP_USER}`);
    console.log(`SMTP_PASS configuré: ${!!process.env.SMTP_PASS}`);

    if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('⚠️ Variables SMTP non configurées, simulation de l\'envoi d\'email');
      console.log('📧 Email simulé:');
      console.log(`Contenu: ${text || html}`);
      return { success: true, id: 'simulated-' + Date.now() };
    }

    // Configuration du transporteur SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_PORT === '465', // true pour 465, false pour autres ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Configuration de l'email
    const mailOptions = {
      from: from,
      to: to,
      subject: subject,
      html: html,
      text: text || html,
    };

    // Envoi de l'email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email envoyé avec succès via Nodemailer:', info.messageId);
    return { success: true, id: info.messageId };
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email via Nodemailer:', error);
    
    // Gestion spécifique des erreurs SMTP
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();
      
      if (errorMessage.includes('550') || errorMessage.includes('does not exist')) {
        return { 
          success: false, 
          error: 'Adresse email introuvable. Vérifiez que l\'adresse email du destinataire est correcte.' 
        };
      }
      
      if (errorMessage.includes('553') || errorMessage.includes('mailbox unavailable')) {
        return { 
          success: false, 
          error: 'Boîte mail indisponible. Le destinataire ne peut pas recevoir d\'emails.' 
        };
      }
      
      if (errorMessage.includes('554') || errorMessage.includes('rejected')) {
        return { 
          success: false, 
          error: 'Email rejeté par le serveur de destination.' 
        };
      }
      
      if (errorMessage.includes('authentication') || errorMessage.includes('login')) {
        return { 
          success: false, 
          error: 'Erreur d\'authentification SMTP. Vérifiez vos identifiants.' 
        };
      }
    }
    
    return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue lors de l\'envoi' };
  }
}

export function generateContactEmailHTML(contactData: {
  nom: string;
  email: string;
  telephone?: string;
  sujet: string;
  message: string;
  ipAddress: string;
  contactId: number;
}) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Nouveau message de contact</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1a1a1a; color: #fff; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #555; }
        .value { margin-top: 5px; }
        .message-box { background: #fff; padding: 15px; border-left: 4px solid #ff6b35; margin: 15px 0; }
        .footer { background: #333; color: #fff; padding: 15px; text-align: center; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔨 Phenix Ferronnerie</h1>
          <h2>Nouveau message de contact</h2>
        </div>
        
        <div class="content">
          <div class="field">
            <div class="label">👤 Nom:</div>
            <div class="value">${contactData.nom}</div>
          </div>
          
          <div class="field">
            <div class="label">📧 Email:</div>
            <div class="value"><a href="mailto:${contactData.email}">${contactData.email}</a></div>
          </div>
          
          ${contactData.telephone ? `
          <div class="field">
            <div class="label">📞 Téléphone:</div>
            <div class="value"><a href="tel:${contactData.telephone}">${contactData.telephone}</a></div>
          </div>
          ` : ''}
          
          <div class="field">
            <div class="label">📝 Sujet:</div>
            <div class="value">${contactData.sujet}</div>
          </div>
          
          <div class="field">
            <div class="label">💬 Message:</div>
            <div class="message-box">${contactData.message.replace(/\n/g, '<br>')}</div>
          </div>
        </div>
        
        <div class="footer">
          <p>Message reçu le ${new Date().toLocaleString('fr-FR')}</p>
          <p>IP: ${contactData.ipAddress} | ID: ${contactData.contactId}</p>
          <p>Envoyé depuis le site web Phenix Ferronnerie</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function generateContactEmailText(contactData: {
  nom: string;
  email: string;
  telephone?: string;
  sujet: string;
  message: string;
  ipAddress: string;
  contactId: number;
}) {
  return `
NOUVEAU MESSAGE DE CONTACT - Phenix Ferronnerie

Nom: ${contactData.nom}
Email: ${contactData.email}
${contactData.telephone ? `Téléphone: ${contactData.telephone}` : ''}
Sujet: ${contactData.sujet}

Message:
${contactData.message}

---
Message reçu le ${new Date().toLocaleString('fr-FR')}
IP: ${contactData.ipAddress}
ID du contact: ${contactData.contactId}
Envoyé depuis le site web Phenix Ferronnerie
  `.trim();
}
