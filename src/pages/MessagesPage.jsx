import React from 'react';
import { Link } from 'react-router-dom';

export default function MessagesPage() {
  // Ejemplo de conversaciones
  const conversaciones = [
    { idUsuario: 2, nombre: 'Carlos', ultimoMensaje: 'Nos vemos mañana!' },
    { idUsuario: 3, nombre: 'Ana', ultimoMensaje: '¡Gracias por la foto!' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white rounded shadow p-4">
        <h1 className="text-2xl font-bold mb-4">Mensajes</h1>
        <ul>
          {conversaciones.map((conv) => (
            <li key={conv.idUsuario} className="mb-3 border-b pb-3 flex justify-between items-center">
              <div>
                <p className="font-semibold">{conv.nombre}</p>
                <p className="text-gray-500 text-sm">{conv.ultimoMensaje}</p>
              </div>
              <Link
                className="text-blue-600 hover:underline"
                to={`/mensajes/${conv.idUsuario}`}
              >
                Ver conversación
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}