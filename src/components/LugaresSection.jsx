import { useEffect, useState } from "react";
import { API_URL } from "../api";

function LugaresSection({ versionCategorias, onCambio }) {
  const [lugares, setLugares] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    direccion: "",
    categoria: "",
  });

  async function cargar() {
    try {
      setCargando(true);
      setError(null);
      const [resLugares, resCategorias] = await Promise.all([
        fetch(`${API_URL}/lugares/`),
        fetch(`${API_URL}/categorias/`),
      ]);
      if (!resLugares.ok || !resCategorias.ok) {
        throw new Error("La API respondió con error");
      }
      setLugares(await resLugares.json());
      setCategorias(await resCategorias.json());
    } catch (e) {
      setError("No se pudieron cargar los lugares: " + e.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    const temporizador = window.setTimeout(() => { void cargar(); }, 0);
    return () => window.clearTimeout(temporizador);
  }, [versionCategorias]);

  function cambiar(evento) {
    setForm({ ...form, [evento.target.name]: evento.target.value });
  }

  async function crear(evento) {
    evento.preventDefault();
    try {
      setError(null);
      const respuesta = await fetch(`${API_URL}/lugares/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          categoria: Number(form.categoria),
        }),
      });
      if (!respuesta.ok) throw new Error("Error " + respuesta.status);
      const nuevo = await respuesta.json();
      setLugares([...lugares, nuevo]);
      onCambio();
      setForm({ nombre: "", descripcion: "", direccion: "", categoria: "" });
    } catch (e) {
      setError("No se pudo crear el lugar: " + e.message);
    }
  }

  async function eliminar(id) {
    try {
      setError(null);
      const respuesta = await fetch(`${API_URL}/lugares/${id}/`, {
        method: "DELETE",
      });
      if (!respuesta.ok) throw new Error("Error " + respuesta.status);
      setLugares(lugares.filter((l) => l.id !== id));
      onCambio();
    } catch (e) {
      setError("No se pudo eliminar: " + e.message);
    }
  }

  function nombreCategoria(id) {
    const cat = categorias.find((c) => c.id === id);
    return cat ? cat.nombre : "—";
  }

  return (
    <section>
      <h2>Lugares</h2>
      {error && <p className="error">{error}</p>}
      {cargando && <p>Cargando...</p>}
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Categoría</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {lugares.map((l) => (
            <tr key={l.id}>
              <td>{l.nombre}</td>
              <td>{l.direccion}</td>
              <td>{nombreCategoria(l.categoria)}</td>
              <td>
                <button onClick={() => eliminar(l.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <form onSubmit={crear}>
        <input
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={cambiar}
          required
        />
        <input
          name="descripcion"
          placeholder="Descripción"
          value={form.descripcion}
          onChange={cambiar}
        />
        <input
          name="direccion"
          placeholder="Dirección"
          value={form.direccion}
          onChange={cambiar}
        />
        <select
          name="categoria"
          value={form.categoria}
          onChange={cambiar}
          required
        >
          <option value="">Selecciona una categoría</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
        <button type="submit">Crear lugar</button>
      </form>
    </section>
  );
}

export default LugaresSection;
