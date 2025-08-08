import { useState } from 'react'
import CVUploadForm from './components/CVUploadForm'
import StatsDisplay from './components/StatsDisplay'

function App() {
  const [showStats, setShowStats] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              AI Recruiting - Upload CV
            </h1>
            <button
              onClick={() => setShowStats(!showStats)}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              {showStats ? 'Retour au formulaire' : 'Voir les statistiques'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showStats ? (
          <StatsDisplay />
        ) : (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Déposez votre candidature
              </h2>
              <p className="text-gray-600">
                Remplissez le formulaire ci-dessous et téléchargez votre CV au format PDF
              </p>
            </div>
            <CVUploadForm />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 text-sm">
            © 2024 AI Recruiting. Formulaire dynamique avec backend schema-less.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App 