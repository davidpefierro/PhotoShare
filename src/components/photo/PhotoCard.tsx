import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Heart, MessageCircle, MoreHorizontal, Flag, Trash2 } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { photoService } from '../../services/photoService';

const PhotoCard = ({ photo, onLike, onDelete }) => {
  const { user, isAuthenticated } = useAuthStore();

  // Estado local para MG y contador de likes
  const [userLiked, setUserLiked] = useState(photo.userLiked);
  const [likesCount, setLikesCount] = useState(photo.likesCount ?? 0);
  const [isLiking, setIsLiking] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const username = photo.nombreUsuario || 'Usuario';
  const avatarLetter = username.charAt(0)?.toUpperCase() || 'U';
  const userId = photo.idUsuario;
  const photoId = photo.idFoto;
  const isOwnPhoto = user?.id === userId || user?.idUsuario === userId;

  const handleLike = async () => {
    if (!isAuthenticated) return;
    setIsLiking(true);
    try {
      if (userLiked) {
        // Quitar MG
        const res = await photoService.quitarLikeAFoto(photoId, user.idUsuario ?? user.id);
        if (res.success) {
          setUserLiked(false);
          setLikesCount(res.likesCount);
          if (onLike) onLike(photoId, false, res.likesCount);
        }
      } else {
        // Dar MG
        const res = await photoService.darLikeAFoto(photoId, user.idUsuario ?? user.id);
        if (res.success) {
          setUserLiked(true);
          setLikesCount(res.likesCount);
          if (onLike) onLike(photoId, true, res.likesCount);
        }
      }
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    if (!isAuthenticated || !isOwnPhoto) return;
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta foto?')) return;
    setIsDeleting(true);
    try {
      const response = await photoService.eliminarFoto(photoId);
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
              {photo.fechaPublicacion
                ? formatDistanceToNow(new Date(photo.fechaPublicacion), { addSuffix: true, locale: es })
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
      {/* Imagen clickable (detalle) */}
      <Link to={`/fotografias/${photoId}`}>
        <img
          src={photo.url}
          alt={photo.descripcion || 'Foto'}
          className="w-full object-cover h-64 sm:h-96 cursor-pointer"
          loading="lazy"
        />
      </Link>
      <div className="p-4">
        <div className="flex items-center">
          <button
            onClick={handleLike}
            disabled={isLiking}
            className={`flex items-center mr-4 ${
              userLiked ? 'text-accent-500' : 'text-gray-500 hover:text-accent-500'
            }`}
            aria-label={userLiked ? 'Quitar me gusta' : 'Dar me gusta'}
          >
            <Heart className={`h-5 w-5 ${userLiked ? 'fill-current' : ''}`} />
            <span className="ml-1 text-sm">{likesCount}</span>
          </button>
          {/* Comentarios: también clickable */}
          <Link
            to={`/fotografias/${photoId}`}
            className="flex items-center text-gray-500 hover:text-primary-500"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="ml-1 text-sm">{photo.commentsCount ?? 0}</span>
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