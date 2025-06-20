import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useAuthStore } from '../stores/authStore';
import Select from "react-select"; // React Select
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useNavigate } from "react-router-dom";


// Función auxiliar para truncar texto a 13 caracteres
function truncarTexto(texto) {
  if (!texto) return "";
  return texto.length > 13 ? texto.slice(0, 13) + "..." : texto;
}

export default function AdminUsersPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioEditar, setUsuarioEditar] = useState(null);

  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  const [paginaActual, setPaginaActual] = useState(1);
  const USUARIOS_POR_PAGINA = 15;

  const usuarioActual = useAuthStore((state) => state.user);
  const idUsuarioActual = Number(usuarioActual?.idUsuario);
  const navigate = useNavigate();


  useEffect(() => {
    if (idUsuarioActual) {
      obtenerUsuarios();
    }
  }, [idUsuarioActual]);

  const obtenerUsuarios = () => {
    fetch(`http://localhost:8080/api/usuarios?idActual=${idUsuarioActual}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setUsuarios(data);
        } else {
          console.error("Respuesta inesperada:", data);
          setUsuarios([]);
        }
      })
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

  const guardarCambios = () => {
    if (!usuarioEditar) return;

    fetch(`http://localhost:8080/api/usuarios/${usuarioEditar.idUsuario}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usuarioEditar),
    })
      .then((res) => {
        if (res.ok) {
          Swal.fire("Cambios guardados correctamente", "", "success");
          obtenerUsuarios();
          setUsuarioEditar(null);
        } else {
          Swal.fire("Error", "No se pudieron guardar los cambios", "error");
        }
      })
      .catch(() => {
        Swal.fire("Error", "No se pudieron guardar los cambios", "error");
      });
  };

  const usuariosFiltrados = usuarios
    .filter((u) => u.idUsuario !== idUsuarioActual)
    .filter(u =>
      u.nombre.toLowerCase().includes(search.toLowerCase()) ||
      (u.apellidos || "").toLowerCase().includes(search.toLowerCase()) ||
      u.nombreUsuario.toLowerCase().includes(search.toLowerCase()) ||
      u.correo.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => sortAsc ? a.idUsuario - b.idUsuario : b.idUsuario - a.idUsuario);

  const totalPaginas = Math.ceil(usuariosFiltrados.length / USUARIOS_POR_PAGINA);
  const usuariosPaginados = usuariosFiltrados.slice(
    (paginaActual - 1) * USUARIOS_POR_PAGINA,
    paginaActual * USUARIOS_POR_PAGINA
  );

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  if (!idUsuarioActual || isNaN(idUsuarioActual)) {
    return <div className="p-6 text-center">Cargando...</div>;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white rounded shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Administrar usuarios</h1>
          <button
            onClick={() => navigate("/admin/reportes")}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 shadow"
          >
            Ir a reportes
          </button>
        </div>
        {/* <h1 className="text-2xl font-bold mb-6">Administrar usuarios</h1> */}
        <div className="flex gap-4 mb-4 items-center">
          <input
            type="text"
            placeholder="Buscar usuario..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border px-3 py-2 rounded w-full max-w-xs"
          />
          <button
            onClick={() => setSortAsc((prev) => !prev)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Ordenar por ID {sortAsc ? "↑" : "↓"}
          </button>
        </div>
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="text-left px-4 py-2">ID</th>
              <th className="text-left px-4 py-2">Nombre</th>
              <th className="text-left px-4 py-2">Apellidos</th>
              <th className="text-left px-4 py-2">Usuario</th>
              <th className="text-left px-4 py-2">Correo</th>
              <th className="text-left px-4 py-2">Rol</th>
              <th className="text-left px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosPaginados.map((u) => (
              <tr key={u.idUsuario}>
                <td className="border-t px-4 py-2">{u.idUsuario}</td>
                <td className="border-t px-4 py-2 max-w-[130px] min-w-[70px] overflow-hidden whitespace-nowrap text-ellipsis" title={u.nombre}>
                  {truncarTexto(u.nombre)}
                </td>
                <td className="border-t px-4 py-2 max-w-[130px] min-w-[70px] overflow-hidden whitespace-nowrap text-ellipsis" title={u.apellidos || ""}>
                  {truncarTexto(u.apellidos || "")}
                </td>
                <td className="border-t px-4 py-2 max-w-[130px] min-w-[70px] overflow-hidden whitespace-nowrap text-ellipsis" title={u.nombreUsuario}>
                  {truncarTexto(u.nombreUsuario)}
                </td>
                <td className="border-t px-4 py-2 max-w-[130px] min-w-[70px] overflow-hidden whitespace-nowrap text-ellipsis" title={u.correo}>
                  {truncarTexto(u.correo)}
                </td>
                <td className="border-t px-4 py-2 max-w-[130px] min-w-[70px] overflow-hidden whitespace-nowrap text-ellipsis" title={u.rol}>
                  {truncarTexto(u.rol)}
                </td>
                <td className="border-t px-4 py-2">
                  <div className="flex items-center gap-2">
                    <button
                      title="Editar"
                      className="text-yellow-500 hover:text-yellow-700 text-xl focus:outline-none"
                      onClick={() => setUsuarioEditar(u)}
                    >
                      <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button
                      title="Eliminar"
                      className="text-red-600 hover:text-red-800 text-xl focus:outline-none"
                      onClick={() => eliminarUsuario(u.idUsuario)}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Paginación */}
        <div className="flex justify-center items-center mt-6 gap-2">
          <button
            onClick={() => cambiarPagina(paginaActual - 1)}
            disabled={paginaActual === 1}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Anterior
          </button>
          <span>Página {paginaActual} de {totalPaginas}</span>
          <button
            onClick={() => cambiarPagina(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>

      {/* Modal de edición */}
      {usuarioEditar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Editar usuario</h2>
            <div className="mb-4">
              <label className="block mb-1">Nombre:</label>
              <input
                type="text"
                value={usuarioEditar.nombre}
                onChange={(e) => setUsuarioEditar({ ...usuarioEditar, nombre: e.target.value })}
                className="border px-3 py-2 w-full rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Apellidos:</label>
              <input
                type="text"
                value={usuarioEditar.apellidos || ""}
                onChange={(e) => setUsuarioEditar({ ...usuarioEditar, apellidos: e.target.value })}
                className="border px-3 py-2 w-full rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Nombre de usuario:</label>
              <input
                type="text"
                value={usuarioEditar.nombreUsuario}
                onChange={(e) => setUsuarioEditar({ ...usuarioEditar, nombreUsuario: e.target.value })}
                className="border px-3 py-2 w-full rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Correo:</label>
              <input
                type="email"
                value={usuarioEditar.correo}
                onChange={(e) => setUsuarioEditar({ ...usuarioEditar, correo: e.target.value })}
                className="border px-3 py-2 w-full rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Rol:</label>
              <select
                value={usuarioEditar.rol}
                onChange={(e) => setUsuarioEditar({ ...usuarioEditar, rol: e.target.value })}
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
                onChange={(e) => setUsuarioEditar({ ...usuarioEditar, estado: e.target.value })}
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