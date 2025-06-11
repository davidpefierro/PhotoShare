import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Heart, MessageCircle, MoreHorizontal, Flag, Trash2 } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { usePhotoStore } from '../../stores/photoStore';
import { photoService } from '../../services/photoService';

const PhotoCard = ({ photo, onLike, onDelete }) => {
  const [showActions, setShowActions] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const toggleLike = usePhotoStore((state) => state.toggleLike);

  // Usa el nombre de usuario y el id del usuario del backend directamente
  const username = photo.nombreUsuario || 'Usuario';
  const avatarLetter = username.charAt(0)?.toUpperCase() || 'U';
  const userId = photo.idUsuario; // CORREGIDO: ahora usa el campo correcto de la API
  const photoId = photo.idFoto;   // Usamos idFoto en vez de id_foto

  const isOwnPhoto = user?.id === userId || user?.idUsuario === userId;

  const handleLike = () => {
    if (!isAuthenticated) return;
    toggleLike(photoId);
    if (onLike) onLike(photoId);
  };

  const handleDelete = async () => {
    if (!isAuthenticated || !isOwnPhoto) return;
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta foto?')) return;
    setIsDeleting(true);
    try {
      const response = await photoService.deletePhoto(photoId);
      if (response.success && onDelete) onDelete(photoId);
      else alert('Error al eliminar la foto.');
    } catch {
      alert('Ha ocurrido un error al eliminar la foto');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-fade-in">
      <div className="p-4 flex items-center">
        <Link to={`/profile/${userId}`} className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-primary-200 flex items-center justify-center text-primary-700">
            {avatarLetter}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">@{username}</p>
            <p className="text-xs text-gray-500">
              {photo.fecha_publicacion
                ? formatDistanceToNow(new Date(photo.fecha_publicacion), { addSuffix: true, locale: es })
                : ''}
            </p>
          </div>
        </Link>
        <div className="ml-auto relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>
          {showActions && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 ring-1 ring-black ring-opacity-5">
              {isOwnPhoto ? (
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex items-center w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isDeleting ? 'Eliminando...' : 'Eliminar Foto'}
                </button>
              ) : (
                <button
                  onClick={() => setShowActions(false)}
                  className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                >
                  <Flag className="h-4 w-4 mr-2" />
                  Reportar Foto
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <Link to={`/fotografias/${photoId}`}>
        <img
          src={photo.url}
          alt={photo.descripcion || 'Foto'}
          className="w-full object-cover h-64 sm:h-96"
          loading="lazy"
        />
      </Link>
      <div className="p-4">
        <div className="flex items-center">
          <button
            onClick={handleLike}
            className={`flex items-center mr-4 ${
              photo.userLiked ? 'text-accent-500' : 'text-gray-500 hover:text-accent-500'
            }`}
          >
            <Heart className={`h-5 w-5 ${photo.userLiked ? 'fill-current' : ''}`} />
            <span className="ml-1 text-sm">{photo.likesCount}</span>
          </button>
          <Link
            to={`/fotografias/${photoId}`}
            className="flex items-center text-gray-500 hover:text-primary-500"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="ml-1 text-sm">{photo.commentsCount}</span>
          </Link>
        </div>
        {photo.descripcion && (
          <p className="mt-3 text-sm text-gray-700">{photo.descripcion}</p>
        )}
      </div>
    </div>
  );
};

export default PhotoCard;