import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Reservas from '../components/Reservas'; // Importamos el nuevo componente

export default function Dashboard() {
  const navigate = useNavigate();
  
  const [user] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Si es cliente (role_id 3), su pestaña por defecto es 'reservas'
  const [activeTab, setActiveTab] = useState(user?.role_id === 3 ? 'reservas' : 'dashboard');

  useEffect(() => {
    if (!user || !localStorage.getItem('token')) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  if (!user) return null;

  const isAdmin = user.role_id === 1;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      
      {/* --- SIDEBAR DINÁMICO --- */}
      <aside className="w-64 bg-emerald-900 text-white hidden md:flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-emerald-800">
          La 14 <span className="text-emerald-400">App</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {/* Módulos solo para ADMIN */}
          {isAdmin && (
            <>
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center p-3 rounded-xl transition text-left ${activeTab === 'dashboard' ? 'bg-emerald-800 shadow-inner' : 'hover:bg-emerald-800/50'}`}
              >
                <span className="mr-3">📊</span> Dashboard
              </button>
              <button className="w-full flex items-center p-3 hover:bg-emerald-800/50 rounded-xl transition text-left">
                <span className="mr-3">⚽</span> Canchas
              </button>
            </>
          )}

          {/* Módulo para TODOS (Admin y Cliente) */}
          <button 
            onClick={() => setActiveTab('reservas')}
            className={`w-full flex items-center p-3 rounded-xl transition text-left ${activeTab === 'reservas' ? 'bg-emerald-800 shadow-inner' : 'hover:bg-emerald-800/50'}`}
          >
            <span className="mr-3">📅</span> {isAdmin ? 'Gestión Reservas' : 'Mis Reservas'}
          </button>

          {/* Módulos solo para ADMIN */}
          {isAdmin && (
            <button className="w-full flex items-center p-3 hover:bg-emerald-800/50 rounded-xl transition text-left">
              <span className="mr-3">👥</span> Usuarios
            </button>
          )}
        </nav>

        <div className="p-4 border-t border-emerald-800">
          <button onClick={handleLogout} className="w-full flex items-center p-3 hover:bg-red-600 rounded-xl transition text-left">
            <span className="mr-3">🚪</span> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8">
          <h1 className="text-xl font-semibold text-gray-800 capitalize">{activeTab}</h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-500">{isAdmin ? 'Administrador' : 'Cliente'}</p>
            </div>
            <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold">
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* VISTA: DASHBOARD (Solo Admin) */}
          {activeTab === 'dashboard' && isAdmin && (
            <div className="animate-fade-in">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Resumen de Operaciones</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                  <p className="text-gray-500 text-sm font-medium">Reservas Hoy</p>
                  <h3 className="text-3xl font-bold text-gray-900">12</h3>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                  <p className="text-gray-500 text-sm font-medium">Canchas Ocupadas</p>
                  <h3 className="text-3xl font-bold text-gray-900">85%</h3>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                  <p className="text-gray-500 text-sm font-medium">Ingresos</p>
                  <h3 className="text-3xl font-bold text-gray-900">$450.000</h3>
                </div>
              </div>
            </div>
          )}

          {/* VISTA: RESERVAS (Visible para ambos) */}
          {activeTab === 'reservas' && <Reservas />}
        </div>
      </main>
    </div>
  );
}