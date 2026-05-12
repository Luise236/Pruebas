import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard'; 

function App() {
  return (
    <Router>
      {/* El contenedor principal abarca toda la pantalla */}
      <div className="min-h-screen font-sans bg-gray-50 text-gray-900">
        <Routes>
          {/* Ruta principal: Landing Page (Donde está el botón de Iniciar Sesión) */}
          <Route path="/" element={<Landing />} />
          
          {/* Ruta protegida: Dashboard Principal */}
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;