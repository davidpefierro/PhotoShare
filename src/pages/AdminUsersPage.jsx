import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminUsersPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/usuarios')
      .then(response => {
        setUsuarios(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener usuarios:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
        Cargando usuarios...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white rounded shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Administrar usuarios</h1>
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="text-left px-4 py-2">ID</th>
              <th className="text-left px-4 py-2">Nombre</th>
              <th className="text-left px-4 py-2">Usuario</th>
              <th className="text-left px-4 py-2">Email</th>
              <th className="text-left px-4 py-2">Rol</th>
              <th className="text-left px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.idUsuario}>
                <td className="border-t px-4 py-2">{u.idUsuario}</td>
                <td className="border-t px-4 py-2">{u.nombre} {u.apellidos}</td>
                <td className="border-t px-4 py-2">{u.nombreUsuario}</td>
                <td className="border-t px-4 py-2">{u.correo}</td>
                <td className="border-t px-4 py-2">{u.rol}</td>
                <td className="border-t px-4 py-2">
                  <button className="bg-yellow-500 text-white px-2 py-1 mr-2 rounded hover:bg-yellow-600">Editar</button>
                  <button className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}