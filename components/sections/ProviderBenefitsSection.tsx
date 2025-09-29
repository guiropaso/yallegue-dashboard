import { CheckCircle, CreditCard, Star, UserCheck } from "lucide-react"

export function ProviderBenefitsSection() {
  const benefits = [
    {
      icon: CheckCircle,
      title: "Libertad total",
      description: "Acepta solo los trabajos que te convengan."
    },
    {
      icon: CreditCard,
      title: "Pagos seguros",
      description: "Recibe tus pagos sin complicaciones ni riesgos."
    },
    {
      icon: Star,
      title: "Reputación",
      description: "Mejora tu reputación con reseñas positivas."
    },
    {
      icon: UserCheck,
      title: "Crecimiento",
      description: "Crece tu red de clientes y tu estabilidad económica."
    }
  ]

  return (
    <section id="para-proveedores" className="py-20 px-4 bg-[#FF1B1C] text-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Gana dinero extra con <span className="text-yellow-300">Ya Llegué</span>
          </h2>
          <p className="text-xl max-w-3xl mx-auto opacity-90">
            La plataforma te da la libertad de trabajar cuando quieras, con pagos seguros y acceso a más clientes en tu zona.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <benefit.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="opacity-90">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
