import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AuthModal({ onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
        if (isLogin) {
            // --- LÓGICA DE LOGIN ---
            const API_URL = import.meta.env.VITE_API_URL;
            const response = await axios.post(`${API_URL}/auth/login`, {
                email: formData.email,
                password: formData.password
            });

            // 1. Guardar el token y usuario
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            // 2. Cerrar el modal
            onClose();

            // 3. Redirigir al dashboard
            navigate('/dashboard'); 

        } else {
            // --- LÓGICA DE REGISTRO ---
            const API_URL = import.meta.env.VITE_API_URL;
            const response = await axios.post(`${API_URL}/auth/register`, {
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password
            });

            alert(response.data.message); 
            setIsLogin(true); // Cambia al login
            setFormData({ ...formData, password: '', fullName: '' }); // Limpia contraseña y nombre
        }
    } catch (error) {
        alert(error.response?.data?.message || 'Error al conectar con el servidor');
    }
  };

  const handleSocialLogin = (provider) => {
    alert(`Para usar ${provider} necesitas configurar las API Keys en el backend y frontend.`);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
      
      <div className="bg-white rounded-3xl w-full max-w-md p-8 relative shadow-2xl transition-all scale-100 opacity-100">
        
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-900 transition text-2xl cursor-pointer p-1"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-center mb-6 text-gray-950">
          {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">Nombre completo</label>
              <input 
                type="text" 
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required={!isLogin}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-100 focus:border-primary outline-none transition text-base" 
                placeholder="Juan Pérez" 
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Correo electrónico</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-100 focus:border-primary outline-none transition text-base" 
              placeholder="tu@email.com" 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Contraseña</label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-100 focus:border-primary outline-none transition text-base" 
              placeholder="••••••••" 
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-primary text-white font-bold rounded-xl px-4 py-3 hover:bg-emerald-600 transition cursor-pointer text-base shadow-md hover:shadow-primary/30 mt-2"
          >
            {isLogin ? 'Entrar' : 'Registrarse'}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between">
          <span className="border-b border-gray-200 w-1/4"></span>
          <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">O continúa con</span>
          <span className="border-b border-gray-200 w-1/4"></span>
        </div>

        <div className="flex gap-4 mt-6">
          <button 
            type="button"
            onClick={() => handleSocialLogin('Google')}
            className="w-full border border-gray-300 text-gray-700 font-semibold rounded-xl px-4 py-2.5 hover:bg-gray-50 transition flex justify-center items-center cursor-pointer text-sm shadow-sm"
          >
             Google
          </button>
          <button 
            type="button"
            onClick={() => handleSocialLogin('Facebook')}
            className="w-full border border-gray-300 text-gray-700 font-semibold rounded-xl px-4 py-2.5 hover:bg-gray-50 transition flex justify-center items-center cursor-pointer text-sm shadow-sm"
          >
            Facebook
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-8">
          {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary font-bold ml-1 hover:underline cursor-pointer"
          >
            {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
          </button>
        </p>
      </div>
    </div>
  );
}