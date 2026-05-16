import { Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react';

export const Footer = ({ onAdminClick }: { onAdminClick: () => void }) => {
  return (
    <footer className="bg-brand-dark text-brand-nude/80 pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-white text-3xl font-display mb-6 tracking-widest">LUPE NAILS</h2>
            <p className="max-w-sm text-brand-nude/60 mb-8 leading-relaxed font-sans">
              Elevamos la experiencia de manicuría a un nivel de arte. 
              Minimalismo, tendencia y lujo en cada detalle.
            </p>
            <div className="flex items-center gap-6">
              <Instagram className="w-6 h-6 cursor-pointer hover:text-brand-gold transition-colors" />
              <Twitter className="w-6 h-6 cursor-pointer hover:text-brand-gold transition-colors" />
              <Mail className="w-6 h-6 cursor-pointer hover:text-brand-gold transition-colors" />
            </div>
          </div>

          <div>
            <h4 className="text-white font-accent text-sm uppercase tracking-widest mb-6">Explorar</h4>
            <ul className="flex flex-col gap-4 text-sm font-accent">
              <li className="hover:text-white cursor-pointer transition-colors">Diseños</li>
              <li className="hover:text-white cursor-pointer transition-colors">Servicios</li>
              <li className="hover:text-white cursor-pointer transition-colors">Nuestros Artistas</li>
              <li className="hover:text-white cursor-pointer transition-colors">Ubicación</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-accent text-sm uppercase tracking-widest mb-6">Contacto</h4>
            <ul className="flex flex-col gap-4 text-sm font-accent">
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-brand-gold" />
                <span>Palermo, Buenos Aires</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-brand-gold" />
                <span>+54 11 2345 6789</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-brand-gold" />
            <span className="hover:opacity-100 cursor-pointer transition-opacity">hola@lupe.nails</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs font-accent uppercase tracking-widest opacity-40">
            © 2026 LUPE NAILS STUDIO. TODOS LOS DERECHOS RESERVADOS.
          </p>
          <div className="flex items-center gap-8 text-[10px] uppercase tracking-widest opacity-40">
            <span onClick={onAdminClick} className="hover:opacity-100 cursor-pointer transition-opacity">Admin Panel</span>
            <span className="hover:opacity-100 cursor-pointer transition-opacity">Privacy Policy</span>
            <span className="hover:opacity-100 cursor-pointer transition-opacity">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
