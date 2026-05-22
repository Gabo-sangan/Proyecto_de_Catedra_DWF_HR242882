import { useState, useEffect } from 'react';
import { getMovimientos, getProductos, registrarEntrada, registrarSalida } from '../services/api';
import { ArrowDownCircle, ArrowUpCircle, BarChart3 } from 'lucide-react';

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="font-display text-lg font-semibold text-white mb-5">{title}</h2>
        {children}
      </div>
    </div>
  );
}

export default function Inventario() {
  const [movimientos, setMovimientos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ productoId: '', cantidad: '', descripcion: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const cargar = () => {
    getMovimientos().then(r => setMovimientos(r.data.data || []));
    getProductos().then(r => setProductos(r.data.data || []));
  };
  useEffect(() => { cargar(); }, []);

  const openModal = (tipo) => { setForm({ productoId: '', cantidad: '', descripcion: '' }); setError(''); setModal(tipo); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    const payload = { productoId: parseInt(form.productoId), cantidad: parseInt(form.cantidad), descripcion: form.descripcion };
    try {
      if (modal === 'entrada') await registrarEntrada(payload);
      else await registrarSalida(payload);
      cargar(); setModal(null);
    } catch (err) { setError(err.response?.data?.message || 'Error al registrar'); }
    finally { setLoading(false); }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Inventario</h1>
          <p className="text-slate-400 mt-1">Historial de movimientos de stock</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => openModal('entrada')} className="btn-primary bg-emerald-600 hover:bg-emerald-500"><ArrowDownCircle className="w-4 h-4" /> Entrada</button>
          <button onClick={() => openModal('salida')} className="btn-primary bg-red-600 hover:bg-red-500"><ArrowUpCircle className="w-4 h-4" /> Salida</button>
        </div>
      </div>
      <div className="card overflow-hidden p-0">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-sky-400" />
          <h2 className="font-semibold text-white text-sm">Últimos Movimientos</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-left">
                <th className="px-5 py-3 text-slate-400 font-medium">Tipo</th>
                <th className="px-5 py-3 text-slate-400 font-medium">Producto</th>
                <th className="px-5 py-3 text-slate-400 font-medium">Cantidad</th>
                <th className="px-5 py-3 text-slate-400 font-medium">Descripción</th>
                <th className="px-5 py-3 text-slate-400 font-medium">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {movimientos.length === 0 ? (
                <tr><td colSpan="5" className="px-5 py-10 text-center text-slate-400">No hay movimientos registrados</td></tr>
              ) : [...movimientos].reverse().map(m => (
                <tr key={m.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-3">
                    {m.tipoMovimiento === 'ENTRADA'
                      ? <span className="flex items-center gap-1.5 text-emerald-400"><ArrowDownCircle className="w-4 h-4" /> Entrada</span>
                      : <span className="flex items-center gap-1.5 text-red-400"><ArrowUpCircle className="w-4 h-4" /> Salida</span>}
                  </td>
                  <td className="px-5 py-3 font-medium text-white">{m.producto?.nombre}</td>
                  <td className="px-5 py-3 text-white font-semibold">{m.cantidad}</td>
                  <td className="px-5 py-3 text-slate-400">{m.descripcion || '—'}</td>
                  <td className="px-5 py-3 text-slate-400 text-xs">{new Date(m.fechaMovimiento).toLocaleString('es-SV')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {modal && (
        <Modal title={modal === 'entrada' ? '📦 Registrar Entrada' : '📤 Registrar Salida'} onClose={() => setModal(null)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-lg px-3 py-2">{error}</p>}
            <div><label className="text-sm text-slate-300 block mb-1">Producto</label>
              <select className="input-field" value={form.productoId} onChange={e => setForm({...form, productoId: e.target.value})} required>
                <option value="">Seleccionar producto...</option>
                {productos.map(p => <option key={p.id} value={p.id}>{p.nombre} (Stock: {p.stock})</option>)}
              </select>
            </div>
            <div><label className="text-sm text-slate-300 block mb-1">Cantidad</label>
              <input type="number" min="1" className="input-field" value={form.cantidad} onChange={e => setForm({...form, cantidad: e.target.value})} required />
            </div>
            <div><label className="text-sm text-slate-300 block mb-1">Descripción (opcional)</label>
              <input className="input-field" placeholder="Ej: Compra a proveedor..." value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} />
            </div>
            <div className="flex gap-3 pt-1">
              <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">{loading ? 'Registrando...' : `Registrar ${modal === 'entrada' ? 'Entrada' : 'Salida'}`}</button>
              <button type="button" onClick={() => setModal(null)} className="btn-secondary">Cancelar</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
