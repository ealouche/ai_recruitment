import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { Upload, CheckCircle, AlertCircle, X } from 'lucide-react'
import { apiService } from '../services/api'
import type { FormConfig, FormData } from '../types/form'
import CVPreview from './CVPreview'
import DynamicFormFields from './DynamicFormFields'

import confetti from 'canvas-confetti'

const CVUploadForm = () => {
  const [formConfig, setFormConfig] = useState<FormConfig | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // Référence pour le scroll automatique vers le formulaire
  const dynamicFormRef = useRef<HTMLDivElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset
  } = useForm<FormData>()

  const watchedValues = watch()

  // Chargement de la configuration du formulaire
  useEffect(() => {
    const loadFormConfig = async () => {
      try {
        const config = await apiService.getFormConfig()
        setFormConfig(config)
      } catch (err) {
        console.error('Erreur lors du chargement de la configuration:', err)
        setError('Impossible de charger la configuration du formulaire')
      }
    }

    loadFormConfig()
  }, [])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validation côté client
      if (file.size > 5 * 1024 * 1024) { // 5MB
        setError('Le fichier ne doit pas dépasser 5MB')
        return
      }
      
      if (file.type !== 'application/pdf') {
        setError('Seuls les fichiers PDF sont acceptés')
        return
      }

      setSelectedFile(file)
      setError(null)
      
      // Scroll automatique vers le formulaire dynamique après upload
      setTimeout(() => {
        if (dynamicFormRef.current) {
          dynamicFormRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          })
        }
      }, 100)
    }
  }

  const validateRGPDConsent = (data: FormData): boolean => {
    // Recherche dynamique du champ de consentement RGPD
    const rgpdFields = ['rgpd_consent', 'consent_rgpd', 'consentement_rgpd', 'gdpr_consent']
    
    for (const field of rgpdFields) {
      if (data[field] === true) {
        return true
      }
    }
    return false
  }

  const onSubmit = async (data: FormData) => {
    if (!selectedFile) {
      setError('Veuillez sélectionner un fichier CV')
      return
    }

    if (!validateRGPDConsent(data)) {
      setError('Le consentement RGPD est obligatoire')
      return
    }

    setUploading(true)
    setError(null)

    try {
      const response = await apiService.uploadCV(selectedFile, data)
      setUploadSuccess(response.upload_id)
      
      // Animation confetti lors du succès
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
      
      reset()
      setSelectedFile(null)
    } catch (err: any) {
      console.error('Erreur upload:', err)
      
      if (err.response?.data?.detail) {
        if (typeof err.response.data.detail === 'object' && err.response.data.detail.errors) {
          // Erreurs de validation détaillées
          const errorMessages = err.response.data.detail.errors
            .map((e: any) => `${e.field}: ${e.message}`)
            .join(', ')
          setError(`Erreurs de validation: ${errorMessages}`)
        } else {
          setError(err.response.data.detail)
        }
      } else {
        setError('Erreur lors de l\'upload. Veuillez réessayer.')
      }
    } finally {
      setUploading(false)
    }
  }

  if (!formConfig) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-2 text-gray-600">Chargement du formulaire...</span>
      </div>
    )
  }

  // Page de confirmation premium avec message chaleureux et animations apaisantes
  if (uploadSuccess) {
    return (
      <>
        {/* Overlay premium avec animations d'ambiance */}
        <div className="fixed inset-0 bg-gradient-to-br from-emerald-900/20 via-black/60 to-turquoise-900/20 flex items-center justify-center z-50 animate-fadeIn">
          {/* Animations d'ambiance apaisantes en arrière-plan */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-emerald-400/20 rounded-full soothing-wave"></div>
            <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-turquoise-400/20 rounded-full soothing-wave" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-emerald-300/15 rounded-full reassuring-pulse" style={{animationDelay: '2s'}}></div>
          </div>
          
          <div className="card-premium max-w-2xl mx-4 relative z-10 text-center">
            {/* Bouton de fermeture premium */}
            <button
              onClick={() => {
                setUploadSuccess(null)
                setError(null)
              }}
              className="absolute top-6 right-6 text-gray-400 hover:text-emerald-600 transition-all duration-300 hover:scale-110 z-20 p-2 rounded-full hover:bg-emerald-50"
            >
              <X className="h-6 w-6" />
            </button>
            
            {/* Contenu chaleureux et humanisé */}
            <div className="pt-4">
              {/* Icône animée rassurante */}
              <div className="relative mb-8">
                <CheckCircle className="mx-auto h-20 w-20 text-emerald-600 drop-shadow-lg" />
                <div className="absolute inset-0 sparkle-glow text-4xl flex items-center justify-center">✨</div>
                <div className="absolute -top-2 -right-2 confetti-float text-2xl">🎉</div>
              </div>
              
              <h3 className="text-premium-bold text-4xl text-gray-800 mb-6">
                Merci, votre candidature précieuse est bien prise en compte ! 🌟
              </h3>
              
              <div className="bg-gradient-to-r from-emerald-50 to-turquoise-50 rounded-2xl p-6 mb-8">
                <p className="text-premium text-xl text-gray-700 mb-4 leading-relaxed">
                  Notre équipe la traite avec attention et vous recontactera rapidement.
                </p>
                <p className="text-premium text-emerald-700 font-medium">
                  Nous analysons votre profil avec notre IA avancée pour vous proposer les meilleures opportunités.
                </p>
              </div>
              
              {/* ID de référence stylisé */}
              <div className="bg-white border border-emerald-200 rounded-xl p-4 mb-8 inline-block">
                <p className="text-premium text-sm text-gray-600 mb-1">ID de référence :</p>
                <code className="text-premium-bold bg-emerald-100 text-emerald-800 px-4 py-2 rounded-lg font-mono text-lg">
                  {uploadSuccess}
                </code>
              </div>
              
              {/* Call to actions premium */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    setUploadSuccess(null)
                    setError(null)
                  }}
                  className="px-8 py-4 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-all duration-300 font-medium hover:scale-[1.02] text-premium"
                >
                  Fermer
                </button>
                <button
                  onClick={() => {
                    setUploadSuccess(null)
                    setError(null)
                    setSelectedFile(null)
                    reset()
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="btn-premium px-10 py-4 text-premium-bold hover:scale-[1.02] active:scale-[0.98]"
                >
                  🏠 Retour à l'accueil
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="card-premium section-premium">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Layout adaptatif : Zone de dépôt + Vignette PDF dynamique */}
        <div className={`transition-all duration-500 ease-in-out ${selectedFile ? 'flex gap-6 items-start' : 'flex justify-center'}`}>
          {/* Zone de dépôt avec design system vert émeraude/turquoise - 70% */}
          <div className={`transition-all duration-500 ease-in-out ${selectedFile ? 'w-[70%]' : 'w-full max-w-2xl'}`}>
            <div 
              className={`drop-zone-premium rounded-2xl text-center flex flex-col justify-center relative h-56 p-8 ${
                selectedFile 
                  ? 'file-dropped' 
                  : ''
              }`}
              onDragOver={(e) => {
                e.preventDefault()
                e.currentTarget.classList.add('drag-over')
              }}
              onDragLeave={(e) => {
                e.preventDefault()
                e.currentTarget.classList.remove('drag-over')
              }}
              onDrop={(e) => {
                e.preventDefault()
                e.currentTarget.classList.remove('drag-over')
                e.currentTarget.classList.add('file-dropped')
                // Retirer la classe après l'animation
                setTimeout(() => {
                  e.currentTarget.classList.remove('file-dropped')
                }, 600)
              }}
            >
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="cv-upload"
              />
              <label htmlFor="cv-upload" className="cursor-pointer relative z-10">
                {selectedFile ? (
                  <>
                    <div className="relative">
                      <CheckCircle className="mx-auto h-16 w-16 text-emerald-600 mb-4" />
                      <div className="absolute inset-0 sparkle-glow">✨</div>
                    </div>
                    <h3 className="text-premium-bold text-2xl text-gray-800 mb-3">
                      🎉 CV sélectionné avec succès !
                    </h3>
                    <p className="text-premium text-emerald-700 font-medium mb-2">
                      Cliquez pour changer de fichier
                    </p>
                    <p className="text-premium text-sm text-gray-600 bg-emerald-50 px-4 py-2 rounded-lg inline-block">
                      📄 {selectedFile.name}
                    </p>
                  </>
                ) : (
                  <>
                    <Upload className="mx-auto h-16 w-16 text-emerald-500 mb-6 transition-all duration-300 hover:scale-110" />
                    <h3 className="text-premium-bold text-2xl text-gray-800 mb-3">
                      Glissez-déposez votre CV ici
                    </h3>
                    <p className="text-premium text-lg text-gray-600 mb-2">
                      ou cliquez pour sélectionner un fichier
                    </p>
                    <p className="text-premium text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg inline-block">
                      📄 PDF uniquement • Max 10MB
                    </p>
                  </>
                )}
              </label>
              
              {/* Effet de fond animé premium */}
              {!selectedFile && (
                <div className="absolute inset-0 soothing-wave opacity-30">
                  <div className="w-full h-full bg-gradient-to-r from-emerald-100/30 to-turquoise-100/30 rounded-2xl"></div>
                </div>
              )}
              
              {/* Particules de confettis après upload */}
              {selectedFile && (
                <div className="absolute top-4 right-4">
                  <div className="confetti-float text-2xl">🎉</div>
                </div>
              )}
            </div>
          </div>
          
          {/* Vignette PDF dynamique - 30% */}
          {selectedFile && (
            <div className="transition-all duration-500 ease-in-out w-[30%] animate-fadeIn">
              <CVPreview file={selectedFile} />
            </div>
          )}
        </div>
        


        {/* Champs dynamiques du formulaire */}
        <div ref={dynamicFormRef}>
          <DynamicFormFields
            fields={formConfig.fields}
            register={register}
            errors={errors}
            watch={watchedValues}
            setValue={setValue}
          />
        </div>

        {/* Messages d'erreur premium */}
        {error && (
          <div className="message-error flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
            <span className="text-premium font-medium">{error}</span>
          </div>
        )}

        {/* Bouton de soumission premium */}
        <div className="pt-8">
          <button
            type="submit"
            disabled={uploading || !selectedFile}
            className={`w-full py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-300 ${
              uploading || !selectedFile
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'
                : 'btn-premium text-premium-bold hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {uploading ? (
              <div className="flex items-center justify-center">
                <div className="progress-flow w-6 h-6 rounded-full mr-3 opacity-80"></div>
                <span className="text-premium-bold animate-pulse">Envoi en cours...</span>
              </div>
            ) : (
              <span className="flex items-center justify-center text-premium-bold">
                🚀 Soumettre ma candidature
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CVUploadForm 