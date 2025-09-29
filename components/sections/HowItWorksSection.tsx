export function HowItWorksSection() {
  const steps = [
    {
      number: "1",
      title: "Regístrate en minutos",
      description: "Ingresa tus datos y completa tu perfil (cliente o proveedor)."
    },
    {
      number: "2", 
      title: "Selecciona tu servicio",
      description: "Elige entre vehículos, limpieza, mascotas o mantenimiento."
    },
    {
      number: "3",
      title: "Configura detalles", 
      description: "Indica ubicación, fecha, hora y extras opcionales."
    },
    {
      number: "4",
      title: "Confirmación segura",
      description: "Los clientes pagan dentro de la plataforma; los proveedores reciben el aviso del trabajo."
    },
    {
      number: "5",
      title: "Servicio y reseña",
      description: "Una vez finalizado, el cliente califica y el proveedor recibe su pago automáticamente."
    }
  ]

  return (
    <section id="como-funciona" className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Así de fácil funciona <span className="bg-gradient-to-r from-[#FF1B1C] via-[#FF4444] to-[#FF6B6B] bg-clip-text text-transparent">Ya Llegué</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tanto para clientes como para proveedores, el proceso es simple, rápido y seguro.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="w-16 h-16 bg-[#FF1B1C] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">{step.number}</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600 text-sm">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
