import { Home, Users, Trophy, Package, Lightbulb } from 'lucide-react';

interface BottomMenuProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomMenu = ({ activeTab, setActiveTab }: BottomMenuProps) => {
  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Início' },
    { id: 'clients', icon: Users, label: 'Clientes' },
    { id: 'ranking', icon: Trophy, label: 'Ranking' },
    { id: 'products', icon: Package, label: 'Produtos' },
    { id: 'ideas', icon: Lightbulb, label: 'Ideias' },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 px-2 py-2 flex justify-between items-center z-50 md:hidden pb-safe">
      {menuItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-xl transition-all ${
              isActive ? 'text-blue-600' : 'text-slate-400 hover:bg-slate-50'
            }`}
          >
            <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span className={`text-[10px] font-medium ${isActive ? 'font-bold' : ''}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};