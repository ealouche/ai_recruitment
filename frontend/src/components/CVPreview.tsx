import { useState, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { FileText } from 'lucide-react'

// Configuration du worker PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

interface CVPreviewProps {
  file: File
}

const CVPreview = ({ file }: CVPreviewProps) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [fileUrl, setFileUrl] = useState<string>('')

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file)
      setFileUrl(url)
      setLoading(true)
      setError(null)
      
      // Cleanup function
      return () => {
        URL.revokeObjectURL(url)
      }
    }
  }, [file])

  const onDocumentLoadSuccess = () => {
    console.log('PDF chargé avec succès')
    setLoading(false)
    setError(null)
  }

  const onDocumentLoadError = (error: Error) => {
    console.error('Erreur de chargement PDF:', error)
    setError('Impossible de charger l\'aperçu')
    setLoading(false)
  }

  if (!file) {
    return null
  }

  return (
    <div className="w-full h-56 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl overflow-hidden shadow-lg hover:shadow-emerald-200/50 transition-all duration-300 animate-fadeIn">
      {loading && (
        <div className="h-full flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mb-4"></div>
          <p className="text-sm text-emerald-600 font-medium">Chargement de l'aperçu...</p>
        </div>
      )}
      
      {error && (
        <div className="h-full flex flex-col items-center justify-center bg-red-50">
          <FileText className="h-16 w-16 text-red-400 mb-3" />
          <p className="text-sm text-red-600 text-center px-3 font-medium">{error}</p>
          <p className="text-xs text-gray-500 mt-2">Fichier PDF détecté</p>
        </div>
      )}
      
      <div className="h-full flex items-center justify-center p-4">
        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={null}
          error={null}
        >
          <Page 
            pageNumber={1} 
            width={200}
            height={200}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            loading={null}
            error={null}
            className="shadow-md rounded-lg"
          />
        </Document>
      </div>
    </div>
  )
}

export default CVPreview
