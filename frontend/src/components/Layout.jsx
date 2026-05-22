import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Package, Tags, BarChart3, ShoppingCart, LogOut, Store } from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/productos', icon: Package, label: 'Productos' },
  { to: '/categorias', icon: Tags, label: 'Categorías' },
  { to: '/inventario', icon: BarChart3, label: 'Inventario' },
  { to: '/ventas', icon: ShoppingCart, label: 'Ventas' },
];

export default function Layout() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-sky-500 rounded-lg flex items-center justify-center">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-display font-semibold text-white text-sm">Tienda Sistema</p>
              <p className="text-xs text-slate-400">Inventario v1.0</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label, exact }) => (
            <NavLink key={to} to={to} end={exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                           : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              <Icon className="w-4 h-4" />{label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="mb-3">
            <p className="text-sm font-medium text-white truncate">{user?.nombre}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              isAdmin() ? 'bg-violet-900/50 text-violet-400 border border-violet-800'
                        : 'bg-slate-800 text-slate-400'}`}>
              {user?.rol}
            </span>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all">
            <LogOut className="w-4 h-4" />Cerrar sesión
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto"><Outlet /></main>
    </div>
  );
}
