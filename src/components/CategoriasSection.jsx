import { useEffect, useState } from "react";
import { API_URL } from "../api";

function CategoriasSection() {
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  async function cargar() {
    try {
      setCargando(true);
      setError(null);

      const respuesta = await fetch(`${API_URL}/categorias/`);

      if (!respuesta.ok) {
        throw new Error("Error " + respuesta.status);
      }

      const datos = await respuesta.json();
      setCategorias(datos);
    } catch (e) {
      setError("No se pudieron cargar las categorías: " + e.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  async function crear(evento) {
    evento.preventDefault();

    try {
      setError(null);

      const respuesta = await fetch(`${API_URL}/categorias/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, descripcion }),
      });

      if (!respuesta.ok) {
        throw new Error("Error " + respuesta.status);
      }

      const nueva = await respuesta.json();
      setCategorias([...categorias, nueva]);
      setNombre("");
      setDescripcion("");
    } catch (e) {
      setError("No se pudo crear la categoría: " + e.message);
    }
  }

  async function eliminar(id) {
    try {
      setError(null);

      const respuesta = await fetch(`${API_URL}/categorias/${id}/`, {
        method: "DELETE",
      });

      if (!respuesta.ok) {
        throw new Error("Error " + respuesta.status);
      }

      setCategorias(categorias.filter((c) => c.id !== id));
    } catch (e) {
      setError("No se pudo eliminar: " + e.message);
    }
  }

  return (
    <section>
      <h2>Categorías</h2>

      {error && <p className="error">{error}</p>}
      {cargando && <p>Cargando...</p>}

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {categorias.map((c) => (
            <tr key={c.id}>
              <td>{c.nombre}</td>
              <td>{c.descripcion}</td>
              <td>
                <button onClick={() => eliminar(c.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <form onSubmit={crear}>
        <input
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <input
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />

        <button type="submit">Crear categoría</button>
      </form>
    </section>
  );
}

export default CategoriasSection;