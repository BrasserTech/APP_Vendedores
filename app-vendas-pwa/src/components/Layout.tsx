import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Trophy, Package, Lightbulb, User, ChevronLeft } from 'lucide-react';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: 'Dash', icon: LayoutDashboard, path: '/' },
    { name: 'Clientes', icon: Users, path: '/clientes' },
    { name: 'Ranking', icon: Trophy, path: '/ranking' },
    { name: 'Produtos', icon: Package, path: '/produtos' },
    { name: 'Ideias', icon: Lightbulb, path: '/ideias' },
  ];

  const getTitle = () => {
    switch(location.pathname) {
      case '/': return 'Dashboard';
      case '/clientes': return 'Meus Clientes';
      case '/ranking': return 'Ranking de Vendas';
      case '/produtos': return 'Catálogo';
      case '/ideias': return 'Central de Ideias';
      default: return 'Brasser App';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-green-800 text-white p-4 flex items-center justify-between sticky top-0 z-10 shadow-md">
        <div className="flex items-center gap-3">
          {location.pathname !== '/' && (
            <button onClick={() => navigate(-1)}>
              <ChevronLeft size={24} />
            </button>
          )}
          <h1 className="text-lg font-bold">{getTitle()}</h1>
        </div>
        <button className="p-1 bg-green-700 rounded-full">
          <User size={20} />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 pb-24 overflow-y-auto">
        <Outlet />
      </main>

      {/* Bottom Menu */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16 pb-safe z-20">
        <div className="flex justify-between items-center h-full px-4 max-w-md mx-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center w-full space-y-1 
                  ${isActive ? 'text-green-700' : 'text-gray-400 hover:text-green-600'}`}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{item.name}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
