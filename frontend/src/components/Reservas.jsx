import { useState, useEffect } from 'react';
import axios from 'axios';
import NuevaReservaModal from './NuevaReservaModal';

export default function Reservas() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reservas, setReservas] = useState([]);
  const [canchas, setCanchas] = useState([]); // Nuevo estado para guardar las canchas
  
  // 1. Creamos un disparador para recargar la tabla
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    // Variable para evitar actualizar el estado si cambiamos de pantalla rápido
    let isMounted = true; 

    // 2. Definimos la función DENTRO del useEffect para que ESLint esté feliz
    const fetchDatos = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return; 

        // Traemos tanto las reservas como el listado de canchas en paralelo
        const [responseReservas, responseCanchas] = await Promise.all([
          axios.get('http://localhost:3000/api/reservations', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:3000/api/courts', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        
        // 3. Solo actualizamos el estado si el componente sigue montado
        if (isMounted) {
          setReservas(responseReservas.data);
          
          // Captura segura de los datos de canchas
          const datosCanchas = Array.isArray(responseCanchas.data) 
            ? responseCanchas.data 
            : responseCanchas.data.courts || responseCanchas.data.data || [];
            
          setCanchas(datosCanchas);
        }
      } catch (error) {
        console.error("Error al cargar datos", error);
      }
    };

    fetchDatos();

    // Cleanup function: se ejecuta al desmontar el componente
    return () => {
      isMounted = false;
    };
  }, [refreshCount]); // 4. El useEffect se dispara cuando 'refreshCount' cambia

  // Función para obtener el nombre de la cancha a partir del ID
  const getNombreCancha = (court_id) => {
    const canchaEncontrada = canchas.find((c) => c.id === court_id);
    if (canchaEncontrada) {
      return canchaEncontrada.name || canchaEncontrada.nombre;
    }
    return `Cancha ${court_id}`; // Fallback por si no se encuentra
  };

  // Función que se dispara cuando el modal guarda con éxito
  const handleReservaExitosa = () => {
    setRefreshCount((prev) => prev + 1); // Sumar 1 recarga la tabla
  };

  return (
    <div className="animate-fade-in relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Mis Reservas</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold shadow-md hover:bg-emerald-600 transition cursor-pointer"
        >
          + Nueva Reserva
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Cancha</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Fecha</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Hora Inicio</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Hora Fin</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reservas.map((reserva) => (
              <tr key={reserva.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {getNombreCancha(reserva.court_id)}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {new Date(reserva.fecha).toLocaleDateString('es-ES', { timeZone: 'UTC' })}
                </td>
                <td className="px-6 py-4 text-gray-600">{reserva.start_time}</td>
                <td className="px-6 py-4 text-gray-600">{reserva.end_time}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                    reserva.status === 'Confirmada' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {reserva.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {reservas.length === 0 && (
          <div className="p-10 text-center text-gray-400">No tienes reservas registradas.</div>
        )}
      </div>

      {isModalOpen && (
        <NuevaReservaModal 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={handleReservaExitosa}
        />
      )}
    </div>
  );
}