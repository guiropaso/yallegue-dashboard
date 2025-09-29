import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Clock, CreditCard, DollarSign } from "lucide-react"

export function BenefitsSection() {
  return (
    <section id="beneficios" className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            ¿Por qué elegir <span className="bg-gradient-to-r from-[#FF1B1C] via-[#FF4444] to-[#FF6B6B] bg-clip-text text-transparent">Ya Llegué</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nuestra plataforma está diseñada para darte tranquilidad, confianza y oportunidades reales. 
            Tanto clientes como proveedores se benefician de un sistema simple y seguro.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="relative bg-white rounded-3xl border-0 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF1B1C] rounded-l-3xl"></div>
            <CardContent className="p-8 pl-12">
              <div className="flex flex-col">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-[#FF1B1C]/10 rounded-full flex items-center justify-center mr-4 -ml-4">
                    <Shield className="w-6 h-6 text-[#FF1B1C]" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Confianza total</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Todos los proveedores son verificados con documentos y antecedentes para garantizar tu seguridad y tranquilidad.
                </p>
              </div>
            </CardContent>
          </div>

          <div className="relative bg-white rounded-3xl border-0 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-400 rounded-l-3xl"></div>
            <CardContent className="p-8 pl-12">
              <div className="flex flex-col">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-orange-400/10 rounded-full flex items-center justify-center mr-4 -ml-4">
                    <Clock className="w-6 h-6 text-orange-400" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Flexibilidad real</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Trabaja o contrata servicios cuando lo necesites, sin horarios rígidos. Tu tiempo, tu manera.
                </p>
              </div>
            </CardContent>
          </div>

          <div className="relative bg-white rounded-3xl border-0 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-3xl"></div>
            <CardContent className="p-8 pl-12">
              <div className="flex flex-col">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mr-4 -ml-4">
                    <CreditCard className="w-6 h-6 text-blue-500" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Pagos seguros</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Transacciones con respaldo completo, siempre dentro de la app. Tu dinero está protegido.
                </p>
              </div>
            </CardContent>
          </div>

          <div className="relative bg-white rounded-3xl border-0 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500 rounded-l-3xl"></div>
            <CardContent className="p-8 pl-12">
              <div className="flex flex-col">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mr-4 -ml-4">
                    <DollarSign className="w-6 h-6 text-green-500" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Precios claros</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Cotizaciones en tiempo real, sin letras pequeñas ni cobros ocultos. Transparencia total.
                </p>
              </div>
            </CardContent>
          </div>
        </div>
      </div>
    </section>
  )
}
