import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginApi } from '../services/api';
import { Store, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [form, setForm] = useState({ correo: '', contrasena: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await loginApi(form);
      login(res.data.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Credenciales incorrectas');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
      </div>
      <div className="w-full max-w-md relative">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-sky-500 rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-sky-500/30">
              <Store className="w-7 h-7 text-white" />
            </div>
            <h1 className="font-display text-2xl font-bold text-white">Bienvenido</h1>
            <p className="text-slate-400 text-sm mt-1">Sistema de Inventario — Tienda</p>
          </div>
          {error && <div className="bg-red-900/30 border border-red-800 text-red-400 text-sm rounded-lg px-4 py-3 mb-5">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm text-slate-300 font-medium block mb-1.5">Correo</label>
              <input type="email" className="input-field" placeholder="admin@tienda.com"
                value={form.correo} onChange={e => setForm({ ...form, correo: e.target.value })} required />
            </div>
            <div>
              <label className="text-sm text-slate-300 font-medium block mb-1.5">Contraseña</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} className="input-field pr-10"
                  placeholder="••••••••" value={form.contrasena}
                  onChange={e => setForm({ ...form, contrasena: e.target.value })} required />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
              {loading ? 'Ingresando...' : 'Iniciar Sesión'}
            </button>
          </form>
          <div className="mt-6 p-4 bg-slate-800/50 rounded-lg text-xs text-slate-400 space-y-1">
            <p className="font-medium text-slate-300 mb-2">Credenciales de prueba:</p>
            <p>Admin: <span className="text-sky-400">admin@tienda.com</span> / admin123</p>
            <p>Empleado: <span className="text-sky-400">empleado@tienda.com</span> / empleado123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
