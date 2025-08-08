import axios from 'axios'
import type { FormConfig, UploadResponse, UploadStats, FormData } from '../types/form'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 secondes pour les uploads
})

export const apiService = {
  /**
   * Récupère la configuration des champs du formulaire
   */
  async getFormConfig(): Promise<FormConfig> {
    const response = await apiClient.get<FormConfig>('/api/form-config')
    return response.data
  },

  /**
   * Upload un CV avec les données du formulaire
   */
  async uploadCV(cvFile: File, formData: FormData): Promise<UploadResponse> {
    const uploadData = new FormData()
    uploadData.append('cv_file', cvFile)
    uploadData.append('form_data', JSON.stringify(formData))

    const response = await apiClient.post<UploadResponse>(
      '/api/upload',
      uploadData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data
  },

  /**
   * Récupère les statistiques d'upload
   */
  async getStats(): Promise<UploadStats> {
    const response = await apiClient.get<UploadStats>('/api/stats')
    return response.data
  },

  /**
   * Récupère les détails d'un upload spécifique
   */
  async getUploadDetails(uploadId: string): Promise<any> {
    const response = await apiClient.get(`/api/uploads/${uploadId}`)
    return response.data
  }
} 