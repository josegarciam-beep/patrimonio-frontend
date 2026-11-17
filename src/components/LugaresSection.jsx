import { useEffect, useState } from "react";
import { API_URL } from "../api";

function LugaresSection() {
  const [lugares, setLugares] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

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
    cargar();
  }, []);

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
          </tr>
        </thead>
        <tbody>
          {lugares.map((l) => (
            <tr key={l.id}>
              <td>{l.nombre}</td>
              <td>{l.direccion}</td>
              <td>{nombreCategoria(l.categoria)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default LugaresSection;