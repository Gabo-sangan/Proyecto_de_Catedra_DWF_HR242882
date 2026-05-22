import { useState, useEffect } from 'react';
import { getVentas, getProductos, registrarVenta } from '../services/api';
import { ShoppingCart, Plus, Minus, Trash2, Receipt, X } from 'lucide-react';

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
        <h2 className="font-display text-lg font-semibold text-white mb-5">{title}</h2>
        {children}
      </div>
    </div>
  );
}

export default function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [modal, setModal] = useState(false);
  const [carrito, setCarrito] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const cargar = () => {
    getVentas().then(r => setVentas(r.data.data || []));
    getProductos().then(r => setProductos(r.data.data || []));
  };
  useEffect(() => { cargar(); }, []);

  const agregarAlCarrito = () => {
    if (!productoSeleccionado) return;
    const producto = productos.find(p => p.id === parseInt(productoSeleccionado));
    if (!producto) return;
    const existing = carrito.find(c => c.productoId === producto.id);
    if (existing) {
      setCarrito(carrito.map(c => c.productoId === producto.id ? { ...c, cantidad: c.cantidad + 1 } : c));
    } else {
      setCarrito([...carrito, { productoId: producto.id, nombre: producto.nombre, precio: parseFloat(producto.precio), stockDisponible: producto.stock, cantidad: 1 }]);
    }
    setProductoSeleccionado('');
  };

  const cambiarCantidad = (productoId, delta) => {
    setCarrito(carrito.map(c => c.productoId === productoId ? { ...c, cantidad: c.cantidad + delta } : c).filter(c => c.cantidad > 0));
  };

  const total = carrito.reduce((sum, c) => sum + c.precio * c.cantidad, 0);

  const handleVenta = async () => {
    if (carrito.length === 0) { setError('Agrega al menos un producto'); return; }
    setError(''); setLoading(true);
    try {
      await registrarVenta({ detalles: carrito.map(c => ({ productoId: c.productoId, cantidad: c.cantidad })) });
      cargar(); setModal(false); setCarrito([]);
    } catch (err) { setError(err.response?.data?.message || 'Error al registrar venta'); }
    finally { setLoading(false); }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Ventas</h1>
          <p className="text-slate-400 mt-1">{ventas.length} ventas registradas</p>
        </div>
        <button onClick={() => { setCarrito([]); setError(''); setModal(true); }} className="btn-primary">
          <Plus className="w-4 h-4" /> Nueva Venta
        </button>
      </div>
      <div className="card overflow-hidden p-0">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center gap-2">
          <Receipt className="w-4 h-4 text-sky-400" />
          <h2 className="font-semibold text-white text-sm">Historial de Ventas</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-left">
                <th className="px-5 py-3 text-slate-400 font-medium"># Venta</th>
                <th className="px-5 py-3 text-slate-400 font-medium">Fecha</th>
                <th className="px-5 py-3 text-slate-400 font-medium">Productos</th>
                <th className="px-5 py-3 text-slate-400 font-medium">Total</th>
                <th className="px-5 py-3 text-slate-400 font-medium">Atendida por</th>
              </tr>
            </thead>
            <tbody>
              {ventas.length === 0 ? (
                <tr><td colSpan="5" className="px-5 py-10 text-center text-slate-400">No hay ventas registradas</td></tr>
              ) : [...ventas].reverse().map(v => (
                <tr key={v.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-3"><span className="font-mono text-sky-400 font-medium">#{String(v.id).padStart(4, '0')}</span></td>
                  <td className="px-5 py-3 text-slate-400 text-xs">{new Date(v.fecha).toLocaleString('es-SV')}</td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-1">
                      {(v.detalles || []).map(d => (
                        <span key={d.id} className="text-xs bg-slate-800 border border-slate-700 rounded-full px-2 py-0.5 text-slate-300">
                          {d.producto?.nombre} x{d.cantidad}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-emerald-400 font-bold">${parseFloat(v.total).toFixed(2)}</td>
                  <td className="px-5 py-3 text-slate-400 text-xs">{v.usuario?.nombre || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {modal && (
        <Modal title="🛒 Nueva Venta" onClose={() => setModal(false)}>
          <div className="space-y-4">
            {error && <p className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-lg px-3 py-2">{error}</p>}
            <div className="flex gap-2">
              <select className="input-field flex-1" value={productoSeleccionado} onChange={e => setProductoSeleccionado(e.target.value)}>
                <option value="">Seleccionar producto...</option>
                {productos.filter(p => p.stock > 0).map(p => (
                  <option key={p.id} value={p.id}>{p.nombre} — ${parseFloat(p.precio).toFixed(2)} (Stock: {p.stock})</option>
                ))}
              </select>
              <button onClick={agregarAlCarrito} disabled={!productoSeleccionado} className="btn-primary px-3"><Plus className="w-4 h-4" /></button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {carrito.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Sin productos agregados</p>
                </div>
              ) : carrito.map(item => (
                <div key={item.productoId} className="flex items-center justify-between bg-slate-800 rounded-lg px-3 py-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{item.nombre}</p>
                    <p className="text-xs text-slate-400">${item.precio.toFixed(2)} c/u</p>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <button onClick={() => cambiarCantidad(item.productoId, -1)} className="w-6 h-6 rounded bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-slate-300"><Minus className="w-3 h-3" /></button>
                    <span className="text-white font-semibold w-6 text-center text-sm">{item.cantidad}</span>
                    <button onClick={() => cambiarCantidad(item.productoId, 1)} disabled={item.cantidad >= item.stockDisponible} className="w-6 h-6 rounded bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-slate-300 disabled:opacity-40"><Plus className="w-3 h-3" /></button>
                    <span className="text-emerald-400 text-sm font-medium w-16 text-right">${(item.precio * item.cantidad).toFixed(2)}</span>
                    <button onClick={() => setCarrito(carrito.filter(c => c.productoId !== item.productoId))} className="ml-1 text-slate-500 hover:text-red-400 transition-colors"><X className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
            {carrito.length > 0 && (
              <div className="border-t border-slate-700 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-slate-400">Total a cobrar:</span>
                  <span className="text-2xl font-display font-bold text-emerald-400">${total.toFixed(2)}</span>
                </div>
                <button onClick={handleVenta} disabled={loading} className="btn-primary w-full justify-center py-3 bg-emerald-600 hover:bg-emerald-500">
                  {loading ? 'Procesando...' : `Confirmar Venta — $${total.toFixed(2)}`}
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
