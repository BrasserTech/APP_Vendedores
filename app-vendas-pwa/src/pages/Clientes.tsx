import React from 'react';
import { User, Plus, Pencil, Trash2 } from 'lucide-react';

const Clientes = () => {
  const clientes = [
    { id: 1, nome: 'Tech Soluções Ltda', contato: 'Paulo', tipo: 'Empresa' },
    { id: 2, nome: 'Academia Force', contato: 'Ana', tipo: 'Pessoa Física' },
    { id: 3, nome: 'Mercado Express', contato: 'Roberto', tipo: 'Empresa' },
  ];

  return (
    <div className="relative min-h-full">
      <div className="space-y-3">
        {clientes.map((cliente) => (
          <div key={cliente.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-gray-800">{cliente.nome}</h3>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <User size={12} /> {cliente.contato} • {cliente.tipo}
              </p>
            </div>
            <div className="flex gap-3">
               <button className="text-gray-400 hover:text-blue-600"><Pencil size={18} /></button>
               <button className="text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>
      <button className="fixed bottom-20 right-4 bg-green-800 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-colors z-30">
        <Plus size={24} />
      </button>
    </div>
  );
};
export default Clientes;
