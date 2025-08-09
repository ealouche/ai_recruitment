// Configuration dynamique des étapes du processus de candidature
export interface VignetteStep {
  id: number
  title: string
  icon: string
  description: string
  color: {
    primary: string
    secondary: string
    accent: string
  }
  ariaLabel: string
}

export const vignetteSteps: VignetteStep[] = [
  {
    id: 1,
    title: "Upload du CV",
    icon: "📄",
    description: "Déposez votre CV en quelques clics. Notre système accepte tous les formats PDF avec une sécurité maximale.",
    color: {
      primary: "from-emerald-500 to-emerald-600",
      secondary: "from-emerald-50 via-emerald-100 to-teal-100",
      accent: "from-emerald-400 to-teal-400"
    },
    ariaLabel: "Étape 1 sur 4 : Téléchargement de votre CV en format PDF"
  },
  {
    id: 2,
    title: "Analyse IA",
    icon: "🤖",
    description: "Notre IA avancée analyse vos compétences, expériences et qualifications en temps réel.",
    color: {
      primary: "from-emerald-500 to-emerald-600",
      secondary: "from-emerald-50 via-emerald-100 to-teal-100",
      accent: "from-emerald-400 to-teal-400"
    },
    ariaLabel: "Étape 2 sur 4 : Analyse intelligente de votre profil par notre IA"
  },
  {
    id: 3,
    title: "Matching Intelligent",
    icon: "🎯",
    description: "Nous trouvons les opportunités qui correspondent parfaitement à votre profil unique.",
    color: {
      primary: "from-emerald-500 to-emerald-600",
      secondary: "from-emerald-50 via-emerald-100 to-teal-100",
      accent: "from-emerald-400 to-teal-400"
    },
    ariaLabel: "Étape 3 sur 4 : Correspondance intelligente avec les offres d'emploi"
  },
  {
    id: 4,
    title: "Contact Direct",
    icon: "💼",
    description: "Un recruteur expert vous contactera rapidement pour discuter des meilleures opportunités.",
    color: {
      primary: "from-emerald-500 to-emerald-600",
      secondary: "from-emerald-50 via-emerald-100 to-teal-100",
      accent: "from-emerald-400 to-teal-400"
    },
    ariaLabel: "Étape 4 sur 4 : Contact direct avec nos recruteurs experts"
  }
]

// Fonction utilitaire pour obtenir une étape par son ID
export const getStepById = (id: number): VignetteStep | undefined => {
  return vignetteSteps.find(step => step.id === id)
}

// Fonction utilitaire pour obtenir le nombre total d'étapes
export const getTotalSteps = (): number => {
  return vignetteSteps.length
}
