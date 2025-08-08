import { useState, useEffect } from 'react'
import { BarChart3, Upload, Clock, Database } from 'lucide-react'
import { apiService } from '../services/api'
import type { UploadStats } from '../types/form'

const StatsDisplay = () => {
  const [stats, setStats] = useState<UploadStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await apiService.getStats()
        setStats(data)
      } catch (err) {
        console.error('Erreur lors du chargement des statistiques:', err)
        setError('Impossible de charger les statistiques')
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-2 text-gray-600">Chargement des statistiques...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">⚠️</div>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center mb-6">
          <BarChart3 className="h-6 w-6 text-primary-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">
            Statistiques d'Upload
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Nombre total d'uploads */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6">
            <div className="flex items-center">
              <Upload className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Total des uploads
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {stats.total_uploads}
                </p>
              </div>
            </div>
          </div>

          {/* Backend de stockage */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6">
            <div className="flex items-center">
              <Database className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-green-900">
                  Backend de stockage
                </p>
                <p className="text-lg font-semibold text-green-900 capitalize">
                  {stats.storage_backend.replace('StorageBackend', '').replace('Backend', '')}
                </p>
              </div>
            </div>
          </div>

          {/* Dernière mise à jour */}
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-purple-900">
                  Dernière mise à jour
                </p>
                <p className="text-sm font-semibold text-purple-900">
                  {formatTimestamp(stats.timestamp)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Informations système */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Informations système
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-600">Architecture:</span>
            <span className="text-sm text-gray-900">Backend Schema-less FastAPI</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-600">Frontend:</span>
            <span className="text-sm text-gray-900">React + Vite + TypeScript</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-600">Formulaire:</span>
            <span className="text-sm text-gray-900">Dynamique et configurable</span>
          </div>
          
          <div className="flex justify-between items-center py-2">
            <span className="text-sm font-medium text-gray-600">Validation:</span>
            <span className="text-sm text-gray-900">RGPD + Format PDF + Taille</span>
          </div>
        </div>
      </div>

      {/* Note explicative */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">
          💡 Architecture Schema-less
        </h4>
        <p className="text-sm text-blue-800">
          Ce système accepte dynamiquement n'importe quelle configuration de formulaire côté frontend 
          sans nécessiter de modifications du code backend. Les validations sont génériques et 
          s'adaptent automatiquement aux champs présents.
        </p>
      </div>
    </div>
  )
}

export default StatsDisplay 