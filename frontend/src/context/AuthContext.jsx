import { createContext, useContext, useState, useEffect } from 'react';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) setUser(JSON.parse(userData));
    setLoading(false);
  }, []);
  const login = (authData) => {
    localStorage.setItem('token', authData.token);
    const userData = { correo: authData.correo, nombre: authData.nombre, rol: authData.rol };
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };
  const logout = () => { localStorage.clear(); setUser(null); };
  const isAdmin = () => user?.rol === 'ADMIN';
  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
