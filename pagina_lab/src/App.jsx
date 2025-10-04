import "./App.css";
import Add from "./components/Add";
import Header from "./components/Header";
import Inicio from "./components/Inicio";
import AddExperimento from "./components/AddExperimento";
import ListaExperimentos from "./components/ListaExperimentos";
import DetalleExperimento from "./components/DetalleExperimento";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/add" element={<Add />} />
          <Route path="/experimentos" element={<ListaExperimentos />} />
          <Route path="/experimentos/añadir" element={<AddExperimento />} />
          <Route path="/experimentos/:id" element={<DetalleExperimento />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
