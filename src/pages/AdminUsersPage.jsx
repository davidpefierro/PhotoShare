import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function AdminUsersPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioEditar, setUsuarioEditar] = useState(null);

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const obtenerUsuarios = () => {
    fetch("http://localhost:8080/api/usuarios")
      .then((res) => res.json())
      .then((data) => setUsuarios(data))
      .catch((error) => console.error("Error al cargar usuarios:", error));
  };

  const eliminarUsuario = (idUsuario) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:8080/api/usuarios/${idUsuario}`, {
          method: "DELETE",
        })
          .then((res) => {
            if (res.ok) {
              Swal.fire("Eliminado", "Usuario eliminado correctamente", "success");
              setUsuarios((prev) => prev.filter((u) => u.idUsuario !== idUsuario));
            } else {
              Swal.fire("Error", "No se pudo eliminar el usuario", "error");
            }
          })
          .catch(() => Swal.fire("Error", "Error al conectar con el servidor", "error"));
      }
    });
  };

  const abrirModal = (usuario) => {
    setUsuarioEditar(usuario);
  };

  const guardarCambios = () => {
    if (!usuarioEditar) return;

    Promise.all([
      fetch(`http://localhost:8080/api/usuarios/${usuarioEditar.idUsuario}/rol`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuarioEditar.rol),
      }),
      fetch(`http://localhost:8080/api/usuarios/${usuarioEditar.idUsuario}/estado`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuarioEditar.estado),
      }),
    ])
      .then(() => {
        Swal.fire("Actualizado", "Usuario actualizado correctamente", "success");
        obtenerUsuarios();
        setUsuarioEditar(null);
      })
      .catch(() => {
        Swal.fire("Error", "No se pudo actualizar el usuario", "error");
      });
  };

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
              <th className="text-left px-4 py-2">Correo</th>
              <th className="text-left px-4 py-2">Rol</th>
              <th className="text-left px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.idUsuario}>
                <td className="border-t px-4 py-2">{u.idUsuario}</td>
                <td className="border-t px-4 py-2">{u.nombre}</td>
                <td className="border-t px-4 py-2">{u.nombreUsuario}</td>
                <td className="border-t px-4 py-2">{u.correo}</td>
                <td className="border-t px-4 py-2">{u.rol}</td>
                <td className="border-t px-4 py-2">
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 mr-2 rounded hover:bg-yellow-600"
                    onClick={() => abrirModal(u)}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                    onClick={() => eliminarUsuario(u.idUsuario)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {usuarioEditar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Editar usuario</h2>
            <div className="mb-4">
              <label className="block mb-1">Rol:</label>
              <select
                value={usuarioEditar.rol}
                onChange={(e) =>
                  setUsuarioEditar({ ...usuarioEditar, rol: e.target.value })
                }
                className="border px-3 py-2 w-full rounded"
              >
                <option value="Usuario">Usuario</option>
                <option value="Administrador">Administrador</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-1">Estado:</label>
              <select
                value={usuarioEditar.estado || "Activo"}
                onChange={(e) =>
                  setUsuarioEditar({ ...usuarioEditar, estado: e.target.value })
                }
                className="border px-3 py-2 w-full rounded"
              >
                <option value="Activo">Activo</option>
                <option value="Bloqueado">Bloqueado</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setUsuarioEditar(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={guardarCambios}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
