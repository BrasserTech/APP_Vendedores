import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext'; // Importe o Provider
import { Sidebar } from './components/Sidebar';
import { BottomMenu } from './components/BottomMenu';
import { Dashboard } from './pages/Dashboard';
import { Clients } from './pages/Clients';
import { Ranking } from './pages/Ranking';
import { Products } from './pages/Products';
import { Ideas } from './pages/Ideas';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

// Componente interno que decide o que mostrar
function MainApp() {
  const { user, loading } = useAuth(); // Nossa constante global!
  const [activeTab, setActiveTab] = useState('dashboard');
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  if (loading) {
    return <div className="h-screen flex items-center justify-center bg-slate-50 text-blue-600 font-bold">Carregando...</div>;
  }

  // Se NÃO tem usuário, mostra Login ou Cadastro
  if (!user) {
    if (authView === 'login') return <Login onSwitchToRegister={() => setAuthView('register')} />;
    return <Register onSwitchToLogin={() => setAuthView('login')} />;
  }

  // Se TEM usuário, mostra o sistema normal
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'clients': return <Clients />;
      case 'ranking': return <Ranking />;
      case 'products': return <Products />;
      case 'ideas': return <Ideas />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
      <div className="hidden md:block">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <div className="flex-1 flex flex-col h-full relative w-full">
        <main className="flex-1 overflow-y-auto scroll-smooth w-full">
          <div className="mx-auto max-w-5xl w-full">
             {renderContent()}
          </div>
        </main>
        <BottomMenu activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}

// O App principal apenas fornece o contexto
export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}