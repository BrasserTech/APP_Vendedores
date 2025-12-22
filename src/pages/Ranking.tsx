import { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';
import { getRanking } from '../services/api';

interface Vendedor {
  id: string;
  nome: string;
  total_vendas: number;
  contratos_fechados: number;
}

export const Ranking = () => {
  const [sellers, setSellers] = useState<Vendedor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRanking = async () => {
      try {
        const data = await getRanking();
        setSellers(data || []);
      } catch (error) {
        console.error("Erro ao carregar ranking", error);
      } finally {
        setLoading(false);
      }
    };
    loadRanking();
  }, []);

  // Formata dinheiro (R$)
  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Carregando ranking...</div>;

  const top1 = sellers[0]; // O primeiro da lista (banco já retorna ordenado)
  const others = sellers.slice(1); // O restante

  return (
    <div className="p-5 pb-24 space-y-6">
      <div className="text-center py-4">
        <h1 className="text-2xl font-bold text-slate-800">Ranking Brasser</h1>
        <p className="text-slate-500 text-sm">Quem está vendendo mais este mês?</p>
      </div>

      {/* Pódio (Top 1) */}
      {top1 && (
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-6 text-white text-center shadow-xl shadow-blue-200 relative overflow-hidden transform transition-all hover:scale-[1.02]">
          <Trophy size={64} className="mx-auto text-yellow-300 mb-2 drop-shadow-md" />
          <h2 className="text-2xl font-bold">{top1.nome}</h2>
          <p className="text-blue-200 font-medium">{formatMoney(top1.total_vendas)} em vendas</p>
          <div className="mt-4 bg-white/20 py-2 px-4 rounded-full inline-block text-sm">
            🥇 1º Lugar Geral
          </div>
        </div>
      )}

      {/* Lista Geral (Do 2º lugar em diante) */}
      <div className="space-y-3 mt-4">
        {others.map((seller, index) => (
          <div key={seller.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-8 h-8 flex items-center justify-center font-bold text-slate-400 bg-slate-100 rounded-lg">
              {index + 2}º
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-800">{seller.nome}</h3>
              <p className="text-xs text-slate-500">{seller.contratos_fechados} contratos fechados</p>
            </div>
            <div className="text-right">
              <span className="block font-bold text-blue-600">{formatMoney(seller.total_vendas)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};