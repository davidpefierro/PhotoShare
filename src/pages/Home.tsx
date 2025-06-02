import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Camera, Users, MessageCircle, Heart } from 'lucide-react';
import Button from '../components/ui/Button';
import PhotoGrid from '../components/photo/PhotoGrid';

const Home = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Si el usuario ya está conectado, podríamos redirigirlo a su feed
    // o mantenerlo aquí para ver la página de inicio pública
  }, [isAuthenticated]);
  
  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/upload');
    } else {
      navigate('/register');
    }
  };
  
  if (isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <PhotoGrid />
        </div>
      </div>
    );
  }
  
  return (
    <div>
      {/* Sección Hero */}
      <div className="bg-gradient-to-r from-primary-500 to-accent-500 text-white">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
                Comparte Tus Momentos Con El Mundo
              </h1>
              <p className="text-lg mb-8 text-white text-opacity-90">
                PhotoShare es una hermosa plataforma para fotógrafos de todos los niveles para compartir su trabajo, conectar con otros y encontrar inspiración.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <Button
                  onClick={handleGetStarted}
                  variant="secondary"
                  size="lg"
                  className="shadow-lg hover:shadow-xl transform transition hover:-translate-y-1"
                >
                  Empezar Ahora
                </Button>
                <Button
                  onClick={() => navigate('/explore')}
                  variant="outline"
                  size="lg"
                  className="bg-white bg-opacity-10 hover:bg-opacity-20 border-white text-white"
                >
                  Explorar Fotos
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute -right-4 -top-4 w-64 h-64 bg-accent-300 rounded-lg transform rotate-6 animate-pulse-slow"></div>
                <div className="absolute -left-4 -bottom-4 w-64 h-64 bg-primary-600 rounded-lg transform -rotate-6 animate-pulse-slow"></div>
                <div className="relative bg-white p-2 rounded-lg shadow-xl">
                  <img
                    src="https://images.pexels.com/photos/3621344/pexels-photo-3621344.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="Cámara y fotos"
                    className="rounded w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sección de Características */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">¿Por Qué Elegir PhotoShare?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Camera className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Compartir Fácilmente</h3>
              <p className="text-gray-600">
                Sube y comparte tus fotos con solo unos clics. Añade descripciones y observa la interacción crecer.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-secondary-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Conecta con Otros</h3>
              <p className="text-gray-600">
                Sigue a fotógrafos que admiras, interactúa con su trabajo y construye una comunidad en torno a tus intereses.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-accent-100 rounded-lg flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-accent-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Recibe Feedback</h3>
              <p className="text-gray-600">
                Recibe me gusta y comentarios en tus fotos. Aprende qué resuena con tu audiencia y mejora tu arte.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sección CTA */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">¿Listo para compartir tus fotos?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Únete a miles de fotógrafos que ya están compartiendo su trabajo y creando conexiones.
          </p>
          <Button
            onClick={handleGetStarted}
            variant="primary"
            size="lg"
            className="shadow-lg hover:shadow-xl transform transition hover:-translate-y-1"
          >
            ¡Regístrate Ahora — Es Gratis!
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;