import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Heart, MessageCircle, MoreHorizontal, Flag, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { useAuthStore } from '../../stores/authStore';
import { photoService } from '../../services/photoService';

const PhotoCard = ({ photo, onLikeToggle, onDelete }) => {
  const { user, isAuthenticated } = useAuthStore();

  const [userLiked, setUserLiked] = useState(photo.userLiked ?? false);
  const [likesCount, setLikesCount] = useState(photo.likesCount ?? 0);
  const [isLiking, setIsLiking] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const username = photo.nombreUsuario || 'Usuario';
  const avatarLetter = username.charAt(0)?.toUpperCase() || 'U';
  const userId = photo.idUsuario;
  const photoId = photo.idFoto;
  const isOwnPhoto = user?.id === userId || user?.idUsuario === userId;

  useEffect(() => {
    if (user?.idUsuario && photoId) {
      photoService.userLiked(photoId, user.idUsuario).then(liked => {
        setUserLiked(liked);
      });
    } else {
      setUserLiked(false);
    }
  }, [photoId, user?.idUsuario]);

  const handleLike = async () => {
    if (!isAuthenticated) return;
    if (isLiking) return;
    setIsLiking(true);
    let result;
    try {
      if (userLiked) {
        result = await photoService.quitarLikeAFoto(photoId, user.idUsuario ?? user.id);
      } else {
        result = await photoService.darLikeAFoto(photoId, user.idUsuario ?? user.id);
      }
      if (result.success) {
        const liked = await photoService.userLiked(photoId, user.idUsuario ?? user.id);
        setUserLiked(liked);
        setLikesCount(result.likesCount);
        if (onLikeToggle) {
          onLikeToggle(photoId, liked, result.likesCount);
        }
      }
    } catch (e) {
      await Swal.fire('Error', 'No se pudo actualizar el like.', 'error');
    } finally {
      setIsLiking(false);
    }
  };

  const handleReport = async () => {
    if (!isAuthenticated) return;
    const { value: motivo } = await Swal.fire({
      title: 'Reportar foto',
      input: 'textarea',
      inputLabel: 'Motivo del reporte',
      inputPlaceholder: 'Describe por qué reportas esta foto...',
      inputAttributes: { 'aria-label': 'Motivo del reporte' },
      showCancelButton: true,
      confirmButtonText: 'Enviar reporte',
      cancelButtonText: 'Cancelar',
      inputValidator: value => !value && 'Por favor, escribe un motivo'
    });

    if (motivo) {
      const response = await photoService.reportarFoto({
        idReportador: user.idUsuario ?? user.id,
        idDenunciado: userId,
        motivo,
        idFoto: photo.idFoto
      });
      if (response.success) {
        await Swal.fire('¡Reporte enviado!', 'Gracias por ayudarnos a mantener la comunidad segura.', 'success');
      } else {
        await Swal.fire('Error', response.message || 'No se pudo enviar el reporte.', 'error');
      }
    }
  };

  const handleDelete = async () => {
    if (!isAuthenticated || !isOwnPhoto) return;

    const result = await Swal.fire({
      title: '¿Eliminar la foto?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e3342f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      setIsDeleting(true);
      try {
        const response = await photoService.eliminarFoto(photoId);
        if (response && response.success) {
          if (onDelete) onDelete(photoId);
          await Swal.fire('¡Eliminada!', 'La foto ha sido eliminada.', 'success');
          window.location.reload();
        } else {
          await Swal.fire('Error', response?.message || 'Error al eliminar la foto.', 'error');
        }
      } catch (e) {
        await Swal.fire('Error', 'Ha ocurrido un error al eliminar la foto.', 'error');
      } finally {
        setIsDeleting(false);
      }
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
                  onClick={() => {
                    setShowActions(false);
                    handleReport();
                  }}
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
          className="w-full object-cover h-64 sm:h-96 cursor-pointer"
          loading="lazy"
        />
      </Link>
      <div className="p-4">
        <div className="flex items-center">
          <button
            onClick={handleLike}
            disabled={isLiking}
            className={`flex items-center mr-4 ${userLiked ? 'text-accent-500' : 'text-gray-500 hover:text-accent-500'
              }`}
            aria-label={userLiked ? 'Quitar me gusta' : 'Dar me gusta'}
          >
            <Heart className={`h-5 w-5 ${userLiked ? 'fill-current' : ''}`} />
            <span className="ml-1 text-sm">{likesCount}</span>
          </button>
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