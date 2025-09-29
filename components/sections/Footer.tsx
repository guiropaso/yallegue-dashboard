import { Facebook, Instagram, MessageCircle } from "lucide-react"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            {/* Logo */}
            <div className="mb-4">
              <Image 
                src="/images/logos/logo.png" 
                alt="Ya Llegué Logo" 
                width={150}
                height={60}
                className="filter brightness-0 invert"
              />
            </div>
            <p className="text-gray-300 mb-4">
              Tu ayuda confiable, cuando y donde la necesites. Conectamos clientes con proveedores 
              verificados para servicios de calidad.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-6 h-6 text-gray-400 hover:text-[#FF1B1C] cursor-pointer" />
              <Instagram className="w-6 h-6 text-gray-400 hover:text-[#FF1B1C] cursor-pointer" />
              <MessageCircle className="w-6 h-6 text-gray-400 hover:text-[#FF1B1C] cursor-pointer" />
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Enlaces</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-[#FF1B1C]">Sobre nosotros</a></li>
              <li><a href="#" className="hover:text-[#FF1B1C]">Servicios</a></li>
              <li><a href="#" className="hover:text-[#FF1B1C]">Cómo funciona</a></li>
              <li><a href="#" className="hover:text-[#FF1B1C]">Contacto</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Políticas</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-[#FF1B1C]">Términos y condiciones</a></li>
              <li><a href="#" className="hover:text-[#FF1B1C]">Privacidad</a></li>
              <li><a href="#" className="hover:text-[#FF1B1C]">Política de cancelación</a></li>
              <li><a href="#" className="hover:text-[#FF1B1C]">Política de reembolso</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Ya Llegué. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
