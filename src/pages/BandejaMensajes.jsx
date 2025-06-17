import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import Select from "react-select"; // <---- NUEVO

export default function BandejaMensajes() {
  const usuarioActual = useAuthStore((state) => state.user);
  const [conversaciones, setConversaciones] = useState([]);
  const [usuarios, setUsuarios] = useState({});
  const [usuariosDisponibles, setUsuariosDisponibles] = useState([]);
  const [destinoSeleccionado, setDestinoSeleccionado] = useState(null); // Cambia a objeto
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:8080/api/mensajes/conversaciones/${usuarioActual.idUsuario}`)
      .then(res => res.json())
      .then(data => {
        setConversaciones(data);

        const ids = Array.from(new Set(
          data.map(msg =>
            msg.idRemitente === usuarioActual.idUsuario ? msg.idDestinatario : msg.idRemitente
          )
        ));

        ids.forEach(id => {
          if (!usuarios[id]) {
            fetch(`http://localhost:8080/api/usuarios/${id}`)
              .then(res => res.json())
              .then(user => {
                setUsuarios(prev => ({ ...prev, [id]: user.nombre }));
              });
          }
        });
      })
      .catch(err => console.error("Error cargando conversaciones:", err));

    fetch(`http://localhost:8080/api/usuarios?idActual=${usuarioActual.idUsuario}`)
      .then(res => res.json())
      .then(data => {
        const filtrados = data.filter(u => u.idUsuario !== usuarioActual.idUsuario);
        setUsuariosDisponibles(filtrados);
      })
      .catch(err => console.error("Error al obtener usuarios disponibles:", err));
  }, [usuarioActual.idUsuario]);

  // Opciones para react-select
  const opcionesUsuarios = usuariosDisponibles.map(u => ({
    value: u.idUsuario,
    label: `@${u.nombreUsuario} (${u.nombre})`
  }));

  const iniciarConversacion = (e) => {
    e.preventDefault();
    if (destinoSeleccionado) {
      navigate(`/mensajes/chat/${destinoSeleccionado.value}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mensajes</h1>

      <form onSubmit={iniciarConversacion} className="mb-6 flex gap-2 items-center">
        <div className="w-full">
          <Select
            options={opcionesUsuarios}
            value={destinoSeleccionado}
            onChange={setDestinoSeleccionado}
            placeholder="Buscar usuario..."
            isClearable
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Ir
        </button>
      </form>

      {conversaciones.length === 0 ? (
        <p>No tienes conversaciones aún.</p>
      ) : (
        <ul className="space-y-4">
          {conversaciones.map((msg) => {
            const otroId = msg.idRemitente === usuarioActual.idUsuario ? msg.idDestinatario : msg.idRemitente;
            const esNoVisto = msg.estado === "No_visto" && msg.idDestinatario === usuarioActual.idUsuario;
            return (
              <li key={msg.idMensaje} className="border p-4 rounded shadow-sm bg-white">
                <Link to={`/mensajes/chat/${otroId}`} className="block">
                  <div className="font-semibold">
                    @{usuarios[otroId] ? usuarios[otroId] : `Usuario #${otroId}`} {" "}
                    {esNoVisto && <span className="text-red-500">●</span>}
                  </div>
                  <div className="text-gray-700 line-clamp-1">{msg.contenido}</div>
                  <div className="text-sm text-gray-500">{new Date(msg.fechaEnvio).toLocaleString()}</div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}