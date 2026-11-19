import { useEffect, useState } from "react";
import { API_URL } from "../api";

function CategoriasSection({ onCambio }) {
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const [editando, setEditando] = useState(null);
  const [nuevoNombre, setNuevoNombre] = useState("");

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
    const temporizador = window.setTimeout(() => { void cargar(); }, 0);
    return () => window.clearTimeout(temporizador);
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
      onCambio();
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
      onCambio();
    } catch (e) {
      setError("No se pudo eliminar: " + e.message);
    }
  }

  async function editar(id, cambios) {
    try {
      setError(null);

      const respuesta = await fetch(`${API_URL}/categorias/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cambios),
      });

      if (!respuesta.ok) {
        throw new Error("Error " + respuesta.status);
      }

      const actualizada = await respuesta.json();
      setEditando(null);
      setCategorias(categorias.map((c) => (c.id === id ? actualizada : c)));
      onCambio();
    } catch (e) {
      setError("No se pudo editar: " + e.message);
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
                <button
                  onClick={() => {
                    setEditando(c.id);
                    setNuevoNombre(c.nombre);
                  }}
                >
                  Editar
                </button>
                <button onClick={() => eliminar(c.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editando !== null && (
        <form onSubmit={(evento) => {
          evento.preventDefault();
          if (nuevoNombre.trim()) editar(editando, { nombre: nuevoNombre.trim() });
        }}>
          <label htmlFor="editar-categoria">Nuevo nombre de categoría</label>
          <input
            id="editar-categoria"
            value={nuevoNombre}
            onChange={(evento) => setNuevoNombre(evento.target.value)}
            maxLength={100}
            required
          />
          <button type="submit">Guardar cambios</button>
          <button type="button" onClick={() => setEditando(null)}>Cancelar</button>
        </form>
      )}

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
