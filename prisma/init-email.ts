import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('📧 Initialisation de la configuration email...');

  // Vérifier si une configuration email existe déjà
  const existingConfig = await prisma.emailConfig.findFirst();
  
  if (existingConfig) {
    console.log('✅ Configuration email déjà présente:', existingConfig.email);
    return;
  }

  // Créer la configuration email par défaut
  const emailConfig = await prisma.emailConfig.create({
    data: {
      email: 'contact@fenix-metal.fr', // À remplacer par l'email réel
      isActive: true,
    }
  });

  console.log('✅ Configuration email créée:', emailConfig.email);
  console.log('💡 N\'oubliez pas de remplacer cette adresse par votre vraie adresse email !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors de l\'initialisation:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
