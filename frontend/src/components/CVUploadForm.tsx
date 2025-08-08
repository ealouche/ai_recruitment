import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Upload, CheckCircle, AlertCircle, FileText } from 'lucide-react'
import { apiService } from '../services/api'
import type { FormField, FormConfig, FormData } from '../types/form'
import CVPreview from './CVPreview'
import DynamicFormFields from './DynamicFormFields'

const CVUploadForm = () => {
  const [formConfig, setFormConfig] = useState<FormConfig | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

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

  if (uploadSuccess) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Upload réussi !
        </h3>
        <p className="text-gray-600 mb-4">
          Votre CV et vos informations ont été enregistrés avec succès.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          ID de référence: <code className="bg-gray-100 px-2 py-1 rounded">{uploadSuccess}</code>
        </p>
        <button
          onClick={() => {
            setUploadSuccess(null)
            setError(null)
          }}
          className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors"
        >
          Nouvelle candidature
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
        
        {/* Upload de fichier */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CV (PDF) *
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              id="cv-upload"
            />
            <label htmlFor="cv-upload" className="cursor-pointer">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
              <p className="text-gray-600">
                Cliquez pour sélectionner votre CV ou glissez-déposez
              </p>
              <p className="text-sm text-gray-500 mt-1">
                PDF uniquement, max 5MB
              </p>
            </label>
          </div>
          
          {selectedFile && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md flex items-center">
              <FileText className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-green-800 text-sm">
                {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
          )}
        </div>

        {/* Aperçu du CV */}
        {selectedFile && (
          <CVPreview file={selectedFile} />
        )}

        {/* Champs dynamiques du formulaire */}
        <DynamicFormFields
          fields={formConfig.fields}
          register={register}
          errors={errors}
          watch={watchedValues}
          setValue={setValue}
        />

        {/* Messages d'erreur */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-red-800 text-sm">{error}</span>
          </div>
        )}

        {/* Bouton de soumission */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={uploading || !selectedFile}
            className="w-full bg-primary-600 text-white py-3 px-4 rounded-md hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {uploading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Upload en cours...
              </div>
            ) : (
              'Soumettre ma candidature'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CVUploadForm 