import { useState, useEffect } from 'react';
import { getCategorias, crearCategoria, actualizarCategoria, eliminarCategoria } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Plus, Pencil, Trash2, Tags } from 'lucide-react';

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <h2 className="font-display text-lg font-semibold text-white mb-5">{title}</h2>
        {children}
      </div>
    </div>
  );
}

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [modal, setModal] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { isAdmin } = useAuth();

  const cargar = () => getCategorias().then(r => setCategorias(r.data.data || []));
  useEffect(() => { cargar(); }, []);

  const openCrear = () => { setNombre(''); setError(''); setModal('crear'); };
  const openEditar = (c) => { setEditTarget(c); setNombre(c.nombre); setError(''); setModal('editar'); };
  const closeModal = () => { setModal(null); setEditTarget(null); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      if (modal === 'crear') await crearCategoria({ nombre });
      else await actualizarCategoria(editTarget.id, { nombre });
      cargar(); closeModal();
    } catch (err) { setError(err.response?.data?.message || 'Error al guardar'); }
    finally { setLoading(false); }
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar esta categoría?')) return;
    try { await eliminarCategoria(id); cargar(); }
    catch (err) { alert(err.response?.data?.message || 'Error al eliminar'); }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Categorías</h1>
          <p className="text-slate-400 mt-1">{categorias.length} categorías registradas</p>
        </div>
        {isAdmin() && <button onClick={openCrear} className="btn-primary"><Plus className="w-4 h-4" /> Nueva Categoría</button>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categorias.map(c => (
          <div key={c.id} className="card flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-violet-500/10 border border-violet-500/20 rounded-lg flex items-center justify-center">
                <Tags className="w-4 h-4 text-violet-400" />
              </div>
              <span className="font-medium text-white">{c.nombre}</span>
            </div>
            {isAdmin() && (
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEditar(c)} className="p-1.5 text-slate-400 hover:text-sky-400 hover:bg-sky-500/10 rounded-lg transition-all"><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => handleEliminar(c.id)} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            )}
          </div>
        ))}
      </div>
      {modal && (
        <Modal title={modal === 'crear' ? 'Nueva Categoría' : 'Editar Categoría'} onClose={closeModal}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-lg px-3 py-2">{error}</p>}
            <div><label className="text-sm text-slate-300 block mb-1">Nombre</label>
              <input className="input-field" placeholder="Ej: Bebidas, Snacks..." value={nombre} onChange={e => setNombre(e.target.value)} required />
            </div>
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
