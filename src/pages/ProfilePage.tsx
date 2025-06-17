import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PhotoCard from "../components/photo/PhotoCard";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { useAuthStore } from "../stores/authStore";

type UsuarioDTO = {
  idUsuario: number;
  nombre: string;
  apellidos: string;
  nombreUsuario: string;
  correo: string;
  // rol?: string; // Inclúyelo solo si lo usas en el frontend
  // estado?: string;
};

type Foto = {
  idFoto: number;
  url: string;
  descripcion: string;
  fechaPublicacion: string;
  nombreUsuario: string;
  idUsuario: number;
};

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UsuarioDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [photos, setPhotos] = useState<Foto[]>([]);
  const [photosLoading, setPhotosLoading] = useState(true);

  // Modal edición
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState<UsuarioDTO | null>(null);

  // Acceso al usuario autenticado
  const authUser = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${import.meta.env.VITE_BACKEND_URL || ""}/api/usuarios/${id}`)
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
    fetch(`${import.meta.env.VITE_BACKEND_URL || ""}/api/fotografias/user/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("No se pudieron cargar las fotos");
        return res.json();
      })
      .then((data) => {
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

  // Modal
  const openEditModal = () => {
    setEditData(user);
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
    setEditData(null);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editData) return;
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editData) return;
    try {
      // Solo mandamos los campos editables
      const { nombre, apellidos, nombreUsuario, correo } = editData;
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || ""}/api/usuarios/${user?.idUsuario}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, apellidos, nombreUsuario, correo }),
      });
      if (!res.ok) throw new Error("Error al actualizar el perfil");
      setUser(editData); // Puedes actualizarlo con lo que devuelva el backend si lo prefieres
      closeEditModal();
      Swal.fire({
        icon: "success",
        title: "Perfil actualizado",
        showConfirmButton: false,
        timer: 1500
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar el perfil"
      });
    }
  };

  if (loading) return <div>Cargando perfil...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No se encontró el usuario.</div>;

  const canEditProfile = authUser && user && authUser.idUsuario === user.idUsuario;

  return (
    <div className="w-full md:w-1/2 max-w-3xl mx-auto mt-8 p-6 bg-white rounded shadow relative">
      {/* Botón editar perfil arriba a la derecha solo si es el usuario autenticado */}
      {canEditProfile && (
        <button
          className="absolute top-0 right-0 mt-4 mr-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center justify-center text-base z-10"
          aria-label="Editar perfil"
          onClick={openEditModal}
        >
          <FontAwesomeIcon icon={faPen} className="w-5 h-5 mr-2" />
          Editar perfil
        </button>
      )}
      <div className="flex flex-col items-center">
        <div className="h-20 w-20 rounded-full bg-primary-200 flex items-center justify-center text-4xl text-primary-700 mb-4">
          {user.nombreUsuario.charAt(0).toUpperCase()}
        </div>
        <h2 className="text-2xl font-bold">{user.nombreUsuario}</h2>
        <p className="text-gray-600">{user.nombre} {user.apellidos}</p>
        <p className="text-gray-500">{user.correo}</p>
      </div>

      {/* MODAL DE EDICIÓN */}
      {isEditOpen && editData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={closeEditModal}
            >✕</button>
            <h3 className="text-lg font-semibold mb-4">Editar perfil</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Nombre:</label>
                <input
                  type="text"
                  name="nombre"
                  value={editData.nombre}
                  onChange={handleEditChange}
                  className="w-full border rounded px-2 py-1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Apellidos:</label>
                <input
                  type="text"
                  name="apellidos"
                  value={editData.apellidos}
                  onChange={handleEditChange}
                  className="w-full border rounded px-2 py-1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Correo:</label>
                <input
                  type="email"
                  name="correo"
                  value={editData.correo}
                  onChange={handleEditChange}
                  className="w-full border rounded px-2 py-1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Nombre de usuario:</label>
                <input
                  type="text"
                  name="nombreUsuario"
                  value={editData.nombreUsuario}
                  onChange={handleEditChange}
                  className="w-full border rounded px-2 py-1"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="mr-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >Cancelar</button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

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