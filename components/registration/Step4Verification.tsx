'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { useProviderStore } from '@/lib/store'
import { Upload, FileText, Shield, Loader2, AlertCircle, CheckCircle, X, Eye } from 'lucide-react'

export default function Step4Verification() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [isComplete, setIsComplete] = useState(false)
  
  const { user, documents, setDocuments, setLoading, setError: setStoreError, prevStep } = useProviderStore()
  
  const duiFrontRef = useRef<HTMLInputElement>(null)
  const duiBackRef = useRef<HTMLInputElement>(null)
  const policeRecordRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Load existing document data if available
    const loadExistingData = async () => {
      if (!user?.id) return

      try {
        const { data, error } = await supabase
          .from('provider_documents')
          .select('*')
          .eq('provider_id', user.id)
          .single()

        if (data && !error) {
          // Note: We can't load actual File objects from URLs, 
          // but we can show that documents were previously uploaded
          console.log('Existing documents found:', data)
        }
      } catch (err) {
        console.error('Error loading existing document data:', err)
      }
    }

    loadExistingData()
  }, [user?.id])

  const handleFileSelect = (type: keyof typeof documents, file: File | null) => {
    setDocuments({ [type]: file })
  }

  const uploadFile = async (file: File, path: string): Promise<string> => {
    const { data, error } = await supabase.storage
      .from('provider_documents')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      throw error
    }

    const { data: { publicUrl } } = supabase.storage
      .from('provider_documents')
      .getPublicUrl(data.path)

    return publicUrl
  }

  const handleFileUpload = async (type: keyof typeof documents, file: File) => {
    if (!user?.id) return

    const path = `${user.id}/${type}/${Date.now()}-${file.name}`
    
    try {
      setUploadProgress(prev => ({ ...prev, [type]: 0 }))
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => ({
          ...prev,
          [type]: Math.min(prev[type] + 10, 90)
        }))
      }, 100)

      const url = await uploadFile(file, path)
      
      clearInterval(progressInterval)
      setUploadProgress(prev => ({ ...prev, [type]: 100 }))
      
      return url
    } catch (err) {
      setUploadProgress(prev => ({ ...prev, [type]: 0 }))
      throw err
    }
  }

  const handleSubmit = async () => {
    if (!user?.id) return

    // Validate required files
    if (!documents.duiFront || !documents.duiBack || !documents.policeRecord) {
      setError('Por favor, sube todos los documentos requeridos.')
      return
    }

    setIsLoading(true)
    setError(null)
    setStoreError(null)

    try {
      const uploads = await Promise.all([
        handleFileUpload('duiFront', documents.duiFront!),
        handleFileUpload('duiBack', documents.duiBack!),
        handleFileUpload('policeRecord', documents.policeRecord!)
      ])

      const [duiFrontUrl, duiBackUrl, policeRecordUrl] = uploads

      // Save document URLs to database
      const { error } = await supabase
        .from('provider_documents')
        .upsert({
          provider_id: user.id,
          dui_front_url: duiFrontUrl,
          dui_back_url: duiBackUrl,
          police_record_url: policeRecordUrl
        })

      if (error) {
        throw error
      }

      // Update provider registration step to completed
      const { error: updateError } = await supabase
        .from('providers')
        .update({ registration_step: 5 })
        .eq('id', user.id)

      if (updateError) {
        throw updateError
      }

      setIsComplete(true)
    } catch (err: any) {
      console.error('Error uploading documents:', err)
      setError('Error al subir los documentos. Por favor, inténtalo de nuevo.')
      setStoreError('Error al subir los documentos. Por favor, inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const FileUploadField = ({ 
    type, 
    label, 
    description, 
    accept, 
    ref 
  }: { 
    type: keyof typeof documents
    label: string
    description: string
    accept: string
    ref: React.RefObject<HTMLInputElement>
  }) => {
    const file = documents[type]
    const progress = uploadProgress[type] || 0

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {label} *
        </label>
        <p className="text-xs text-gray-500 mb-3">{description}</p>
        
        {file ? (
          <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleFileSelect(type, null)}
                  className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
            {progress > 0 && progress < 100 && (
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[#FF1B1C] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Subiendo... {progress}%</p>
              </div>
            )}
          </div>
        ) : (
          <div
            onClick={() => ref.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#FF1B1C] hover:bg-[#FF1B1C]/5 cursor-pointer transition-all duration-200"
          >
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-1">Haz clic para subir archivo</p>
            <p className="text-xs text-gray-500">PNG, JPG, PDF hasta 10MB</p>
          </div>
        )}
        
        <input
          ref={ref}
          type="file"
          accept={accept}
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              handleFileSelect(type, file)
            }
          }}
          className="hidden"
        />
      </div>
    )
  }

  if (isComplete) {
    return (
      <div className="space-y-6 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Registro completado!
          </h3>
          <p className="text-gray-600 mb-6">
            Tu registro ha sido enviado con éxito. Nuestro equipo revisará tu información y te contactará por WhatsApp o correo electrónico.
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-green-600" />
            <p className="text-sm font-medium text-green-800">Próximos pasos</p>
          </div>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Revisaremos tu información en 24-48 horas</li>
            <li>• Te contactaremos por WhatsApp para verificación</li>
            <li>• Una vez aprobado, podrás recibir solicitudes de servicios</li>
          </ul>
        </div>

        <Button
          onClick={() => window.location.href = '/'}
          className="bg-gradient-to-r from-[#FF1B1C] via-[#FF4444] to-[#FF6B6B] hover:from-[#FF1B1C]/90 hover:via-[#FF4444]/90 hover:to-[#FF6B6B]/90 text-white py-3 px-8 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          Volver al inicio
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Verificación de Identidad
        </h3>
        <p className="text-gray-600">
          Sube los documentos requeridos para verificar tu identidad y completar tu registro.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-sm font-medium text-red-800">Error de validación</p>
          </div>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        <FileUploadField
          type="duiFront"
          label="Foto del DUI (Frente)"
          description="Sube una foto clara del frente de tu DUI"
          accept="image/*"
          ref={duiFrontRef}
        />

        <FileUploadField
          type="duiBack"
          label="Foto del DUI (Reverso)"
          description="Sube una foto clara del reverso de tu DUI"
          accept="image/*"
          ref={duiBackRef}
        />

        <FileUploadField
          type="policeRecord"
          label="Antecedentes Penales"
          description="Sube tu certificado de antecedentes penales (PDF o imagen)"
          accept=".pdf,image/*"
          ref={policeRecordRef}
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-800 mb-1">Información de seguridad</p>
            <p className="text-xs text-blue-700">
              Tus documentos son procesados de forma segura y solo serán utilizados para verificar tu identidad. 
              No compartimos esta información con terceros.
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          onClick={prevStep}
          variant="outline"
          className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 py-3 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          Atrás
        </Button>
        
        <Button
          onClick={handleSubmit}
          disabled={isLoading || !documents.duiFront || !documents.duiBack || !documents.policeRecord}
          className="flex-1 bg-gradient-to-r from-[#FF1B1C] via-[#FF4444] to-[#FF6B6B] hover:from-[#FF1B1C]/90 hover:via-[#FF4444]/90 hover:to-[#FF6B6B]/90 text-white py-3 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:scale-100 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Subiendo documentos...
            </>
          ) : (
            'Completar registro'
          )}
        </Button>
      </div>
    </div>
  )
}
