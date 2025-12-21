import React from "react";
import { Search, Package, Plus } from "lucide-react";

const Produtos = () => {
  return (
    <div className="space-y-4">
      <div className="relative">
        <input 
          type="text" 
          placeholder="Buscar produtos..." 
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-green-500 outline-none"
        />
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
            <div className="bg-gray-100 h-24 rounded-lg mb-2 flex items-center justify-center">
              <Package className="text-gray-400" />
            </div>
            <h3 className="font-bold text-gray-800 text-sm">Produto Exemplo {i}</h3>
            <p className="text-green-700 font-bold text-sm mt-1">R$ 99,90</p>
            <p className="text-xs text-gray-400">Estoque: 12</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Produtos;
