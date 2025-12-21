import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { BottomMenu } from './components/BottomMenu';
import { Dashboard } from './pages/Dashboard';
import { Clients } from './pages/Clients';
import { Ranking } from './pages/Ranking';
import { Products } from './pages/Products';
import { Ideas } from './pages/Ideas';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Lógica para escolher qual tela mostrar
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
      
      {/* MENU PC: Só aparece em telas médias ou maiores (md:block) */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* ÁREA DE CONTEÚDO PRINCIPAL */}
      <div className="flex-1 flex flex-col h-full relative w-full">
        
        {/* Container com scroll independente */}
        <main className="flex-1 overflow-y-auto scroll-smooth w-full">
          <div className="mx-auto max-w-5xl w-full">
             {renderContent()}
          </div>
        </main>

        {/* MENU CELULAR: Só aparece em telas pequenas (md:hidden) */}
        <BottomMenu activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}

export default App;