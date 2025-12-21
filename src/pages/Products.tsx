import { Tag } from 'lucide-react';

export const Products = () => {
  const products = [
    { id: 1, name: 'Sistema Financeiro Pro', price: 'R$ 99,90/mês', variants: ['Básico', 'Pro', 'Enterprise'] },
    { id: 2, name: 'Gestor de Times', price: 'R$ 59,90/mês', variants: ['Amador', 'Profissional'] },
    { id: 3, name: 'Automação Zap', price: 'R$ 120,00/mês', variants: ['Única', 'Multi-atendente'] },
  ];

  return (
    <div className="p-5 pb-24 space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Nossos Produtos</h1>
      
      <div className="grid gap-4">
        {products.map((prod) => (
          <div key={prod.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold text-slate-800">{prod.name}</h3>
              <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded-md">{prod.price}</span>
            </div>
            
            <div className="mt-4">
              <p className="text-xs text-slate-400 mb-2 uppercase font-bold tracking-wider">Variantes Disponíveis:</p>
              <div className="flex flex-wrap gap-2">
                {prod.variants.map((v) => (
                  <span key={v} className="flex items-center gap-1 bg-slate-50 text-slate-600 px-3 py-1 rounded-lg text-sm border border-slate-100">
                    <Tag size={12} /> {v}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};