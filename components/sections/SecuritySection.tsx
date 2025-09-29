import { Button } from "@/components/ui/button"
import { Shield, MessageCircle, Star, CheckCircle, Lock, UserCheck } from "lucide-react"

export function SecuritySection() {
  const securityBenefits = [
    {
      icon: Shield,
      title: "Verificación completa",
      description: "Todos nuestros proveedores pasan por un proceso riguroso de verificación de documentos, experiencia y antecedentes."
    },
    {
      icon: Lock,
      title: "Protección de datos",
      description: "Tus datos personales están protegidos con encriptación de nivel bancario y nunca se comparten con terceros."
    },
    {
      icon: UserCheck,
      title: "Soporte 24/7",
      description: "Nuestro equipo de soporte está disponible las 24 horas para resolver cualquier duda o problema que puedas tener."
    }
  ]

  return (
    <section id="seguridad" className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Security Image */}
          <div className="relative">
            <div className="relative w-full h-96 flex items-center justify-center">
              {/* Security Image */}
              <img 
                src="/images/security.png"
                alt="Security Illustration"
                className="w-full h-full object-contain"
              />
              
              {/* Subtle background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF1B1C]/10 via-[#FF4444]/5 to-[#FF6B6B]/10 rounded-2xl blur-3xl"></div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl text-center md:text-left font-bold text-gray-900 mb-6">
                ¿Por qué elegir{" "}
                <span className="bg-gradient-to-r from-[#FF1B1C] via-[#FF4444] to-[#FF6B6B] bg-clip-text text-transparent">
                  Ya Llegué
                </span>{" "}
                para tu seguridad?
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed text-center md:text-left">
                Trabajar con nosotros es simple y flexible: estamos listos para discutir términos convenientes y ofrecerte una de las plataformas más seguras disponibles en el mercado.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-6">
              {securityBenefits.map((benefit, index) => (
                <div key={benefit.title} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#FF1B1C]/20 via-[#FF4444]/15 to-[#FF6B6B]/20 rounded-full flex items-center justify-center">
                    <benefit.icon className="w-6 h-6 text-[#FF1B1C]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Call to Action Button */}
            <div className="pt-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-[#FF1B1C] via-[#FF4444] to-[#FF6B6B] hover:from-[#FF1B1C]/90 hover:via-[#FF4444]/90 hover:to-[#FF6B6B]/90 text-white px-8 py-4 text-lg font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Documentación de Seguridad
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
