import React from 'react';
import { Medal } from 'lucide-react';

const Ranking = () => {
  const vendedores = [
    { nome: 'Eduardo (Você)', vendas: 'R$ 15.200', meta: 95 },
    { nome: 'Paulo', vendas: 'R$ 12.800', meta: 80 },
    { nome: 'Fernanda', vendas: 'R$ 9.400', meta: 60 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        <span className="px-4 py-1 bg-green-800 text-white rounded-full text-sm font-medium whitespace-nowrap">Mês Atual</span>
        <span className="px-4 py-1 bg-gray-200 text-gray-600 rounded-full text-sm font-medium whitespace-nowrap">Semana</span>
      </div>
      {vendedores.map((vendedor, index) => {
        const isTop3 = index < 3;
        const medalColor = index === 0 ? "text-yellow-500" : index === 1 ? "text-gray-400" : "text-orange-400";
        return (
          <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`font-bold text-xl w-8 text-center ${isTop3 ? medalColor : "text-gray-400"}`}>
              {index + 1}º
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-gray-800">{vendedor.nome}</span>
                {index === 0 && <Medal size={16} className="text-yellow-500" />}
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 mb-1">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: `${vendedor.meta}%` }}></div>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Vendas</span>
                <span className="font-bold text-green-700">{vendedor.vendas}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default Ranking;
