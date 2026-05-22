import { useState, useEffect } from 'react';
import { getProductos, getCategorias, crearProducto, actualizarProducto, eliminarProducto } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Plus, Pencil, Trash2, Search, Package } from 'lucide-react';

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

const emptyForm = { nombre: '', categoriaId: '', precio: '', stock: '', stockMinimo: '5', descripcion: '' };

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [modal, setModal] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [busqueda, setBusqueda] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { isAdmin } = useAuth();

  const cargar = () => {
    getProductos().then(r => setProductos(r.data.data || []));
    getCategorias().then(r => setCategorias(r.data.data || []));
  };
  useEffect(() => { cargar(); }, []);

  const openCrear = () => { setForm(emptyForm); setError(''); setModal('crear'); };
  const openEditar = (p) => {
    setEditTarget(p);
    setForm({ nombre: p.nombre, categoriaId: p.categoria?.id || '', precio: p.precio, stock: p.stock, stockMinimo: p.stockMinimo, descripcion: p.descripcion || '' });
    setError(''); setModal('editar');
  };
  const closeModal = () => { setModal(null); setEditTarget(null); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    const payload = { nombre: form.nombre, categoria: { id: parseInt(form.categoriaId) }, precio: parseFloat(form.precio), stock: parseInt(form.stock), stockMinimo: parseInt(form.stockMinimo), descripcion: form.descripcion };
    try {
      if (modal === 'crear') await crearProducto(payload);
      else await actualizarProducto(editTarget.id, payload);
      cargar(); closeModal();
    } catch (err) { setError(err.response?.data?.message || 'Error al guardar'); }
    finally { setLoading(false); }
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar este producto?')) return;
    try { await eliminarProducto(id); cargar(); }
    catch (err) { alert(err.response?.data?.message || 'Error al eliminar'); }
  };

  const filtrados = productos.filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase()));

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Productos</h1>
          <p className="text-slate-400 mt-1">{productos.length} productos registrados</p>
        </div>
        {isAdmin() && <button onClick={openCrear} className="btn-primary"><Plus className="w-4 h-4" /> Nuevo Producto</button>}
      </div>
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input className="input-field pl-9" placeholder="Buscar productos..." value={busqueda} onChange={e => setBusqueda(e.target.value)} />
      </div>
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-left">
                <th className="px-5 py-3 text-slate-400 font-medium">Producto</th>
                <th className="px-5 py-3 text-slate-400 font-medium">Categoría</th>
                <th className="px-5 py-3 text-slate-400 font-medium">Precio</th>
                <th className="px-5 py-3 text-slate-400 font-medium">Stock</th>
                <th className="px-5 py-3 text-slate-400 font-medium">Estado</th>
                {isAdmin() && <th className="px-5 py-3 text-slate-400 font-medium">Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {filtrados.length === 0 ? (
                <tr><td colSpan="6" className="px-5 py-10 text-center text-slate-400">No se encontraron productos</td></tr>
              ) : filtrados.map(p => (
                <tr key={p.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-sky-500/10 rounded-lg flex items-center justify-center">
                        <Package className="w-4 h-4 text-sky-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{p.nombre}</p>
                        {p.descripcion && <p className="text-xs text-slate-500">{p.descripcion}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-300">{p.categoria?.nombre || '—'}</td>
                  <td className="px-5 py-3 text-emerald-400 font-medium">${parseFloat(p.precio).toFixed(2)}</td>
                  <td className="px-5 py-3 text-white font-medium">{p.stock}</td>
                  <td className="px-5 py-3">
                    {p.stock <= p.stockMinimo ? <span className="badge-low-stock">Stock bajo</span> : <span className="badge-ok">OK</span>}
                  </td>
                  {isAdmin() && (
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEditar(p)} className="p-1.5 text-slate-400 hover:text-sky-400 hover:bg-sky-500/10 rounded-lg transition-all"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => handleEliminar(p.id)} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {modal && (
        <Modal title={modal === 'crear' ? 'Nuevo Producto' : 'Editar Producto'} onClose={closeModal}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-lg px-3 py-2">{error}</p>}
            <div><label className="text-sm text-slate-300 block mb-1">Nombre</label><input className="input-field" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required /></div>
            <div><label className="text-sm text-slate-300 block mb-1">Categoría</label>
              <select className="input-field" value={form.categoriaId} onChange={e => setForm({...form, categoriaId: e.target.value})} required>
                <option value="">Seleccionar...</option>
                {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-sm text-slate-300 block mb-1">Precio ($)</label><input type="number" step="0.01" min="0.01" className="input-field" value={form.precio} onChange={e => setForm({...form, precio: e.target.value})} required /></div>
              <div><label className="text-sm text-slate-300 block mb-1">Stock</label><input type="number" min="0" className="input-field" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} required /></div>
            </div>
            <div><label className="text-sm text-slate-300 block mb-1">Stock Mínimo</label><input type="number" min="0" className="input-field" value={form.stockMinimo} onChange={e => setForm({...form, stockMinimo: e.target.value})} /></div>
            <div><label className="text-sm text-slate-300 block mb-1">Descripción</label><textarea className="input-field" rows="2" value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} /></div>
            <div className="flex gap-3 pt-1">
              <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">{loading ? 'Guardando...' : modal === 'crear' ? 'Crear' : 'Actualizar'}</button>
              <button type="button" onClick={closeModal} className="btn-secondary">Cancelar</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
