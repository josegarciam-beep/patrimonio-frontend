import { useState } from "react";
import CategoriasSection from "./components/CategoriasSection";
import LugaresSection from "./components/LugaresSection";
import ResenasSection from "./components/ResenasSection";

function App() {
  const [versionCategorias, setVersionCategorias] = useState(0);
  const [versionLugares, setVersionLugares] = useState(0);

  function actualizarCategorias() {
    setVersionCategorias((version) => version + 1);
    setVersionLugares((version) => version + 1);
  }

  function actualizarLugares() {
    setVersionLugares((version) => version + 1);
  }

  return (
    <div className="contenedor">
      <h1>Ruta Patrimonio Popayán</h1>
      <CategoriasSection onCambio={actualizarCategorias} />
      <LugaresSection versionCategorias={versionCategorias} onCambio={actualizarLugares} />
      <ResenasSection versionLugares={versionLugares} />
    </div>
  );
}

export default App;
