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

type Foto = {
  idFoto: number;
  url: string;
  descripcion: string;
  fechaPublicacion: string;
  nombreUsuario: string;
  idUsuario: number;
  // Ajusta los campos extras si tu DTO los tiene
};

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UsuarioDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [photos, setPhotos] = useState<Foto[]>([]);
  const [photosLoading, setPhotosLoading] = useState(true);

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

  useEffect(() => {
    if (!id) return;
    setPhotosLoading(true);
    fetch(`${process.env.REACT_APP_API_URL || ""}/api/fotografias/user/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("No se pudieron cargar las fotos");
        return res.json();
      })
      .then((data) => {
        // El backend retorna { content: [array de fotos], ... }
        if (Array.isArray(data)) {
          setPhotos(data);
        } else if (Array.isArray(data.content)) {
          setPhotos(data.content);
        } else {
          setPhotos([]);
        }
        setPhotosLoading(false);
      })
      .catch(() => setPhotosLoading(false));
  }, [id]);

  if (loading) return <div>Cargando perfil...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No se encontró el usuario.</div>;

  return (
    <div className="w-full md:w-1/2 max-w-3xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <div className="flex flex-col items-center">
        <div className="h-20 w-20 rounded-full bg-primary-200 flex items-center justify-center text-4xl text-primary-700 mb-4">
          {user.nombreUsuario.charAt(0).toUpperCase()}
        </div>
        <h2 className="text-2xl font-bold">{user.nombreUsuario}</h2>
        <p className="text-gray-600">{user.nombre} {user.apellidos}</p>
        <p className="text-gray-500">{user.correo}</p>
      </div>

      {/* FOTOS DEL USUARIO */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Fotos subidas</h3>
        {photosLoading ? (
          <div>Cargando fotos...</div>
        ) : photos.length === 0 ? (
          <div className="text-gray-500">Este usuario no ha subido fotos todavía.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {photos.map((photo) => (
              <PhotoCard key={photo.idFoto} photo={photo} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;