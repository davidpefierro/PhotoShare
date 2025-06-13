import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import Swal from "sweetalert2";

export default function ChatPrivado() {
  const { idDestino } = useParams();
  const navigate = useNavigate();
  const usuarioActual = useAuthStore((state) => state.user);
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [destinatario, setDestinatario] = useState(null);
  const chatRef = useRef(null);
  const ultimoIdMensajeRef = useRef(null);

  useEffect(() => {
    if (idDestino) {
      fetch(`http://localhost:8080/api/usuarios/${idDestino}`)
        .then(res => res.json())
        .then(data => setDestinatario(data));
    }
  }, [idDestino]);

  const cargarMensajes = () => {
    fetch(`http://localhost:8080/api/mensajes/chat?usuario1=${usuarioActual.idUsuario}&usuario2=${idDestino}`)
      .then(res => res.json())
      .then(data => {
        setMensajes(data);
        data.forEach(m => {
          if (m.idDestinatario === usuarioActual.idUsuario && m.estado === "No_visto") {
            fetch(`http://localhost:8080/api/mensajes/marcar-visto/${m.idMensaje}`, { method: "PUT" });
          }
        });
      });
  };

  useEffect(() => {
    cargarMensajes();
    const interval = setInterval(cargarMensajes, 3000);
    return () => clearInterval(interval);
  }, [idDestino, usuarioActual.idUsuario]);

  useEffect(() => {
    if (!mensajes.length) return;
    const ultimoId = mensajes[mensajes.length - 1].idMensaje;
    if (ultimoId !== ultimoIdMensajeRef.current) {
      chatRef.current?.scrollIntoView({ behavior: "smooth" });
      ultimoIdMensajeRef.current = ultimoId;
    }
  }, [mensajes]);

  const enviar = (e) => {
    e.preventDefault();
    const contenido = nuevoMensaje.trim();
    if (!contenido) return;
    const nuevo = {
      idMensaje: Date.now(),
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
    }).then(() => cargarMensajes());
  };

  const eliminarMensaje = (idMensaje) => {
    Swal.fire({
      title: "¿Eliminar mensaje?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:8080/api/mensajes/${idMensaje}`, {
          method: "DELETE",
        })
          .then((res) => {
            if (res.ok) {
              setMensajes((prev) => prev.filter((m) => m.idMensaje !== idMensaje));
              Swal.fire("Eliminado", "Mensaje eliminado correctamente.", "success");
            } else {
              Swal.fire("Error", "No se pudo eliminar el mensaje.", "error");
            }
          })
          .catch(() => Swal.fire("Error", "Fallo en la conexión con el servidor.", "error"));
      }
    });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 relative">
      <button
        onClick={() => navigate("/messages")}
        className="absolute top-6 left-8 bg-blue-600 text-white border border-blue-700 rounded-full p-2 shadow hover:bg-blue-700"
        title="Volver a bandeja"
      >
        <span className="text-xl">←</span>
      </button>

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
              <div className={`relative px-4 py-2 rounded-2xl max-w-[70%] break-words shadow
                ${msg.idRemitente === usuarioActual.idUsuario
                  ? "bg-blue-500 text-white rounded-br-sm"
                  : "bg-gray-200 text-gray-900 rounded-bl-sm"}
              `}>
                <div>{msg.contenido}</div>
                <div className="text-xs text-gray-300 text-right mt-1">
                  {new Date(msg.fechaEnvio).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
                {msg.idRemitente === usuarioActual.idUsuario && (
                  <button
                    onClick={() => eliminarMensaje(msg.idMensaje)}
                    className="absolute top-0 right-0 text-xs text-red-200 hover:text-white px-2"
                    title="Eliminar"
                  >
                    ✕
                  </button>
                )}
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
