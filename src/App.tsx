import { useState, useEffect } from 'react';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Clients } from './pages/Clients';
import { Products } from './pages/Products';
import { Ideas } from './pages/Ideas';
import { Ranking } from './pages/Ranking';
import { Sales } from './pages/Sales'; // <--- IMPORT NOVO
import { Sidebar } from './components/Sidebar';
import { BottomMenu } from './components/BottomMenu';
import { AuthProvider, useAuth } from './context/AuthContext';

function AppContent() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    if (user) {
      setIsRegistering(false);
    }
  }, [user]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400">Carregando...</div>;
  }

  if (!user) {
    if (isRegistering) {
      return <Register onSwitchToLogin={() => setIsRegistering(false)} />;
    }
    return <Login onSwitchToRegister={() => setIsRegistering(true)} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'sales': return <Sales />; // <--- ROTA NOVA
      case 'clients': return <Clients />;
      case 'ranking': return <Ranking />;
      case 'products': return <Products />;
      case 'ideas': return <Ideas />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <div className="hidden md:block fixed h-full z-20">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <main className="flex-1 md:ml-64 pb-20 md:pb-0 w-full max-w-[100vw] overflow-x-hidden">
        {renderContent()}
      </main>

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-20">
        <BottomMenu activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}