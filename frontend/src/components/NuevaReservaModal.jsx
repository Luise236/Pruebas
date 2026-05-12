import { useState, useEffect } from 'react';
import axios from 'axios';

export default function NuevaReservaModal({ onClose, onSuccess }) {
  // Obtenemos la fecha de hoy en formato YYYY-MM-DD
  const fechaHoy = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    cancha: '',
    fecha: fechaHoy, // Valor por defecto
    hora: ''
  });

  const [canchasDisponibles, setCanchasDisponibles] = useState([]);

 useEffect(() => {
  const fetchCanchas = async () => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL;
      
      // ✅ CAMBIO: Usar axios.get en lugar de axios.post
      const response = await axios.get(`${API_URL}/courts`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("Datos de canchas obtenidos:", response.data);
      
      if (Array.isArray(response.data)) {
        setCanchasDisponibles(response.data);
      } else if (response.data.courts || response.data.data) {
        setCanchasDisponibles(response.data.courts || response.data.data);
      }
      
    } catch (error) {
      console.error("Error al cargar las canchas:", error);
      // No lances el alert de inmediato para no molestar al usuario si hay un re-render
    }
  };
  fetchCanchas(); // No olvides llamar a la función
}, []); // Asegúrate de tener el array de dependencias vacío
 

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Función auxiliar para calcular la hora de fin para la UI y la BD
  const calcularHoraFin = (horaInicio) => {
    if (!horaInicio) return '';
    const [hora, minutos] = horaInicio.split(':');
    let nextHour = parseInt(hora, 10) + 1;
    const formattedNextHour = nextHour < 10 ? `0${nextHour}` : nextHour;
    return `${formattedNextHour}:${minutos}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const token = localStorage.getItem('token');
        
        // 1. Calcular end_time basado en la selección
        const end_time_calculado = calcularHoraFin(formData.hora);

        // 2. Dar formato TIME para MySQL (HH:mm:ss)
        const start_time = `${formData.hora}:00`;
        const end_time = `${end_time_calculado}:00`;

        // 3. Enviar los datos correctos
         const API_URL = import.meta.env.VITE_API_URL;
          await axios.post(`${API_URL}/reservations`, {
            court_id: formData.cancha,
            fecha: formData.fecha,
            start_time: start_time,
            end_time: end_time
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (onSuccess) onSuccess(); // Refresca la tabla
        onClose();   // Cierra el modal
    } catch (error) {
        console.error("Detalles del error:", error);
        alert(error.response?.data?.message || "Error al guardar la reserva");
    }
  };

  const horariosDisponibles = [
    '18:00', '19:00', '20:00', '21:00', '22:00'
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
      <div className="bg-white rounded-3xl w-full max-w-md p-8 relative shadow-2xl animate-fade-in-modal">
        
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-900 transition text-2xl cursor-pointer p-1"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-center mb-6 text-gray-950">
          Nueva Reserva
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Cancha</label>
            <select 
              name="cancha"
              value={formData.cancha}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-100 focus:border-primary outline-none transition text-base bg-white cursor-pointer"
            >
              <option value="" disabled>Selecciona una cancha...</option>
              {canchasDisponibles.map(cancha => (
                <option key={cancha.id} value={cancha.id}>
                  {cancha.name || cancha.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Fecha</label>
            <input 
              type="date" 
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              required
              min={fechaHoy} 
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-100 focus:border-primary outline-none transition text-base cursor-pointer" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">Hora de inicio</label>
              <select 
                name="hora"
                value={formData.hora}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-100 focus:border-primary outline-none transition text-base bg-white cursor-pointer"
              >
                <option value="" disabled>Inicio...</option>
                {horariosDisponibles.map(hora => (
                  <option key={hora} value={hora}>{hora}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">Hora de fin</label>
              <input 
                type="text" 
                value={calcularHoraFin(formData.hora) || '--:--'}
                disabled
                className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-gray-500 outline-none transition text-base cursor-not-allowed" 
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-primary text-white font-bold rounded-xl px-4 py-3.5 hover:bg-emerald-600 transition cursor-pointer text-base shadow-md hover:shadow-primary/30 mt-4"
          >
            Confirmar Reserva
          </button>
        </form>

      </div>
    </div>
  );
}