import { useState, useEffect } from 'react';
import { getProductos, getStockBajo, getResumenVentas } from '../services/api';
import { Package, AlertTriangle, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

function StatCard({ icon: Icon, label, value, sub, color = 'sky' }) {
  const colors = {
    sky: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    red: 'text-red-400 bg-red-500/10 border-red-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    violet: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
  };
  return (
    <div className="card flex items-start gap-4">
      <div className={`p-3 rounded-xl border ${colors[color]}`}>
        <Icon className={`w-5 h-5 ${colors[color].split(' ')[0]}`} />
      </div>
      <div>
        <p className="text-slate-400 text-sm">{label}</p>
        <p className="text-2xl font-display font-bold text-white mt-0.5">{value}</p>
        {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [productos, setProductos] = useState([]);
  const [stockBajo, setStockBajo] = useState([]);
  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProductos(), getStockBajo(), getResumenVentas()])
      .then(([p, sb, r]) => {
        setProductos(p.data.data || []);
        setStockBajo(sb.data.data || []);
        setResumen(r.data.data);
      }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const ventasRecientes = resumen?.recientes || [];
  const chartData = ventasRecientes.slice(0, 7).map(v => ({
    name: `#${v.id}`, total: parseFloat(v.total) || 0,
  })).reverse();

  if (loading) return <div className="p-8 flex items-center justify-center h-full"><p className="text-slate-400 animate-pulse">Cargando dashboard...</p></div>;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-1">Resumen del sistema de inventario</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Package} label="Total Productos" value={productos.length} color="sky" />
        <StatCard icon={AlertTriangle} label="Stock Bajo" value={stockBajo.length} sub="Necesitan reabastecimiento" color="red" />
        <StatCard icon={ShoppingCart} label="Total Ventas" value={resumen?.totalVentas ?? 0} color="emerald" />
        <StatCard icon={DollarSign} label="Ventas Hoy" value={`$${parseFloat(resumen?.ventasHoy ?? 0).toFixed(2)}`} color="violet" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-2">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-4 h-4 text-sky-400" />
            <h2 className="font-display font-semibold text-white">Ventas Recientes</h2>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#475569" tick={{ fontSize: 12 }} />
                <YAxis stroke="#475569" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8 }}
                  formatter={(v) => [`$${v.toFixed(2)}`, 'Total']} />
                <Bar dataKey="total" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-slate-500 text-sm">No hay ventas registradas aún</div>
          )}
        </div>
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <h2 className="font-display font-semibold text-white">Alertas de Stock</h2>
          </div>
          {stockBajo.length === 0 ? (
            <p className="text-slate-400 text-sm">✅ Todo el inventario está bien</p>
          ) : (
            <div className="space-y-2">
              {stockBajo.map(p => (
                <div key={p.id} className="flex items-center justify-between p-2 bg-red-900/10 border border-red-900/30 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-white">{p.nombre}</p>
                    <p className="text-xs text-slate-400">{p.categoria?.nombre}</p>
                  </div>
                  <span className="badge-low-stock">{p.stock} uds</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
