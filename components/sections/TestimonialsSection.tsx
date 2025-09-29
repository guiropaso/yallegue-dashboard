import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "María Rodríguez",
      initial: "M",
      rating: 5,
      review: "Con Ya Llegué encontré una forma segura de ganar dinero extra los fines de semana. Los clientes son respetuosos y los pagos llegan puntuales.",
      role: "Proveedor de limpieza"
    },
    {
      name: "Luis Méndez",
      initial: "L", 
      rating: 5,
      review: "Por fin puedo contratar servicios con confianza. Todo queda registrado en la plataforma y los precios son transparentes. ¡Excelente servicio!",
      role: "Cliente frecuente"
    },
    {
      name: "Ana López",
      initial: "A",
      rating: 5,
      review: "El servicio de cuidado de mascotas es increíble. Mi perro está feliz y yo tengo la tranquilidad de saber que está en buenas manos.",
      role: "Cliente de mascotas"
    }
  ]

  return (
    <section id="testimonios" className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Lo que dicen nuestros <span className="bg-gradient-to-r from-[#FF1B1C] via-[#FF4444] to-[#FF6B6B] bg-clip-text text-transparent">usuarios</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="p-6 hover:shadow-lg transition-shadow">
              <CardContent>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-[#FF1B1C] rounded-full flex items-center justify-center text-white font-semibold mr-4">
                    {testimonial.initial}
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <div className="flex items-center">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "{testimonial.review}"
                </p>
                <p className="text-sm text-gray-500 mt-2">- {testimonial.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
