import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Grouper les images par préfixe - ART
  const artImageGroups = {
    'balance': {
      images: ['balance-1.JPG', 'balance-2.JPG'],
      title: 'La Balance de la Justice',
      description: 'Sculpture en fer forgé représentant la balance de la justice, symbole d\'équilibre et de vérité. Pièce unique créée au feu de forge avec une attention particulière portée aux détails et à la symétrie.'
    },
    'aigle': {
      images: ['aigle-1.jpg', 'aigle-2.JPG', 'aigle-3.JPG'],
      title: 'L\'Aigle Royal',
      description: 'Majestueuse sculpture d\'aigle royal en fer forgé, capturant la puissance et la grâce de ce rapace légendaire. Chaque plume est méticuleusement travaillée pour créer un effet de mouvement et de réalisme.'
    },
    'homme-ange': {
      images: ['homme-ange-1.JPG', 'homme-ange-2.jpg', 'homme-ange-3.jpg', 'homme-ange-4.jpg', 'homme-ange-5.jpg'],
      title: 'L\'Homme-Ange',
      description: 'Série de sculptures explorant la dualité entre l\'humain et le divin. Chaque pièce représente une étape de cette transformation spirituelle, créée avec des techniques traditionnelles de forge.'
    },
    'rose': {
      images: ['rose.JPG', 'roses-petites.JPG'],
      title: 'Les Roses de Fer',
      description: 'Délicates roses en fer forgé, alliant la fragilité apparente de la fleur à la solidité du métal. Un contraste poétique entre la nature éphémère et la permanence de l\'art.'
    },
    'coeur_aile': {
      images: ['coeur_aile.jpeg'],
      title: 'Cœur Ailé',
      description: 'Sculpture symbolique représentant un cœur ailé, fusion de l\'amour terrestre et de l\'élévation spirituelle. Pièce unique créée avec des techniques de forge traditionnelles.'
    },
    'arbre-des-reves': {
      images: ['arbre-des-reves.jpg'],
      title: 'L\'Arbre des Rêves',
      description: 'Arbre métallique aux branches entrelacées, symbolisant la croissance des aspirations et la force des racines. Chaque branche raconte une histoire, chaque feuille porte un espoir.'
    },
    'ange': {
      images: ['ange.JPG'],
      title: 'L\'Ange Gardien',
      description: 'Sculpture d\'ange protecteur en fer forgé, créée avec une attention particulière aux détails des ailes et de l\'expression. Une présence bienveillante qui veille et protège.'
    },
    'velo': {
      images: ['velo.JPG'],
      title: 'Le Vélo de Fer',
      description: 'Vélo entièrement réalisé en fer forgé, mélange audacieux entre mobilité et solidité. Une pièce unique qui défie les conventions et célèbre l\'ingéniosité humaine.'
    },
    'guitare': {
      images: ['guitare.JPG'],
      title: 'La Guitare Métallique',
      description: 'Guitare sculpturale en fer forgé, fusion parfaite entre musique et métal. Chaque corde, chaque détail est méticuleusement travaillé pour créer une œuvre d\'art sonore et visuelle.'
    },
    'mie-doree': {
      images: ['mie-doree.JPG'],
      title: 'La Mie Dorée',
      description: 'Sculpture abstraite en fer forgé évoquant la chaleur et la douceur du pain frais. Les courbes organiques du métal créent un contraste saisissant avec la rigidité apparente du fer.'
    }
  };

  // Grouper les images par préfixe - AMENAGEMENT
  const amenagementImageGroups = {
    'barreaux-fenetres': {
      images: ['barreaux-fenetres-1.jpeg', 'barreaux-fenetres-2.jpeg'],
      title: 'Barreaux de Fenêtres',
      description: 'Barreaux de sécurité élégants pour fenêtres, alliant protection et esthétique. Réalisés en fer forgé avec des motifs traditionnels qui s\'intègrent parfaitement à l\'architecture existante.'
    },
    'berceau': {
      images: ['berceau.JPG'],
      title: 'Berceau Métallique',
      description: 'Berceau décoratif en fer forgé, parfait pour agrémenter un jardin ou une terrasse. Design épuré et moderne qui apporte une touche d\'élégance à l\'espace extérieur.'
    },
    'escalier-exterieur': {
      images: ['escalier-exterieur-1.jpeg', 'escalier-exterieur-2.jpeg'],
      title: 'Escalier Extérieur',
      description: 'Escalier extérieur en fer forgé avec garde-corps intégré. Conçu pour résister aux intempéries tout en conservant un design raffiné et une sécurité optimale.'
    },
    'escalier': {
      images: ['escalier.jpg'],
      title: 'Escalier Principal',
      description: 'Escalier principal avec rampe en fer forgé, alliant fonctionnalité et esthétique. Chaque marche et chaque barreau sont travaillés avec précision pour créer un ensemble harmonieux.'
    },
    'garde-du-corps-interieur': {
      images: ['garde-du-corps-interieur-gris-1.jpeg', 'garde-du-corps-interieur-gris-2.jpeg', 'garde-du-corps-interieur-gris-3.jpeg'],
      title: 'Garde-corps Intérieur',
      description: 'Garde-corps intérieur moderne en fer forgé, finition grise élégante. Parfait pour sécuriser les escaliers et mezzanines tout en conservant la luminosité et l\'ouverture de l\'espace.'
    },
    'grillage-fenetre': {
      images: ['grillage-fenetre.JPG'],
      title: 'Grillage de Fenêtre',
      description: 'Grillage décoratif pour fenêtre en fer forgé, combinant sécurité et esthétique. Motifs géométriques qui filtrent la lumière tout en protégeant l\'intimité.'
    },
    'marquise-et-porte': {
      images: ['marquise-et-porte-et-barreaux-fenetre-verts-1.jpg', 'marquise-et-porte-et-barreaux-fenetre-verts-2.jpg', 'marquise-et-porte-et-barreaux-fenetre-verts-3.jpg'],
      title: 'Marquise et Porte avec Barreaux',
      description: 'Ensemble complet marquise, porte et barreaux de fenêtre en finition verte. Solution complète qui unifie l\'apparence de la façade tout en apportant protection et style.'
    },
    'marquises': {
      images: ['marquises-1.jpeg', 'marquises-2.jpeg'],
      title: 'Marquises de Protection',
      description: 'Marquises en fer forgé pour protéger l\'entrée des intempéries. Design épuré et moderne qui s\'intègre parfaitement à l\'architecture contemporaine.'
    },
    'portail-blanc': {
      images: ['portail-blanc.JPG'],
      title: 'Portail Blanc',
      description: 'Portail élégant en fer forgé avec finition blanche. Design classique et intemporel qui apporte une touche de raffinement à l\'entrée de propriété.'
    },
    'portail-coulissant-noir': {
      images: ['portail-coulissant-noir-1.jpg', 'portail-coulissant-noir-2.jpg', 'portail-coulissant-noir-3.jpg'],
      title: 'Portail Coulissant Noir',
      description: 'Portail coulissant moderne en fer forgé, finition noire sophistiquée. Système d\'ouverture fluide et sécurisé, parfait pour les entrées de garage ou de cour.'
    },
    'portail-coulissant': {
      images: ['portail-coullissant.jpeg'],
      title: 'Portail Coulissant Classique',
      description: 'Portail coulissant traditionnel en fer forgé. Mécanisme robuste et fiable, design classique qui s\'adapte à tous les styles architecturaux.'
    },
    'portail-kaki': {
      images: ['portail-kaki-2.JPG', 'portail-kaki.JPG'],
      title: 'Portail Kaki',
      description: 'Portail en fer forgé avec finition kaki, couleur discrète et élégante. Parfait pour s\'intégrer harmonieusement dans un environnement naturel.'
    },
    'portail-noir': {
      images: ['portail-noir-1.JPG', 'portail-noir-2.JPG'],
      title: 'Portail Noir',
      description: 'Portail imposant en fer forgé, finition noire moderne. Design contemporain qui allie sécurité et esthétique pour une entrée de propriété remarquable.'
    },
    'portail-vert': {
      images: ['portail-vert-fonce.JPG', 'portail-vert.JPG'],
      title: 'Portail Vert',
      description: 'Portail en fer forgé avec finition verte, couleur naturelle et apaisante. S\'intègre parfaitement dans un environnement paysager ou urbain.'
    },
    'porte-interieur': {
      images: ['porte-interieur-1.jpg', 'porte-interieur-2.jpg', 'porte-interieur-3.jpg'],
      title: 'Portes Intérieures',
      description: 'Portes intérieures en fer forgé avec vitrage décoratif. Allient intimité et luminosité, parfaites pour séparer les espaces tout en conservant la transparence.'
    },
    'porte-jardin': {
      images: ['porte-jardin-1.jpg', 'porte-jardin-2.jpg', 'porte-jardin-3.jpg'],
      title: 'Portes de Jardin',
      description: 'Portes de jardin en fer forgé, design rustique et charmant. Parfaites pour délimiter les espaces extérieurs tout en conservant la vue sur le jardin.'
    },
    'rembarde': {
      images: ['rembarde-1.jpeg', 'rembarde-2.jpeg'],
      title: 'Rembardes de Sécurité',
      description: 'Rembardes de sécurité en fer forgé pour balcons et terrasses. Allient protection et esthétique avec des motifs traditionnels élégants.'
    },
    'rembarde-balcon': {
      images: ['rembarde-balcon.JPG'],
      title: 'Rembarde de Balcon',
      description: 'Rembarde de balcon en fer forgé, design moderne et épuré. Sécurise l\'espace tout en conservant la vue panoramique et la luminosité.'
    },
    'rembarde-escalier': {
      images: ['rembarde-escalier-et-garde-du-corps-1.jpeg', 'rembarde-escalier-et-garde-du-corps-2.jpeg', 'rembarde-escalier-et-garde-du-corps-3.jpeg'],
      title: 'Rembarde d\'Escalier avec Garde-corps',
      description: 'Ensemble rembarde et garde-corps d\'escalier en fer forgé. Sécurité optimale avec un design harmonieux qui suit les courbes de l\'escalier.'
    },
    'rembarde-escalier-interieur': {
      images: ['rembarde-escalier-interieur-1.JPG', 'rembarde-escalier-interieur-2.JPG', 'rembarde-escalier-interieur-3.JPG', 'rembarde-escalier-interieur-4.JPG'],
      title: 'Rembardes d\'Escalier Intérieur',
      description: 'Rembardes d\'escalier intérieur en fer forgé, finition raffinée. Sécurisent les escaliers tout en conservant l\'élégance et la luminosité de l\'espace.'
    },
    'rembarde-etage': {
      images: ['rembarde-etage-1.jpg', 'rembarde-etage-2.jpg'],
      title: 'Rembardes d\'Étage',
      description: 'Rembardes d\'étage en fer forgé, design contemporain et sécurisé. Parfaites pour les mezzanines et les espaces surélevés.'
    },
    'rembarde-interieur': {
      images: ['rembarde-interieur-1.JPG', 'rembarde-interieur-2.JPG', 'rembarde-interieur-3.JPG', 'rembarde-interieur-4.JPG', 'rembarde-interieur-5.JPG'],
      title: 'Rembardes Intérieures',
      description: 'Rembardes intérieures en fer forgé, motifs variés et élégants. Sécurisent les espaces tout en ajoutant une touche décorative raffinée.'
    },
    'rembarde-terrasse': {
      images: ['rembarde-terrasse-1.jpg', 'rembarde-terrasse-2.jpg'],
      title: 'Rembardes de Terrasse',
      description: 'Rembardes de terrasse en fer forgé, résistantes aux intempéries. Design moderne qui sécurise l\'espace extérieur tout en conservant la vue.'
    },
    'repose-main': {
      images: ['repose-main-d-escalier-interieur.jpeg'],
      title: 'Repose-main d\'Escalier',
      description: 'Repose-main d\'escalier intérieur en fer forgé, ergonomie et esthétique. Confort d\'utilisation avec un design raffiné qui s\'intègre parfaitement.'
    },
    'support-plante-murale': {
      images: ['support_plante_murale.JPG'],
      title: 'Support de Plante Murale',
      description: 'Support de plante murale en fer forgé, design élégant et fonctionnel. Parfait pour suspendre des jardinières et créer un jardin vertical.'
    },
    'support-plante-grimpante': {
      images: ['support-plante-grimpante-exterieure.jpeg'],
      title: 'Support de Plante Grimpante',
      description: 'Support de plante grimpante extérieur en fer forgé. Structure robuste qui guide et supporte les plantes grimpantes pour créer un mur végétal naturel.'
    },
    'support-pots': {
      images: ['support-pots-de-fleurs.jpeg'],
      title: 'Support de Pots de Fleurs',
      description: 'Support de pots de fleurs en fer forgé, design créatif et fonctionnel. Élève les plantes pour créer des compositions florales attrayantes.'
    },
    'tables-interieures': {
      images: ['tables-interieures-serie-1.jpg', 'tables-interieures-serie-2.jpg', 'tables-interieures-serie-3.jpg'],
      title: 'Tables Intérieures',
      description: 'Série de tables intérieures en fer forgé, design moderne et fonctionnel. Parfaites pour agrémenter l\'espace intérieur avec style et élégance.'
    }
  };

  // Insérer chaque groupe d'images ART
  for (const [prefix, data] of Object.entries(artImageGroups).reverse()) {
    try {
      const artwork = await prisma.artwork.create({
        data: {
          titre: data.title,
          description: data.description,
          category: 'art',
          images: data.images, // Les images sont déjà juste les noms de fichiers
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
      console.log(`✅ Créé: ${artwork.titre} avec ${data.images.length} image(s)`);
    } catch (error) {
      console.error(`❌ Erreur lors de la création de ${data.title}:`, error);
    }
  }

  // Insérer chaque groupe d'images AMENAGEMENT
  for (const [prefix, data] of Object.entries(amenagementImageGroups)) {
    try {
      const artwork = await prisma.artwork.create({
        data: {
          titre: data.title,
          description: data.description,
          category: 'amenagement',
          images: data.images, // Les images sont déjà juste les noms de fichiers
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
      console.log(`✅ Créé: ${artwork.titre} avec ${data.images.length} image(s)`);
    } catch (error) {
      console.error(`❌ Erreur lors de la création de ${data.title}:`, error);
    }
  }

  console.log('🎉 Seeding terminé !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
