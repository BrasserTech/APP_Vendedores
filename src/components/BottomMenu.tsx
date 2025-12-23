import { Home, Users, Trophy, Lightbulb, DollarSign } from 'lucide-react';

interface BottomMenuProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomMenu = ({ activeTab, setActiveTab }: BottomMenuProps) => {
  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Início' },
    { id: 'sales', icon: DollarSign, label: 'Vendas' }, // <--- ITEM NOVO
    { id: 'clients', icon: Users, label: 'Clientes' },
    { id: 'ranking', icon: Trophy, label: 'Ranking' },
    // Ocultei Produtos no mobile para caber na tela, mas mantive Ideias
    { id: 'ideas', icon: Lightbulb, label: 'Ideias' }, 
  ];

  return (
    <nav className="bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeTab === item.id ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${activeTab === item.id ? 'bg-blue-50' : ''}`}>
            <item.icon size={24} strokeWidth={activeTab === item.id ? 2.5 : 2} />
          </div>
          <span className="text-[10px] font-medium">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};