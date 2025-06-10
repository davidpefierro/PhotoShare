import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PhotoCard from "../components/photo/PhotoCard";

type UsuarioDTO = {
  idUsuario: number;
  nombre: string;
  apellidos: string;
  nombreUsuario: string;
  correo: string;
};

type Photo = {
  id: number;
  userId: number;
  username: string;
  url: string;
  description?: string;
  datePosted: string;
  likesCount: number;
  commentsCount: number;
  userLiked: boolean;
};

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UsuarioDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photosLoading, setPhotosLoading] = useState(true);

  // Cargar datos del usuario
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${process.env.REACT_APP_API_URL || ""}/api/usuarios/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar el usuario");
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, [id]);

  // Cargar fotos del usuario
  useEffect(() => {
    if (!id) return;
    setPhotosLoading(true);
    fetch(`${process.env.REACT_APP_API_URL || ""}/api/fotos/usuario/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("No se pudieron cargar las fotos");
        return res.json();
      })
      .then((data) => {
        setPhotos(data);
        setPhotosLoading(false);
      })
      .catch(() => setPhotosLoading(false));
  }, [id]);

  if (loading) return <div>Cargando perfil...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No se encontró el usuario.</div>;

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow">
      <div className="flex flex-col items-center">
        <div className="h-20 w-20 rounded-full bg-primary-200 flex items-center justify-center text-4xl text-primary-700 mb-4">
          {user.nombreUsuario.charAt(0).toUpperCase()}
        </div>
        <h2 className="text-2xl font-bold">{user.nombreUsuario}</h2>
        <p className="text-gray-600">{user.nombre} {user.apellidos}</p>
        <p className="text-gray-500">{user.correo}</p>
      </div>

      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4 text-center">Fotos subidas</h3>
        {photosLoading ? (
          <div>Cargando fotos...</div>
        ) : photos.length === 0 ? (
          <div className="text-gray-400 text-center">Este usuario no ha subido fotos aún.</div>
        ) : (
          <div className="space-y-6">
            {photos.map((photo) => (
              <PhotoCard key={photo.id} photo={photo} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;