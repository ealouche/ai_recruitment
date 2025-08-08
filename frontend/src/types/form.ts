export interface FormField {
  name: string
  type: 'text' | 'email' | 'tel' | 'date' | 'checkbox' | 'textarea' | 'select'
  label: string
  required: boolean
  placeholder?: string
  options?: string[] // Pour les champs select
  validation?: {
    pattern?: string
    minLength?: number
    maxLength?: number
  }
}

export interface FormConfig {
  fields: FormField[]
  version: string
  last_updated: string
}

export interface UploadResponse {
  success: boolean
  message: string
  upload_id: string
  cv_url: string
  timestamp: string
  form_fields_received: string[]
  file_info: {
    filename: string
    size: number
    content_type: string
  }
}

export interface UploadStats {
  total_uploads: number
  timestamp: string
  storage_backend: string
}

export type FormData = Record<string, any> 