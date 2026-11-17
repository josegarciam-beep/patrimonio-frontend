import { useEffect, useState } from "react";
import { API_URL } from "../api";

function ResenasSection() {
  const [resenas, setResenas] = useState([]);
  const [lugares, setLugares] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    lugar: "",
    autor: "",
    comentario: "",
    calificacion: 5,
  });

  async function cargar() {
    try {
      setCargando(true);
      setError(null);
      const [resResenas, resLugares] = await Promise.all([
        fetch(`${API_URL}/resenas/`),
        fetch(`${API_URL}/lugares/`),
      ]);
      if (!resResenas.ok || !resLugares.ok) {
        throw new Error("La API respondió con error");
      }
      setResenas(await resResenas.json());
      setLugares(await resLugares.json());
    } catch (e) {
      setError("No se pudieron cargar las reseñas: " + e.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  function cambiar(evento) {
    setForm({ ...form, [evento.target.name]: evento.target.value });
  }

  async function crear(evento) {
    evento.preventDefault();
    try {
      setError(null);
      const respuesta = await fetch(`${API_URL}/resenas/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          lugar: Number(form.lugar),
          calificacion: Number(form.calificacion),
        }),
      });
      if (!respuesta.ok) throw new Error("Error " + respuesta.status);
      const nueva = await respuesta.json();
      setResenas([...resenas, nueva]);
      setForm({ lugar: "", autor: "", comentario: "", calificacion: 5 });
    } catch (e) {
      setError("No se pudo crear la reseña: " + e.message);
    }
  }

  async function eliminar(id) {
    try {
      setError(null);
      const respuesta = await fetch(`${API_URL}/resenas/${id}/`, {
        method: "DELETE",
      });
      if (!respuesta.ok) throw new Error("Error " + respuesta.status);
      setResenas(resenas.filter((r) => r.id !== id));
    } catch (e) {
      setError("No se pudo eliminar: " + e.message);
    }
  }

  function nombreLugar(id) {
    const lugar = lugares.find((l) => l.id === id);
    return lugar ? lugar.nombre : "—";
  }

  return (
    <section>
      <h2>Reseñas</h2>

      {error && <p className="error">{error}</p>}
      {cargando && <p>Cargando...</p>}

      <table>
        <thead>
          <tr>
            <th>Lugar</th>
            <th>Autor</th>
            <th>Comentario</th>
            <th>Calificación</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {resenas.map((r) => (
            <tr key={r.id}>
              <td>{nombreLugar(r.lugar)}</td>
              <td>{r.autor}</td>
              <td>{r.comentario}</td>
              <td>{r.calificacion}</td>
              <td>
                <button onClick={() => eliminar(r.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <form onSubmit={crear}>
        <select name="lugar" value={form.lugar} onChange={cambiar} required>
          <option value="">Selecciona un lugar</option>
          {lugares.map((l) => (
            <option key={l.id} value={l.id}>{l.nombre}</option>
          ))}
        </select>
        <input name="autor" placeholder="Tu nombre" value={form.autor} onChange={cambiar} required />
        <textarea name="comentario" placeholder="Comentario" value={form.comentario} onChange={cambiar} required />
        <input name="calificacion" type="number" min="1" max="5" value={form.calificacion} onChange={cambiar} required />
        <button type="submit">Crear reseña</button>
      </form>
    </section>
  );
}

export default ResenasSection;