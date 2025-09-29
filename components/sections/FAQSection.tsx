import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CheckCircle, MessageCircle, Clock, Shield } from "lucide-react"
import Link from "next/link"

export function FAQSection() {
  const faqs = [
    {
      question: "¿Cómo funciona Ya Llegué?",
      answer: "Es muy simple: publicas tu necesidad, recibes ofertas de proveedores verificados, eliges la mejor opción y coordinas el servicio. Todo a través de nuestra plataforma segura y confiable.",
      icon: MessageCircle
    },
    {
      question: "¿Es seguro usar Ya Llegué?",
      answer: "Absolutamente. Todos nuestros proveedores pasan por un proceso riguroso de verificación que incluye verificación de documentos, experiencia comprobada y antecedentes limpios. Tu seguridad es nuestra prioridad.",
      icon: Shield
    },
    {
      question: "¿Cuánto tiempo toma recibir un servicio?",
      answer: "La mayoría de nuestros servicios están disponibles en menos de 30 minutos. Nuestros proveedores verificados están listos para ayudarte cuando lo necesites, las 24 horas del día.",
      icon: Clock
    }
  ]

  return (
    <section id="faq" className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - FAQ Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF1B1C]/10 to-[#FF6B6B]/10 rounded-full px-4 py-2 border border-[#FF1B1C]/20">
              <CheckCircle className="w-4 h-4 text-[#FF1B1C]" />
              <span className="text-sm font-medium text-[#FF1B1C]">Desarrollado y Gestionado Internamente</span>
            </div>

            {/* Main Title */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-center md:text-left">
                Ya Llegué es la{" "}
                <span className="bg-gradient-to-r from-[#FF1B1C] via-[#FF4444] to-[#FF6B6B] bg-clip-text text-transparent">
                  plataforma confiable
                </span>{" "}
                para servicios a domicilio.
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed text-center md:text-left">
                Utiliza el poder de nuestra plataforma para conectar de manera segura con proveedores verificados. 
                Publica tu necesidad, recibe ofertas, elige la mejor opción y coordina tu servicio. 
                Si tienes alguna pregunta, nuestro soporte está siempre disponible y listo para ayudarte.
              </p>
            </div>

            {/* FAQ Accordion */}
            <div className="space-y-4">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index + 1}`} className="border border-gray-200 rounded-lg">
                    <AccordionTrigger className="text-left px-6 py-4 hover:bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-[#FF1B1C] to-[#FF6B6B] rounded-full flex items-center justify-center aspect-square">
                          <faq.icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-semibold text-gray-900">{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Call to Action */}
            <Link href="/providersignup">
              <div className="bg-gradient-to-r from-[#FF1B1C]/5 to-[#FF6B6B]/5 hover:scale-105 rounded-lg p-6 mt-8 border border-[#FF1B1C]/10 hover:from-[#FF1B1C]/10 hover:to-[#FF6B6B]/10 hover:border-[#FF1B1C]/20 transition-all duration-300 cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#FF1B1C] to-[#FF6B6B] rounded-lg flex items-center justify-center aspect-square flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Conecta en Minutos</h3>
                    <p className="text-sm text-gray-600">Si eres un proveedor de servicios regístrate gratis dando click acá y te informaremos cuando tengas un nuevo cliente.</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Right Side - FAQ Image */}
          <div className="relative">
            <div className="relative w-full h-[500px] flex items-center justify-center">
              {/* FAQ Image */}
              <img 
                src="/images/faq/faq.png"
                alt="FAQ Dashboard Interface"
                className="w-full h-full object-contain scale-110"
              />
              
              {/* Subtle background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/10 via-[#A855F7]/5 to-[#C084FC]/10 rounded-2xl blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}