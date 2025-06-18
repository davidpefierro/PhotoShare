import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Camera, Heart, MessageCircle, User, LogOut, Settings, Menu, X } from 'lucide-react';
import Button from '../ui/Button';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Función utilitaria para proteger el acceso a charAt
function getFirstLetter(str) {
  return typeof str === "string" && str.length > 0 ? str.charAt(0).toUpperCase() : "?";
}

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (isAuthenticated && user?.idUsuario) {
        try {
          const res = await fetch(`http://localhost:8080/api/mensajes/conversaciones/${user.idUsuario}`);
          const data = await res.json();
          const count = data.filter((m) => m.estado === "No_visto" && m.idDestinatario === user.idUsuario).length;
          setUnreadMessages(count);
        } catch (err) {
          console.error("Error al obtener mensajes no leídos:", err);
        }
      }
    };

    fetchUnreadCount();
    // Consultar nuevos mensajes cada 30 segundos
    const interval = setInterval(fetchUnreadCount, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Camera className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">PhotoShare</span>
            </Link>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/upload"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Subir
                </Link>
                <Link
                  to="/explore"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/explore'
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:text-primary-600'
                    }`}
                >
                  Explorar
                </Link>
                <div className="relative">
                  <Link
                    to="/messages"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/messages'
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:text-primary-600'
                      }`}
                  >
                    <MessageCircle className="h-5 w-5 inline-block" />
                    {unreadMessages > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-accent-500 rounded-full">
                        {unreadMessages > 9 ? '9+' : unreadMessages}
                      </span>
                    )}
                  </Link>
                </div>
                <div className="relative ml-3 flex items-center space-x-3">
                  {/* Botón solo para administradores */}
                  {user?.rol === "Administrador" && (
                    <Link
                      to="/admin/users"
                      className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1"
                      title="Administrar usuarios"
                    >
                      <User className="h-5 w-5" />
                      Admin
                    </Link>
                  )}

                  <Link
                    to={`/profile/${user?.idUsuario}`}
                    className="flex items-center text-sm font-medium text-gray-700 hover:text-primary-600"
                  >
                    <div className="h-8 w-8 rounded-full bg-primary-200 flex items-center justify-center text-primary-700">
                      <i className="fa-solid fa-user text-lg"></i>
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-red-600"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Registrarse
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {isAuthenticated ? (
              <>
                <Link
                  to="/upload"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                  onClick={closeMobileMenu}
                >
                  Subir
                </Link>
                <Link
                  to="/explore"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                  onClick={closeMobileMenu}
                >
                  Explorar
                </Link>
                <Link
                  to="/messages"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                  onClick={closeMobileMenu}
                >
                  Mensajes
                  {unreadMessages > 0 && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent-100 text-accent-800">
                      {unreadMessages}
                    </span>
                  )}
                </Link>
                {/* Botón solo para administradores en menú móvil */}
                {user?.rol === "Administrador" && (
                  <Link
                    to="/admin/users"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                    onClick={closeMobileMenu}
                  >
                    Admin
                  </Link>
                )}

                <Link
                  to={`/profile/${user?.idUsuario}`}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                  onClick={closeMobileMenu}
                >
                  Perfil
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    closeMobileMenu();
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                  onClick={closeMobileMenu}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                  onClick={closeMobileMenu}
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;