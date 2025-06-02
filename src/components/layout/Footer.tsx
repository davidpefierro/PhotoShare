import { Link } from 'react-router-dom';
import { Heart, Camera, Github, Twitter } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center">
              <Camera className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">PhotoShare</span>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Comparte tus momentos con el mundo, una foto a la vez.
            </p>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-gray-700">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Navegación
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary-600">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/explore" className="text-gray-600 hover:text-primary-600">
                  Explorar
                </Link>
              </li>
              <li>
                <Link to="/upload" className="text-gray-600 hover:text-primary-600">
                  Subir
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Soporte
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/help" className="text-gray-600 hover:text-primary-600">
                  Centro de Ayuda
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-primary-600">
                  Términos de Servicio
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-primary-600">
                  Política de Privacidad
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Contacto
            </h3>
            <ul className="mt-4 space-y-2">
              <li className="text-gray-600">
                Email: soporte@photoshare.com
              </li>
              <li className="text-gray-600">
                Teléfono: +34 123 456 789
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-500 text-center">
            &copy; {currentYear} PhotoShare. Todos los derechos reservados.
          </p>
          <p className="text-sm text-gray-500 text-center mt-2 flex items-center justify-center">
            Hecho con <Heart className="h-4 w-4 text-accent-500 mx-1" /> para compartir recuerdos
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;