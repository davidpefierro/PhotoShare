import React from 'react';
import { useParams } from 'react-router-dom';

export default function ConversationPage() {
  const { idUsuario } = useParams();

  // Datos de ejemplo
  const mensajes = [
    { de: 'yo', texto: '¡Hola! ¿Cómo estás?' },
    { de: 'ellos', texto: '¡Hola! Muy bien, ¿y tú?' },
    { de: 'yo', texto: 'Bien también, ¿qué tal tu día?' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="w-full max-w-lg bg-white rounded shadow p-4 flex flex-col">
        <h1 className="text-2xl font-bold mb-4">Conversación con usuario #{idUsuario}</h1>
        <div className="flex-1 mb-4 space-y-2">
          {mensajes.map((msg, idx) => (
            <div
              key={idx}
              className={`p-2 rounded ${msg.de === 'yo' ? 'bg-blue-100 self-end' : 'bg-gray-200 self-start'
                } w-fit max-w-xs`}
            >
              {msg.texto}
            </div>
          ))}
        </div>
        <form className="flex gap-2 mt-4">
          <input className="border px-4 py-2 rounded flex-1" placeholder="Escribe un mensaje..." />
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Enviar</button>
        </form>
      </div>
    </div>
  );
}