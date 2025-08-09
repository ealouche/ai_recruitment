import { useState } from 'react'
import Header from './components/Header'
import ContentSections from './components/ContentSections'
import CVUploadForm from './components/CVUploadForm'
import StatsDisplay from './components/StatsDisplay'
import Footer from './components/Footer'

function App() {
  const [showStats, setShowStats] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      {/* Premium Header */}
      <Header />

      {/* Engaging Content Sections */}
      <ContentSections />

      {/* Main Upload Section */}
      <section id="upload" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Déposez votre CV et commencez votre aventure
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Notre IA va analyser votre profil en quelques secondes et vous proposer des opportunités sur mesure
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            {showStats ? (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900">Statistiques de la plateforme</h3>
                  <button
                    onClick={() => setShowStats(false)}
                    className="btn-premium"
                  >
                    Retour au formulaire
                  </button>
                </div>
                <StatsDisplay />
              </div>
            ) : (
              <div className="space-y-8">
                <CVUploadForm />
                <div className="text-center">
                  <button
                    onClick={() => setShowStats(true)}
                    className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors duration-200"
                  >
                    Voir les statistiques de la plateforme →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Success Stories Section - At the very end */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Ils nous font confiance
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez les témoignages de candidats qui ont trouvé leur emploi idéal grâce à notre plateforme
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah M.",
                role: "Développeuse Full-Stack",
                company: "TechCorp",
                testimonial: "Grâce à AI Recruiting, j'ai trouvé le poste de mes rêves en seulement 2 semaines ! Le matching était parfait.",
                rating: 5
              },
              {
                name: "Thomas L.",
                role: "Chef de Projet",
                company: "InnovateNow",
                testimonial: "Une expérience exceptionnelle. L'IA a parfaitement cerné mes aspirations et m'a proposé des opportunités sur mesure.",
                rating: 5
              },
              {
                name: "Marie D.",
                role: "Data Scientist",
                company: "DataFlow",
                testimonial: "Processus fluide et résultats impressionnants. Je recommande vivement cette plateforme innovante !",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.testimonial}"</p>
                <div className="border-t pt-4">
                  <div className="font-bold text-gray-900">{testimonial.name}</div>
                  <div className="text-emerald-600 font-medium">{testimonial.role}</div>
                  <div className="text-gray-500 text-sm">{testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Footer */}
      <Footer />
    </div>
  )
}

export default App 