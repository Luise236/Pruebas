import { useState } from 'react';
import AuthModal from '../components/AuthModal';

export default function Landing() {
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <nav className="flex justify-between items-center p-6 bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-primary">CanchaGO</h1>
        <button 
          onClick={() => setAuthModalOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition"
        >
          Iniciar Sesión
        </button>
      </nav>

      <main className="text-center py-20 px-4">
        <h2 className="text-5xl font-extrabold text-gray-900 mb-6">
          Reserva tu cancha sintética en segundos
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Consulta disponibilidad, reserva y acumula puntos para jugar gratis.
        </p>
        <button 
          onClick={() => setAuthModalOpen(true)}
          className="bg-gray-900 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-800 transition"
        >
          Ver disponibilidad
        </button>
      </main>

      {isAuthModalOpen && <AuthModal onClose={() => setAuthModalOpen(false)} />}
    </div>
  );
}