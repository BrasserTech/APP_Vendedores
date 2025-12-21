import React from 'react';
import { TrendingUp, DollarSign, Users } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Olá, Eduardo!</h2>
        <p className="text-gray-500 text-sm">Resumo da Brasser Tech hoje.</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-green-700 mb-2">
            <DollarSign size={18} />
            <span className="text-xs font-bold uppercase">Vendas Hoje</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">R$ 1.250</p>
          <span className="text-xs text-green-600">+12% vs ontem</span>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <Users size={18} />
            <span className="text-xs font-bold uppercase">Novos Clientes</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">4</p>
          <span className="text-xs text-gray-400">Meta: 5/dia</span>
        </div>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-700 mb-4">Desempenho Semanal</h3>
        <div className="h-32 flex items-end justify-between gap-2 px-2">
            {[40, 70, 35, 90, 60, 80, 100].map((h, i) => (
                <div key={i} className="w-full bg-green-100 rounded-t-sm relative group">
                    <div style={{ height: `${h}%` }} className="absolute bottom-0 w-full bg-green-600 rounded-t-sm"></div>
                </div>
            ))}
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>D</span><span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
