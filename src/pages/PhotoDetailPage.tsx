import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Heart } from "lucide-react";
import { photoService } from "../services/photoService";
import { useAuthStore } from "../stores/authStore";

const PhotoDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [photo, setPhoto] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [userLiked, setUserLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    if (user === undefined) return;
    const fetchPhoto = async () => {
      setLoading(true);
      const res = await photoService.obtenerFoto(Number(id), user?.idUsuario ?? user?.id);
      if (res && res.idFoto) {
        setPhoto(res);
        setUserLiked(res.userLiked);
        setLikesCount(res.likesCount);
      } else {
        setPhoto(null);
      }
      if (photoService.obtenerComentarios) {
        const cRes = await photoService.obtenerComentarios(Number(id));
        setComments(cRes.success && Array.isArray(cRes.data) ? cRes.data : []);
      }
      setLoading(false);
    };
    fetchPhoto();
  }, [id, user]);

  const handleLike = async () => {
    if (!isAuthenticated) return;
    setIsLiking(true);
    try {
      if (userLiked) {
        const res = await photoService.quitarLikeAFoto(Number(id), user.idUsuario ?? user.id);
        if (res.success) {
          setUserLiked(false);
          setLikesCount(res.likesCount);
        }
      } else {
        const res = await photoService.darLikeAFoto(Number(id), user.idUsuario ?? user.id);
        if (res.success) {
          setUserLiked(true);
          setLikesCount(res.likesCount);
        }
      }
    } finally {
      setIsLiking(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !isAuthenticated) return;
    setCommentLoading(true);
    if (photoService.subirComentario) {
      const res = await photoService.subirComentario(
        Number(id),
        commentText,
        user.idUsuario ?? user.id
      );
      if (res.success) {
        setComments((prev) => [...prev, res.data]);
        setCommentText("");
      }
    }
    setCommentLoading(false);
  };

  if (loading) return <div className="p-8">Cargando...</div>;
  if (!photo) return <div className="p-8">Foto no encontrada.</div>;

  return (
    <div className="relative flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Botón de volver */}
      <button
        onClick={() => navigate("/explore")}
        className="absolute top-6 left-6 z-10 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 shadow"
      >
        ← Atrás
      </button>

      {/* Foto */}
      <div className="w-full md:flex-1 flex justify-center items-center bg-black">
        <div className="bg-white rounded-lg shadow-lg p-6 m-4 border border-gray-300 flex justify-center items-center w-full md:w-auto">
          <img
            src={photo.url}
            alt={photo.descripcion || "Foto"}
            className="max-h-[60vh] max-w-full object-contain"
          />
        </div>
      </div>

      {/* Comentarios y detalles */}
      <div className="w-full md:max-w-md bg-white border-t md:border-t-0 md:border-l border-gray-200 flex flex-col">
        {/* Header */}
        <div className="flex items-center px-4 py-3 border-b">
          <div className="h-9 w-9 rounded-full bg-primary-200 flex items-center justify-center text-primary-700">
            {photo.nombreUsuario?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">@{photo.nombreUsuario}</p>
            <p className="text-xs text-gray-500">
              {photo.fechaPublicacion
                ? formatDistanceToNow(new Date(photo.fechaPublicacion), { addSuffix: true, locale: es })
                : ""}
            </p>
          </div>
        </div>

        {/* Comentarios */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
          <p className="text-gray-700 font-medium">{photo.descripcion}</p>
          {comments.length === 0 && (
            <div className="text-gray-400 text-sm">No hay comentarios aún.</div>
          )}
          {comments.map((c) => (
            <div key={c.idComentario} className="flex items-start space-x-3">
              <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                {c.nombreUsuario?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <span className="font-semibold text-sm text-gray-800">@{c.nombreUsuario}</span>
                <span className="ml-2 text-gray-700 text-sm">{c.contenido}</span>
                <div className="text-xs text-gray-400 mt-1">
                  {c.fechaPublicacion
                    ? formatDistanceToNow(new Date(c.fechaPublicacion), { addSuffix: true, locale: es })
                    : ""}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Likes y comentar */}
        <div className="border-t p-4">
          <div className="flex items-center mb-4">
            <button
              className={`mr-3 ${userLiked ? "text-accent-500" : "text-gray-400 hover:text-accent-500"}`}
              onClick={handleLike}
              disabled={!isAuthenticated || isLiking}
              aria-label={userLiked ? 'Quitar me gusta' : 'Dar me gusta'}
            >
              <Heart className={`h-6 w-6 ${userLiked ? "fill-current" : ""}`} />
            </button>
            <span className="text-sm text-gray-700">{likesCount} me gusta</span>
          </div>
          <form onSubmit={handleCommentSubmit} className="flex space-x-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
              placeholder="Añade un comentario..."
              disabled={!isAuthenticated}
            />
            <button
              type="submit"
              disabled={!commentText.trim() || !isAuthenticated || commentLoading}
              className="bg-primary-500 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-primary-600 disabled:opacity-50"
            >
              Publicar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PhotoDetailPage;
