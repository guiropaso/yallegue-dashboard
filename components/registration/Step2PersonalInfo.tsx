'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { useProviderStore } from '@/lib/store'
import { User, FileText, Phone, Loader2, AlertCircle } from 'lucide-react'

export default function Step2PersonalInfo() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user, personalInfo, setPersonalInfo, setLoading, setError: setStoreError, nextStep, prevStep } = useProviderStore()

  useEffect(() => {
    // Load existing data if available
    const loadExistingData = async () => {
      if (!user?.id) return

      try {
        const { data, error } = await supabase
          .from('providers')
          .select('*')
          .eq('id', user.id)
          .single()

        if (data && !error) {
          setPersonalInfo({
            firstName: data.first_name || '',
            lastName: data.last_name || '',
            dui: data.dui || '',
            whatsapp: data.whatsapp || '',
            hasFixedJob: data.has_fixed_job
          })
        }
      } catch (err) {
        console.error('Error loading existing data:', err)
      }
    }

    loadExistingData()
  }, [user?.id, setPersonalInfo])

  const handleInputChange = (field: keyof typeof personalInfo, value: string | boolean) => {
    setPersonalInfo({ [field]: value })
  }

  const handleWhatsAppInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Allow only digits, plus sign, spaces, and hyphens
    const filteredValue = value.replace(/[^0-9+\s-]/g, '')
    handleInputChange('whatsapp', filteredValue)
  }

  const handleDuiInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Allow only digits and limit to 9 characters
    const filteredValue = value.replace(/[^0-9]/g, '').slice(0, 9)
    handleInputChange('dui', filteredValue)
  }

  const handleContinue = async () => {
    if (!user?.id) return

    // Validate required fields
    if (!personalInfo.firstName || !personalInfo.lastName || !personalInfo.dui || !personalInfo.whatsapp || personalInfo.hasFixedJob === null) {
      setError('Por favor, completa todos los campos requeridos.')
      return
    }

    setIsLoading(true)
    setError(null)
    setStoreError(null)

    try {
      const { error } = await supabase
        .from('providers')
        .upsert({
          id: user.id,
          first_name: personalInfo.firstName,
          last_name: personalInfo.lastName,
          dui: personalInfo.dui,
          whatsapp: personalInfo.whatsapp,
          has_fixed_job: personalInfo.hasFixedJob,
          registration_step: 3
        })

      if (error) {
        throw error
      }

      nextStep()
    } catch (err: any) {
      console.error('Error saving personal info:', err)
      setError('Error al guardar tu información. Por favor, inténtalo de nuevo.')
      setStoreError('Error al guardar tu información. Por favor, inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Información Personal
        </h3>
        <p className="text-gray-600">
          Necesitamos algunos datos básicos para crear tu perfil de proveedor.
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

      <div className="space-y-4">
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              Nombre *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                id="firstName"
                value={personalInfo.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF1B1C] focus:border-transparent focus:bg-white transition-all duration-200"
                placeholder="Tu nombre"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Apellido *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                id="lastName"
                value={personalInfo.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF1B1C] focus:border-transparent focus:bg-white transition-all duration-200"
                placeholder="Tu apellido"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="dui" className="block text-sm font-medium text-gray-700">
              DUI *
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                id="dui"
                value={personalInfo.dui}
                onChange={handleDuiInput}
                maxLength={9}
                className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF1B1C] focus:border-transparent focus:bg-white transition-all duration-200"
                placeholder="000000000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700">
              WhatsApp *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                id="whatsapp"
                value={personalInfo.whatsapp}
                onChange={handleWhatsAppInput}
                className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF1B1C] focus:border-transparent focus:bg-white transition-all duration-200"
                placeholder="+503 0000-0000"
              />
            </div>
          </div>
        </div>

        {/* Employment Status */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            ¿Posees trabajo fijo? *
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center p-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors duration-200">
              <input
                type="radio"
                name="hasFixedJob"
                checked={personalInfo.hasFixedJob === true}
                onChange={() => handleInputChange('hasFixedJob', true)}
                className="mr-3 h-4 w-4 text-[#FF1B1C] focus:ring-[#FF1B1C] focus-visible:ring-0 border-gray-300"
              />
              <span className="text-sm text-gray-700 font-medium">Sí</span>
            </label>
            <label className="flex items-center p-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors duration-200">
              <input
                type="radio"
                name="hasFixedJob"
                checked={personalInfo.hasFixedJob === false}
                onChange={() => handleInputChange('hasFixedJob', false)}
                className="mr-3 h-4 w-4 text-[#FF1B1C] focus:ring-[#FF1B1C] focus-visible:ring-0 border-gray-300"
              />
              <span className="text-sm text-gray-700 font-medium">No</span>
            </label>
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
          onClick={handleContinue}
          disabled={isLoading || !personalInfo.firstName || !personalInfo.lastName || !personalInfo.dui || !personalInfo.whatsapp || personalInfo.hasFixedJob === null}
          className="flex-1 bg-gradient-to-r from-[#FF1B1C] via-[#FF4444] to-[#FF6B6B] hover:from-[#FF1B1C]/90 hover:via-[#FF4444]/90 hover:to-[#FF6B6B]/90 text-white py-3 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:scale-100 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Guardando...
            </>
          ) : (
            'Continuar'
          )}
        </Button>
      </div>
    </div>
  )
}
