import { UseFormRegister, FieldErrors, UseFormSetValue } from 'react-hook-form'
import type { FormField, FormData } from '../types/form'

interface DynamicFormFieldsProps {
  fields: FormField[]
  register: UseFormRegister<FormData>
  errors: FieldErrors<FormData>
  watch: FormData
  setValue: UseFormSetValue<FormData>
}

const DynamicFormFields = ({ fields, register, errors, watch, setValue }: DynamicFormFieldsProps) => {
  const renderField = (field: FormField) => {
    const baseProps = {
      id: field.name,
      placeholder: field.placeholder,
      className: `w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 ${
        errors[field.name] ? 'border-red-500' : ''
      }`,
      ...register(field.name, {
        required: field.required ? `${field.label} est obligatoire` : false,
        pattern: field.validation?.pattern ? {
          value: new RegExp(field.validation.pattern),
          message: `Format invalide pour ${field.label}`
        } : undefined,
        minLength: field.validation?.minLength ? {
          value: field.validation.minLength,
          message: `${field.label} doit contenir au moins ${field.validation.minLength} caractères`
        } : undefined,
        maxLength: field.validation?.maxLength ? {
          value: field.validation.maxLength,
          message: `${field.label} ne peut pas dépasser ${field.validation.maxLength} caractères`
        } : undefined,
      })
    }

    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
        return (
          <input
            type={field.type}
            {...baseProps}
          />
        )

      case 'date':
        return (
          <input
            type="date"
            {...baseProps}
          />
        )

      case 'textarea':
        return (
          <textarea
            rows={4}
            {...baseProps}
            className={baseProps.className.replace('px-3 py-2', 'px-3 py-3')}
          />
        )

      case 'checkbox':
        return (
          <div className="flex items-start">
            <input
              type="checkbox"
              {...register(field.name, {
                required: field.required ? `${field.label} est obligatoire` : false
              })}
              className="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor={field.name} className="ml-3 text-sm text-gray-700 leading-5">
              {field.label}
            </label>
          </div>
        )

      case 'select':
        return (
          <select
            {...baseProps}
          >
            <option value="">Sélectionnez une option</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )

      default:
        return (
          <input
            type="text"
            {...baseProps}
          />
        )
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
        Informations personnelles
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((field) => (
          <div key={field.name} className={field.type === 'checkbox' ? 'md:col-span-2' : ''}>
            {field.type !== 'checkbox' && (
              <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-2">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            
            {renderField(field)}
            
            {errors[field.name] && (
              <p className="mt-1 text-sm text-red-600">
                {errors[field.name]?.message}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default DynamicFormFields 