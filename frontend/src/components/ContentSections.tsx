import React from 'react';
import { 
  Brain, 
  Target, 
  Zap, 
  Shield, 
  Users, 
  TrendingUp, 
  Sparkles
} from 'lucide-react';

const ContentSections: React.FC = () => {
  return (
    <div className="space-y-20">
      
      {/* Why Choose Us Section */}
      <section id="avantages" className="py-16 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Pourquoi choisir AI Recruiting ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez les avantages uniques de notre plateforme alimentée par l'IA
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "IA Avancée",
                description: "Notre algorithme analyse en profondeur vos compétences et votre potentiel pour un matching précis.",
                color: "from-purple-500 to-indigo-500"
              },
              {
                icon: Target,
                title: "Matching Précis",
                description: "95% de taux de satisfaction grâce à notre technologie de correspondance intelligente.",
                color: "from-emerald-500 to-teal-500"
              },
              {
                icon: Zap,
                title: "Processus Rapide",
                description: "Recevez des propositions personnalisées en moins de 24h après le dépôt de votre CV.",
                color: "from-yellow-500 to-orange-500"
              },
              {
                icon: Shield,
                title: "Confidentialité",
                description: "Vos données sont protégées par un chiffrement de niveau bancaire et restent confidentielles.",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: Users,
                title: "Réseau Premium",
                description: "Accédez à un réseau exclusif de 500+ entreprises partenaires de premier plan.",
                color: "from-pink-500 to-rose-500"
              },
              {
                icon: TrendingUp,
                title: "Suivi Carrière",
                description: "Bénéficiez d'un accompagnement personnalisé pour booster votre évolution professionnelle.",
                color: "from-green-500 to-emerald-500"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="process" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Un processus simple et efficace en 4 étapes pour trouver votre emploi idéal
            </p>
          </div>

          <div className="relative">
            {/* Connection line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 transform -translate-y-1/2"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {[
                {
                  step: "01",
                  title: "Déposez votre CV",
                  description: "Uploadez votre CV en quelques clics. Notre IA commence immédiatement l'analyse.",
                  icon: "📄"
                },
                {
                  step: "02", 
                  title: "Analyse intelligente",
                  description: "Notre algorithme analyse vos compétences, expériences et aspirations professionnelles.",
                  icon: "🧠"
                },
                {
                  step: "03",
                  title: "Matching personnalisé",
                  description: "Nous identifions les opportunités qui correspondent parfaitement à votre profil.",
                  icon: "🎯"
                },
                {
                  step: "04",
                  title: "Propositions ciblées",
                  description: "Recevez des offres d'emploi personnalisées et un accompagnement dédié.",
                  icon: "✨"
                }
              ].map((step, index) => (
                <div key={index} className="text-center relative">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full text-white font-bold text-lg mb-6 relative z-10">
                    {step.step}
                  </div>
                  <div className="text-4xl mb-4">{step.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>





    </div>
  );
};

export default ContentSections;
