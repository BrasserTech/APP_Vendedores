import { Trophy } from 'lucide-react'; // Removido Medal

export const Ranking = () => {
  const sellers = [
    { name: 'Você', sales: 'R$ 12.450', deals: 8, pos: 1 },
    { name: 'Eduardo', sales: 'R$ 10.200', deals: 6, pos: 2 },
    { name: 'Ana Silva', sales: 'R$ 8.900', deals: 5, pos: 3 },
    { name: 'Carlos B.', sales: 'R$ 5.400', deals: 3, pos: 4 },
  ];

  return (
    <div className="p-5 pb-24 space-y-6">
      <div className="text-center py-4">
        <h1 className="text-2xl font-bold text-slate-800">Ranking Brasser</h1>
        <p className="text-slate-500 text-sm">Quem está vendendo mais este mês?</p>
      </div>

      {/* Pódio (Top 1) */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-6 text-white text-center shadow-xl shadow-blue-200 relative overflow-hidden">
        <Trophy size={64} className="mx-auto text-yellow-300 mb-2 drop-shadow-md" />
        <h2 className="text-2xl font-bold">{sellers[0].name}</h2>
        <p className="text-blue-200 font-medium">{sellers[0].sales} em vendas</p>
        <div className="mt-4 bg-white/20 py-2 px-4 rounded-full inline-block text-sm">
          🥇 1º Lugar Geral
        </div>
      </div>

      {/* Lista Geral */}
      <div className="space-y-3 mt-4">
        {sellers.slice(1).map((seller) => (
          <div key={seller.pos} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-8 h-8 flex items-center justify-center font-bold text-slate-400 bg-slate-100 rounded-lg">
              {seller.pos}º
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-800">{seller.name}</h3>
              <p className="text-xs text-slate-500">{seller.deals} contratos fechados</p>
            </div>
            <div className="text-right">
              <span className="block font-bold text-blue-600">{seller.sales}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};