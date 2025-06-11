import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Heart } from "lucide-react";
import { photoService } from "../../services/photoService";
import { useAuthStore } from "../../stores/authStore";

const PhotoDetailPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuthStore();
  const [photo, setPhoto] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    const fetchPhoto = async () => {
      setLoading(true);
      const res = await photoService.obtenerFoto(Number(id));
      if (res.success && res.data) {
        setPhoto(res.data);
      }
      // Aquí deberías llamar a tu servicio de comentarios
      if (photoService.obtenerComentarios) {
        const cRes = await photoService.obtenerComentarios(Number(id));
        setComments(cRes.success && Array.isArray(cRes.data) ? cRes.data : []);
      }
      setLoading(false);
    };
    fetchPhoto();
    // eslint-disable-next-line
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !isAuthenticated) return;
    setCommentLoading(true);
    if (photoService.subirComentario) {
      const res = await photoService.subirComentario(Number(id), commentText);
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
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 flex justify-center items-center bg-black">
        <img
          src={photo.url}
          alt={photo.descripcion || "Foto"}
          className="max-h-[90vh] max-w-full object-contain"
        />
      </div>
      <div className="w-full max-w-md bg-white border-l border-gray-200 flex flex-col">
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
              className={`mr-3 ${photo.userLiked ? "text-accent-500" : "text-gray-400 hover:text-accent-500"}`}
              // onClick={} // Aquí puedes añadir lógica para like si quieres
            >
              <Heart className={`h-6 w-6 ${photo.userLiked ? "fill-current" : ""}`} />
            </button>
            <span className="text-sm text-gray-700">{photo.likesCount} me gusta</span>
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