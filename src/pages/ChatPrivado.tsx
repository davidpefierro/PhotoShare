import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

export default function ChatPrivado() {
  const { idDestino } = useParams();
  const usuarioActual = useAuthStore((state) => state.user);
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [destinatario, setDestinatario] = useState(null);
  const chatRef = useRef(null);
  // Guardar el último idMensaje para detectar nuevos mensajes
  const ultimoIdMensajeRef = useRef(null);

  // Cargar datos del destinatario
  useEffect(() => {
    if (idDestino) {
      fetch(`http://localhost:8080/api/usuarios/${idDestino}`)
        .then(res => res.json())
        .then(data => setDestinatario(data));
    }
  }, [idDestino]);

  // Cargar mensajes periódicamente
  useEffect(() => {
    let ignore = false;
    const cargarMensajes = () => {
      fetch(`http://localhost:8080/api/mensajes/chat?usuario1=${usuarioActual.idUsuario}&usuario2=${idDestino}`)
        .then(res => res.json())
        .then(data => {
          if (!ignore) setMensajes(data);
          // marcar como vistos
          data.forEach(m => {
            if (m.idDestinatario === usuarioActual.idUsuario && m.estado === "No_visto") {
              fetch(`http://localhost:8080/api/mensajes/marcar-visto/${m.idMensaje}`, { method: "PUT" });
            }
          });
        });
    };
    cargarMensajes();
    const interval = setInterval(cargarMensajes, 3000);
    return () => { ignore = true; clearInterval(interval); };
  }, [idDestino, usuarioActual.idUsuario]);

  // Autoscroll solo si hay mensaje nuevo
  useEffect(() => {
    if (!mensajes.length) return;
    const ultimoId = mensajes[mensajes.length - 1].idMensaje;
    if (ultimoId !== ultimoIdMensajeRef.current) {
      chatRef.current?.scrollIntoView({ behavior: "smooth" });
      ultimoIdMensajeRef.current = ultimoId;
    }
  }, [mensajes]);

  // Enviar mensaje, añade instantáneamente el mensaje localmente
  const enviar = (e) => {
    e.preventDefault();
    const contenido = nuevoMensaje.trim();
    if (!contenido) return;
    const nuevo = {
      idMensaje: Date.now(), // id temporal para la key
      idRemitente: usuarioActual.idUsuario,
      idDestinatario: Number(idDestino),
      contenido,
      fechaEnvio: new Date().toISOString(),
      estado: "No_visto",
      esLocal: true,
    };
    setMensajes(prev => [...prev, nuevo]);
    setNuevoMensaje("");
    fetch("http://localhost:8080/api/mensajes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idRemitente: usuarioActual.idUsuario,
        idDestinatario: Number(idDestino),
        contenido,
      })
    }).then(() => {
      // Después de enviar, recarga para obtener el mensaje real del server
      fetch(`http://localhost:8080/api/mensajes/chat?usuario1=${usuarioActual.idUsuario}&usuario2=${idDestino}`)
        .then(res => res.json())
        .then(data => setMensajes(data));
    });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white rounded shadow-lg w-1/2 min-w-[320px] flex flex-col h-[80vh] border mx-auto">
        <div className="bg-blue-600 text-white text-lg font-semibold px-4 py-2 rounded-t flex items-center">
          {destinatario ? destinatario.nombre : "Cargando..."}
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-2 flex flex-col gap-2">
          {mensajes.map(msg => (
            <div
              key={msg.idMensaje}
              className={`flex ${msg.idRemitente === usuarioActual.idUsuario ? "justify-end" : "justify-start"}`}
            >
              <div className={`
                px-4 py-2 rounded-2xl
                ${msg.idRemitente === usuarioActual.idUsuario
                  ? "bg-blue-500 text-white rounded-br-sm"
                  : "bg-gray-200 text-gray-900 rounded-bl-sm"}
                max-w-[70%] break-words shadow
              `}>
                <div>{msg.contenido}</div>
                <div className="text-xs text-gray-300 text-right mt-1">
                  {new Date(msg.fechaEnvio).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          ))}
          <div ref={chatRef}></div>
        </div>
        <form onSubmit={enviar} className="p-4 flex gap-2 border-t w-full">
          <input
            value={nuevoMensaje}
            onChange={e => setNuevoMensaje(e.target.value)}
            className="w-0 flex-1 min-w-0 border rounded px-3 py-2"
            placeholder="Escribe un mensaje..."
            autoFocus
          />
          <button className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700 flex-shrink-0">Enviar</button>
        </form>
      </div>
    </div>
  );
}