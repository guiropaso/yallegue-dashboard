'use client'

import { useState, useEffect, useRef } from 'react'
import { Car, Home, Heart, Wrench, ArrowRight, Sparkles, Zap, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'

export function ServicePillarsSection() {
  const [activeService, setActiveService] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const services = [
    {
      icon: Car,
      title: "Alquiler de vehículos",
      image: "/images/services/cars.jpeg",
      description: "Renta un auto en minutos, sin depósitos ni papeleo. Opciones con chofer, guía turístico o conductor adicional.",
      features: [
        "Estimador de precios por día",
        "Alquiler con o sin chofer", 
        "Seguros incluidos"
      ]
    },
    {
      icon: Home,
      title: "Housekeeping",
      image: "/images/services/housekeeping.jpeg",
      description: "Limpieza y mantenimiento para hogares, Airbnbs y ranchos. Elige servicios regulares, urgentes o de limpieza profunda.",
      features: [
        "Limpieza para Airbnbs y ranchos",
        "Servicios recurrentes o puntuales",
        "Personal capacitado y verificado"
      ]
    },
    {
      icon: Heart,
      title: "Cuidado de mascotas",
      image: "/images/services/mascotas.jpeg",
      description: "Escoge entre hospedaje en casa del cuidador o cuidado a domicilio. Extras como paseo, baño o transporte a veterinario.",
      features: [
        "Hospedaje en casa del cuidador",
        "Cuidado a domicilio",
        "Amantes de animales verificados"
      ]
    },
    {
      icon: Wrench,
      title: "Mantenimiento general",
      image: "/images/services/mantenimiento.jpeg",
      description: "Encuentra técnicos para electricidad, plomería, jardinería, aire acondicionado y reparaciones en general.",
      features: [
        "Electricidad, plomería, jardinería",
        "Reparaciones generales",
        "Profesionales certificados"
      ]
    }
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Function to start/reset auto-rotation
  const startAutoRotation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    intervalRef.current = setInterval(() => {
      setActiveService((prev) => (prev + 1) % services.length)
    }, 4000)
  }

  // Function to stop auto-rotation
  const stopAutoRotation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  useEffect(() => {
    startAutoRotation()
    return () => stopAutoRotation()
  }, [services.length])

  const goToPrevious = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setTimeout(() => {
      setActiveService((prev) => (prev - 1 + services.length) % services.length)
      setIsTransitioning(false)
      // Reset auto-rotation countdown after manual navigation
      startAutoRotation()
    }, 150)
  }

  const goToNext = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setTimeout(() => {
      setActiveService((prev) => (prev + 1) % services.length)
      setIsTransitioning(false)
      // Reset auto-rotation countdown after manual navigation
      startAutoRotation()
    }, 150)
  }

  // Touch handlers for swipe functionality
  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || isTransitioning) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      goToNext()
    } else if (isRightSwipe) {
      goToPrevious()
    }
  }

  // Function to handle direct navigation (for dots)
  const goToService = (index: number) => {
    if (isTransitioning || index === activeService) return
    setIsTransitioning(true)
    setTimeout(() => {
      setActiveService(index)
      setIsTransitioning(false)
      // Reset auto-rotation countdown after manual navigation
      startAutoRotation()
    }, 150)
  }

  return (
    <section 
      ref={sectionRef}
      id="servicios" 
      className="relative py-32 px-4 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-500/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-red-500/5 to-transparent rounded-full blur-3xl animate-spin"
          style={{animationDuration: '20s'}}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 mb-6 shadow-lg border border-white/20">
            <Sparkles className="w-5 h-5 text-red-600 animate-pulse" />
            <span className="text-sm font-medium text-gray-700">Servicios Premium</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-gray-900">Servicios disponibles en </span>
            <span className="bg-gradient-to-r from-[#FF1B1C] via-[#FF4444] to-[#FF6B6B] bg-clip-text text-transparent">
              Ya Llegué
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Cuatro categorías pensadas para cubrir las necesidades más comunes en el hogar, viajes o emergencias.
          </p>
        </div>


        {/* Interactive Service Carousel */}
        <div className={`relative transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div 
            className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden max-w-6xl mx-auto relative"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Navigation Chevrons - Hidden on mobile, visible on desktop */}
            <button
              onClick={goToPrevious}
              className="hidden md:flex absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-white/20 items-center justify-center hover:bg-white hover:shadow-xl transition-all duration-300 group"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700 group-hover:text-red-600 transition-colors duration-300" />
            </button>
            
            <button
              onClick={goToNext}
              className="hidden md:flex absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-white/20 items-center justify-center hover:bg-white hover:shadow-xl transition-all duration-300 group"
            >
              <ChevronRight className="w-6 h-6 text-gray-700 group-hover:text-red-600 transition-colors duration-300" />
            </button>

            <div className="grid md:grid-cols-2 items-stretch min-h-[350px] overflow-hidden">
              {/* Service Image - Full Left Side */}
              <div className="relative overflow-hidden">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${activeService * 100}%)` }}
                >
                  {services.map((service, index) => (
                    <div key={index} className="w-full flex-shrink-0">
                      <Image
                        src={service.image}
                        alt={service.title}
                        width={700}
                        height={450}
                        className="w-full h-full object-cover transition-all duration-300 hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                
                {/* Mobile Navigation Chevrons - Over the image */}
                <button
                  onClick={goToPrevious}
                  className="md:hidden absolute left-2 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full shadow-lg border border-white/20 flex items-center justify-center hover:bg-black/70 transition-all duration-300 group"
                  disabled={isTransitioning}
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
                
                <button
                  onClick={goToNext}
                  className="md:hidden absolute right-2 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full shadow-lg border border-white/20 flex items-center justify-center hover:bg-black/70 transition-all duration-300 group"
                  disabled={isTransitioning}
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
                
                {/* Floating Service Icon */}
                <div className="absolute top-4 right-4 w-14 h-14 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-white/20 transition-all duration-500">
                  {(() => {
                    const IconComponent = services[activeService].icon
                    return <IconComponent className="w-7 h-7 text-red-600" />
                  })()}
                </div>
              </div>

              {/* Service Info */}
              <div className="p-8 space-y-5 flex flex-col justify-center relative overflow-hidden">
                {/* Text Content with Sliding Transition */}
                <div className="relative overflow-hidden">
                  <div 
                    className="flex transition-transform duration-700 ease-out"
                    style={{ transform: `translateX(-${activeService * 100}%)` }}
                  >
                    {services.map((service, index) => (
                      <div key={index} className="w-full flex-shrink-0 px-2">
                        <div 
                          className="transition-all duration-500 ease-out"
                          style={{ 
                            opacity: isTransitioning ? 0.6 : 1,
                            transform: isTransitioning ? 'translateY(8px) scale(0.98)' : 'translateY(0) scale(1)'
                          }}
                        >
                          <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            {service.title}
                          </h3>
                          <p className="text-base text-gray-600 leading-relaxed">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Feature List with Staggered Animation */}
                <div className="relative overflow-hidden">
                  <div 
                    className="flex transition-transform duration-700 ease-out"
                    style={{ transform: `translateX(-${activeService * 100}%)` }}
                  >
                    {services.map((service, index) => (
                      <div key={index} className="w-full flex-shrink-0 px-2">
                        <div 
                          className="space-y-2 transition-all duration-500 ease-out"
                          style={{ 
                            opacity: isTransitioning ? 0.6 : 1,
                            transform: isTransitioning ? 'translateY(8px) scale(0.98)' : 'translateY(0) scale(1)'
                          }}
                        >
                          {service.features.map((feature, featureIndex) => (
                            <div
                              key={feature}
                              className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50/50 hover:bg-gray-100/50 transition-all duration-300"
                              style={{ 
                                transitionDelay: `${featureIndex * 50}ms`,
                                opacity: isTransitioning ? 0.8 : 1,
                                transform: isTransitioning ? `translateY(${featureIndex * 2}px)` : 'translateY(0)'
                              }}
                            >
                              <div className="w-2 h-2 bg-gradient-to-r from-[#FF1B1C] via-[#FF4444] to-[#FF6B6B] rounded-full flex-shrink-0 animate-pulse"></div>
                              <span className="text-sm text-gray-700">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button with Premium Transition */}
                <div className="relative overflow-hidden">
                  <div 
                    className="flex transition-transform duration-700 ease-out"
                    style={{ transform: `translateX(-${activeService * 100}%)` }}
                  >
                    {services.map((_, index) => (
                      <div key={index} className="w-full flex-shrink-0 px-2">
                        <button 
                          className="group/btn relative w-full bg-gradient-to-r from-[#FF1B1C] via-[#FF4444] to-[#FF6B6B] hover:from-[#FF1B1C]/90 hover:via-[#FF4444]/90 hover:to-[#FF6B6B]/90 text-white font-medium py-3 px-6 rounded-xl overflow-hidden transition-all duration-500 hover:shadow-lg hover:shadow-[#FF1B1C]/25"
                          disabled={isTransitioning}
                          style={{ 
                            opacity: isTransitioning ? 0.7 : 1,
                            transform: isTransitioning ? 'translateY(8px) scale(0.95)' : 'translateY(0) scale(1)'
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-[#FF1B1C]/90 via-[#FF4444]/90 to-[#FF6B6B]/90 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative flex items-center justify-center gap-2">
                            <span className="text-sm">Ver más detalles</span>
                            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                          </div>
                          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigation Dots */}
                <div className="flex justify-center gap-2 pt-2">
                  {services.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToService(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        activeService === index
                          ? 'bg-[#FF1B1C] scale-125'
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                      disabled={isTransitioning}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}