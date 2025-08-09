/**
 * Configuration simplifiée des textes de l'application
 */

export interface TextConfig {
  // Application
  app: {
    title: string
    subtitle: string
  }

  // Page d'accueil
  home: {
    hero: {
      title: string
      subtitle: string
    }
  }

  // Statistiques
  stats: {
    show: string
    hide: string
  }

  // Fonctionnalités
  features: {
    upload: {
      title: string
      description: string
    }
    ai: {
      title: string
      description: string
    }
    analysis: {
      title: string
      description: string
    }
  }

  // Formulaire d'upload
  upload: {
    dropzone: {
      title: string
      subtitle: string
    }
    submit: string
    success: {
      title: string
      titleWithName: string
      subtitle: string
      description: string
      reference: {
        title: string
      }
      actions: {
        close: string
        home: string
      }
    }
  }

  // Footer
  footer: {
    rights: string
  }
}

export const defaultTexts: TextConfig = {
  app: {
    title: "AI Recruiting",
    subtitle: "Plateforme intelligente de recrutement"
  },

  home: {
    hero: {
      title: "Déposez votre CV et laissez l'IA faire le reste",
      subtitle: "Notre intelligence artificielle analyse votre profil et vous connecte aux meilleures opportunités"
    }
  },

  stats: {
    show: "Voir les statistiques",
    hide: "Masquer les statistiques"
  },

  features: {
    upload: {
      title: "Upload Intelligent",
      description: "Déposez votre CV en quelques secondes avec notre interface intuitive"
    },
    ai: {
      title: "Analyse IA",
      description: "Notre IA analyse votre profil et identifie vos compétences clés"
    },
    analysis: {
      title: "Matching Précis",
      description: "Trouvez les offres qui correspondent parfaitement à votre profil"
    }
  },

  upload: {
    dropzone: {
      title: "Glissez votre CV ici",
      subtitle: "ou cliquez pour sélectionner un fichier PDF"
    },
    submit: "Analyser mon CV",
    success: {
      title: "CV reçu avec succès !",
      titleWithName: "Merci {name}, votre CV a été reçu !",
      subtitle: "Votre candidature est en cours d'analyse",
      description: "Notre équipe va examiner votre profil et vous recontactera rapidement si votre profil correspond à nos opportunités.",
      reference: {
        title: "Numéro de référence :"
      },
      actions: {
        close: "Fermer",
        home: "Retour à l'accueil"
      }
    }
  },

  footer: {
    rights: "Tous droits réservés."
  }
}
