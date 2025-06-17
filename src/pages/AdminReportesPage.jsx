import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

export default function AdminReportesPage() {
  const [reportes, setReportes] = useState([]);
  const [usuarios, setUsuarios] = useState({});
  const navigate = useNavigate();

  // Paso 1: Cargar reportes y obtener los usuarios relacionados
  useEffect(() => {
    fetch("http://localhost:8080/api/reportes")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setReportes(data);

          // Obtener todos los IDs únicos de reportador y denunciado
          const ids = Array.from(new Set(
            data.flatMap(r => [r.idReportador, r.idDenunciado])
          ));

          // Para cada ID, hacer fetch si aún no lo tenemos
          ids.forEach(id => {
            if (id && !usuarios[id]) {
              fetch(`http://localhost:8080/api/usuarios/${id}`)
                .then(res => res.json())
                .then(user => {
                  setUsuarios(prev => ({
                    ...prev,
                    [id]: user.nombreUsuario
                  }));
                });
            }
          });
        } else {
          console.error("Respuesta inesperada:", data);
          setReportes([]);
        }
      })
      .catch(err => console.error("Error al cargar reportes:", err));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resolverReporte = (idReporte) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Este reporte se marcará como resuelto",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, confirmar",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:8080/api/reportes/${idReporte}/resolver`, {
          method: "PUT",
        })
          .then((res) => {
            if (res.ok) {
              Swal.fire("Resuelto", "Reporte actualizado", "success");
              setReportes((prev) =>
                prev.map((r) =>
                  r.idReporte === idReporte ? { ...r, estado: "Resuelto" } : r
                )
              );
            } else {
              Swal.fire("Error", "No se pudo actualizar el reporte", "error");
            }
          })
          .catch(() => Swal.fire("Error", "Error de conexión", "error"));
      }
    });
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-6xl mx-auto bg-white rounded shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestión de reportes</h1>
          <button
            onClick={() => navigate("/admin/users")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Volver a usuarios
          </button>
        </div>

        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Reportador</th>
              <th className="px-4 py-2 text-left">Denunciado</th>
              <th className="px-4 py-2 text-left">Motivo</th>
              <th className="px-4 py-2 text-left">Contenido</th>
              <th className="px-4 py-2 text-left">Estado</th>
              <th className="px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reportes.map((reporte) => (
              <tr key={reporte.idReporte} className="border-t">
                <td className="px-4 py-2">{reporte.idReporte}</td>
                <td className="px-4 py-2">
                  {usuarios[reporte.idReportador]
                    ? <>@{usuarios[reporte.idReportador]}</>
                    : <span className="text-gray-400 italic">Cargando...</span>
                  }
                </td>
                <td className="px-4 py-2">
                  {usuarios[reporte.idDenunciado]
                    ? <>@{usuarios[reporte.idDenunciado]}</>
                    : <span className="text-gray-400 italic">Cargando...</span>
                  }
                </td>
                <td className="px-4 py-2 max-w-[200px] break-words">{reporte.motivo}</td>
                <td className="px-4 py-2">{reporte.tipoContenido}</td>
                <td className="px-4 py-2">{reporte.estado}</td>
                <td className="px-4 py-2 space-x-2">
                  {reporte.estado === "Pendiente" && (
                    <>
                      {/* Ajusta aquí: Link a la foto usando el idFoto */}
                      {reporte.idFoto ? (
                        <Link
                          to={`/fotografias/${reporte.idFoto}`}
                          className="bg-gray-300 hover:bg-gray-400 text-sm px-2 py-1 rounded inline-block text-center"
                        >
                          Ir a imagen
                        </Link>
                      ) : (
                        <span className="text-gray-400 italic">Sin foto</span>
                      )}
                      <button
                        onClick={() => resolverReporte(reporte.idReporte)}
                        className="bg-green-500 hover:bg-green-600 text-white text-sm px-2 py-1 rounded"
                      >
                        Aceptar
                      </button>
                      <button
                        onClick={() => resolverReporte(reporte.idReporte)}
                        className="bg-red-500 hover:bg-red-600 text-white text-sm px-2 py-1 rounded"
                      >
                        Rechazar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}