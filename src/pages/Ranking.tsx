import { useEffect, useState } from 'react';
import { Trophy, Crown } from 'lucide-react'; // Removido Medal
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

  const loadRanking = async () => {
    try {
      const data = await getRanking();
      setSellers(data || []);
    } catch (error) {
      console.error("Erro ranking", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadRanking(); }, []);

  const formatMoney = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const top1 = sellers[0];
  const top2 = sellers[1];
  const top3 = sellers[2];
  const others = sellers.slice(3);

  return (
    <div className="p-6 md:p-8 w-full max-w-5xl mx-auto pb-24 space-y-8">
      
      <div className="text-center py-4">
        <h1 className="text-3xl font-bold text-slate-800">Ranking de Vendas</h1>
        <p className="text-slate-500">Quem está liderando a Brasser Tech?</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400 animate-pulse">Carregando pódio...</div>
      ) : sellers.length === 0 ? (
        <div className="text-center text-slate-400">Nenhum dado disponível.</div>
      ) : (
        <>
          {/* --- PÓDIO (TOP 3) --- */}
          <div className="flex flex-col md:flex-row items-end justify-center gap-4 md:gap-6 min-h-[300px] mb-8">
            
            {/* 2º Lugar */}
            {top2 && (
              <div className="order-2 md:order-1 w-full md:w-1/3 flex flex-col items-center animate-in slide-in-from-bottom-8 duration-700 delay-100">
                <div className="w-20 h-20 bg-slate-200 rounded-full border-4 border-white shadow-md flex items-center justify-center mb-[-20px] z-10 relative">
                  <span className="text-2xl font-bold text-slate-600">{top2.nome.charAt(0)}</span>
                  <span className="absolute -bottom-2 bg-slate-500 text-white text-xs px-2 py-0.5 rounded-full">2º</span>
                </div>
                <div className="bg-white border-t-4 border-slate-300 w-full h-40 rounded-t-2xl shadow-sm flex flex-col justify-center items-center pt-6 hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-slate-700">{top2.nome}</h3>
                  <p className="text-slate-500 text-xs">{top2.contratos_fechados} vendas</p>
                  <p className="text-xl font-bold text-slate-800 mt-1">{formatMoney(top2.total_vendas)}</p>
                </div>
              </div>
            )}

            {/* 1º Lugar */}
            {top1 && (
              <div className="order-1 md:order-2 w-full md:w-1/3 flex flex-col items-center animate-in slide-in-from-bottom-12 duration-700 z-20">
                <Crown size={48} className="text-yellow-400 mb-2 animate-bounce" />
                <div className="w-24 h-24 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center mb-[-25px] z-10 relative">
                  <span className="text-3xl font-bold text-white">{top1.nome.charAt(0)}</span>
                  <span className="absolute -bottom-2 bg-yellow-600 text-white text-xs px-3 py-1 rounded-full font-bold">1º</span>
                </div>
                <div className="bg-gradient-to-b from-blue-600 to-blue-800 w-full h-56 rounded-t-3xl shadow-xl shadow-blue-200 flex flex-col justify-center items-center pt-8 text-white transform hover:scale-105 transition-transform">
                  <h3 className="font-bold text-2xl">{top1.nome}</h3>
                  <div className="flex items-center gap-1 text-blue-200 text-sm mb-2"><Trophy size={14}/> Campeão</div>
                  <p className="text-3xl font-bold">{formatMoney(top1.total_vendas)}</p>
                  <p className="text-sm opacity-80 mt-1">{top1.contratos_fechados} contratos</p>
                </div>
              </div>
            )}

            {/* 3º Lugar */}
            {top3 && (
              <div className="order-3 md:order-3 w-full md:w-1/3 flex flex-col items-center animate-in slide-in-from-bottom-8 duration-700 delay-200">
                <div className="w-20 h-20 bg-orange-100 rounded-full border-4 border-white shadow-md flex items-center justify-center mb-[-20px] z-10 relative">
                  <span className="text-2xl font-bold text-orange-600">{top3.nome.charAt(0)}</span>
                  <span className="absolute -bottom-2 bg-orange-400 text-white text-xs px-2 py-0.5 rounded-full">3º</span>
                </div>
                <div className="bg-white border-t-4 border-orange-300 w-full h-32 rounded-t-2xl shadow-sm flex flex-col justify-center items-center pt-6 hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-slate-700">{top3.nome}</h3>
                  <p className="text-slate-500 text-xs">{top3.contratos_fechados} vendas</p>
                  <p className="text-xl font-bold text-slate-800 mt-1">{formatMoney(top3.total_vendas)}</p>
                </div>
              </div>
            )}
          </div>

          {/* --- TABELA DO RESTANTE --- */}
          {others.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-1000">
              <div className="p-4 bg-slate-50 border-b border-slate-100 font-bold text-slate-500 text-sm">
                Outros Colocados
              </div>
              <div className="divide-y divide-slate-50">
                {others.map((seller, index) => (
                  <div key={seller.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                    <div className="w-8 h-8 flex items-center justify-center font-bold text-slate-400 bg-slate-100 rounded-lg text-sm">
                      {index + 4}º
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-800 text-sm">{seller.nome}</h3>
                    </div>
                    <div className="text-right">
                      <span className="block font-bold text-slate-700 text-sm">{formatMoney(seller.total_vendas)}</span>
                      <span className="text-xs text-slate-400">{seller.contratos_fechados} vendas</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};