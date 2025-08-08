import { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react'

// Configuration du worker PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

interface CVPreviewProps {
  file: File
}

const CVPreview = ({ file }: CVPreviewProps) => {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fileUrl = URL.createObjectURL(file)

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setPageNumber(1)
    setLoading(false)
    setError(null)
  }

  const onDocumentLoadError = (error: Error) => {
    console.error('Erreur de chargement PDF:', error)
    setError('Impossible de charger l\'aperçu du PDF')
    setLoading(false)
  }

  const goToPrevPage = () => {
    setPageNumber(page => Math.max(1, page - 1))
  }

  const goToNextPage = () => {
    setPageNumber(page => Math.min(numPages, page + 1))
  }

  if (!isVisible) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Eye className="h-5 w-5 text-gray-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">
              Aperçu du CV disponible
            </span>
          </div>
          <button
            onClick={() => {
              setIsVisible(true)
              setLoading(true)
            }}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            Afficher l'aperçu
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* En-tête */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Eye className="h-5 w-5 text-gray-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">
              Aperçu du CV
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Navigation des pages */}
            {numPages > 1 && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={goToPrevPage}
                  disabled={pageNumber <= 1}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm text-gray-600">
                  {pageNumber} / {numPages}
                </span>
                <button
                  onClick={goToNextPage}
                  disabled={pageNumber >= numPages}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
            
            {/* Bouton masquer */}
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <EyeOff className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Contenu PDF */}
      <div className="p-4">
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-2 text-gray-600">Chargement de l'aperçu...</span>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <div className="text-red-600 mb-2">⚠️</div>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="flex justify-center">
            <Document
              file={fileUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  <span className="ml-2 text-gray-600">Chargement...</span>
                </div>
              }
            >
              <Page
                pageNumber={pageNumber}
                scale={0.8}
                className="shadow-lg"
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>
          </div>
        )}
      </div>
    </div>
  )
}

export default CVPreview 