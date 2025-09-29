'use client'

import { Button } from "@/components/ui/button"
import LiquidEther from "@/components/LiquidEther"
import Link from "next/link"

export function HeroSection() {
  return (
    <section id="inicio" className="relative pt-[242px] pb-32 px-4">
      <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
        <LiquidEther
          colors={['ED4567', '#F0E0E8', '#FF1B1C']}
          mouseForce={24}
          cursorSize={100}
          isViscous={false}
          viscous={84}
          iterationsViscous={8}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.95}
          autoIntensity={1.0}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Main content centered */}
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
          Tu ayuda confiable,{" "}
          <span className="bg-gradient-to-r from-[#FF1B1C] via-[#FF4444] to-[#FF6B6B] bg-clip-text text-transparent">cuando y donde</span> la necesites.
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
          Conecta con proveedores verificados en minutos y recibe el servicio que necesitas, 
          de manera rápida, segura y sin complicaciones.
        </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/providersignup">
              <Button size="lg" className="bg-gradient-to-r from-[#FF1B1C] via-[#FF4444] to-[#FF6B6B] hover:from-[#FF1B1C]/90 hover:via-[#FF4444]/90 hover:to-[#FF6B6B]/90 text-white px-8 py-4 text-lg font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                Quiero ser un proveedor
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="px-8 py-4 text-lg bg-white/80 backdrop-blur-sm border-gray-300 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              onClick={() => {
                const servicesSection = document.getElementById('servicios');
                if (servicesSection) {
                  servicesSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Ver servicios
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
