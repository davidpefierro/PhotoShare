import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

export default function BandejaMensajes() {
  const usuarioActual = useAuthStore((state) => state.user);
  const [conversaciones, setConversaciones] = useState([]);
  const [usuarios, setUsuarios] = useState({});

  useEffect(() => {
    fetch(`http://localhost:8080/api/mensajes/conversaciones/${usuarioActual.idUsuario}`)
      .then(res => res.json())
      .then(data => {
        setConversaciones(data);

        // Obtener IDs únicos de otros usuarios
        const ids = Array.from(new Set(
          data.map(msg =>
            msg.idRemitente === usuarioActual.idUsuario ? msg.idDestinatario : msg.idRemitente
          )
        ));

        // Solo pedir los que no tengamos ya
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
    // eslint-disable-next-line
  }, [usuarioActual.idUsuario]); // No poner usuarios en deps para evitar bucles

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mensajes</h1>
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
                    @{usuarios[otroId] ? usuarios[otroId] : `Usuario #${otroId}`}{" "}
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