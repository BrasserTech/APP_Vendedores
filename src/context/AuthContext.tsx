// Adicionado 'type' antes de ReactNode para corrigir o erro de importação que apareceu no seu print
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { loginManual, registerManual } from '../services/api';

// Define que o usuário TEM um cargo (opcional para evitar quebras)
interface User {
  id: string;
  nome: string;
  email: string;
  cargo?: string; 
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (email: string, senha: string) => Promise<void>;
  signUp: (nome: string, email: string, senha: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStorageData = () => {
      const storedUser = localStorage.getItem('@BrasserTech:user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };
    loadStorageData();
  }, []);

  const signIn = async (email: string, senha: string) => {
    try {
      const userData = await loginManual(email, senha);
      if (userData) {
        // Garante que o cargo seja salvo
        const userWithRole = { ...userData, cargo: userData.cargo || 'Vendedor' };
        setUser(userWithRole);
        localStorage.setItem('@BrasserTech:user', JSON.stringify(userWithRole));
      }
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (nome: string, email: string, senha: string) => {
    try {
      const userData = await registerManual(nome, email, senha);
      const newUser = { ...userData, nome, cargo: 'Vendedor' };
      setUser(newUser);
      localStorage.setItem('@BrasserTech:user', JSON.stringify(newUser));
    } catch (error) {
      throw error;
    }
  };

  const signOut = () => {
    localStorage.removeItem('@BrasserTech:user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);