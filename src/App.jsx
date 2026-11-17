import CategoriasSection from "./components/CategoriasSection";
import LugaresSection from "./components/LugaresSection";
import ResenasSection from "./components/ResenasSection";
function App() {
  return (
    <div className="contenedor">
      <h1>Ruta Patrimonio Popayán</h1>
      <CategoriasSection />
      <LugaresSection />
      <ResenasSection />
      
    </div>
  );
}

export default App;

