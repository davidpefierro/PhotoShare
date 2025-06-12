import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Camera, Users, Heart } from 'lucide-react';
import Button from '../components/ui/Button';
import PhotoCard from '../components/photo/PhotoCard';
import { useState, useEffect } from 'react';

const Home = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // FEED STATE & PAGINATION
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Recarga cada vez que 'page' cambia o vuelves a inicio
 useEffect(() => {
  fetch(`/api/fotografias?page=${page}&size=10`)
    .then(res => res.json())
    .then(data => {
      setPhotos(data.content);
      setTotalPages(data.totalPages);
    });
}, [page, location.key]);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/upload');
    } else {
      navigate('/register');
    }
  };
  // Handlers para like/unlike
 const handleLike = async (idFoto, userLiked) => {
  if (!isAuthenticated) return;
  let result;
  if (userLiked) {
    result = await photoService.quitarLikeAFoto(idFoto, user.idUsuario ?? user.id);
  } else {
    result = await photoService.darLikeAFoto(idFoto, user.idUsuario ?? user.id);
  }
  if (result.success) {
    setPhotos(photos =>
      photos.map(photo =>
        photo.idFoto === idFoto
          ? {
              ...photo,
              userLiked: !userLiked,
              likesCount: result.likesCount,
            }
          : photo
      )
    );
  }
};
  return (
    <div>
      {/* Hero/landing solo para no autenticados */}
      {!isAuthenticated && (
        <>
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
        </>
      )}

      {/* Feed de fotos con paginación */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
      <div className="flex flex-col gap-4">
        {photos.map(photo => (
          <PhotoCard
            key={photo.idFoto}
            photo={photo}
            onLikeToggle={() => handleLike(photo.idFoto, photo.userLiked)}
            isAuthenticated={isAuthenticated}
          />
        ))}
      </div>
          {/* Paginación */}
          <div className="flex justify-center mt-8 gap-2">
            <Button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              variant="outline"
            >
              Anterior
            </Button>
            <span className="self-center">Página {page + 1} de {totalPages}</span>
            <Button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              variant="outline"
            >
              Siguiente
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;