import { Home, Users, Trophy, Package, Lightbulb, LogOut } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Início' },
    { id: 'clients', icon: Users, label: 'Clientes' },
    { id: 'ranking', icon: Trophy, label: 'Ranking' },
    { id: 'products', icon: Package, label: 'Produtos' },
    { id: 'ideas', icon: Lightbulb, label: 'Ideias / Vendas' },
  ];

  return (
    <aside className="w-64 bg-white h-screen border-r border-slate-200 flex-col hidden md:flex sticky top-0">
      {/* Logo da Empresa */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-200">
          <span className="text-white font-bold text-xl">BT</span>
        </div>
        <div>
          <span className="block text-lg font-bold text-slate-800 leading-none">Brasser</span>
          <span className="block text-sm text-slate-400 font-medium">Tech</span>
        </div>
      </div>

      {/* Navegação Principal */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
              activeTab === item.id
                ? 'bg-blue-50 text-blue-600 shadow-sm'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Rodapé do Menu */}
      <div className="p-4 border-t border-slate-100">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium">
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
};