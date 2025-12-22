import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDashboardMetrics } from '../services/api';
import { 
  TrendingUp, 
  DollarSign, 
  Wallet, 
  Calendar, 
  ArrowUpRight, 
  CreditCard,
  Plus
} from 'lucide-react';

// CORREÇÃO 1: Ajustamos a interface para saber que produtos/clientes são Arrays
interface Transaction {
  id: string;
  valor_negociado: number;
  data_venda: string;
  status: string;
  produtos: { nome: string }[] | null; // Era objeto, agora é lista de objetos
  clientes: { nome_empresa: string }[] | null; // Era objeto, agora é lista de objetos
}

export const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  
  const [metrics, setMetrics] = useState({
    saldoTotal: 0,
    vendasMes: 0,
    comissao: 0,
    recentes: [] as Transaction[]
  });

  useEffect(() => {
    const loadData = async () => {
      if (user?.id) {
        try {
          // O TypeScript agora vai aceitar os dados vindos do Supabase
          const data = await getDashboardMetrics(user.id);
          // Forçamos a tipagem aqui para garantir que o TS entenda a estrutura
          setMetrics(data as any); 
        } catch (error) {
          console.error("Erro ao carregar dashboard:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadData();
  }, [user]);

  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  const metaMensal = 20000;
  const progressoMeta = Math.min((metrics.vendasMes / metaMensal) * 100, 100);

  return (
    <div className="p-6 md:p-8 w-full max-w-7xl mx-auto space-y-8 pb-24">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Olá, {user?.nome?.split(' ')[0] || 'Vendedor'} 👋
          </h1>
          <p className="text-slate-500 mt-1">Aqui está seu resumo financeiro de hoje.</p>
        </div>
        
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-lg shadow-blue-200 w-full md:w-auto justify-center">
          <Plus size={20} />
          Nova Venda
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400 animate-pulse">Carregando seus números...</div>
      ) : (
        <>
          {/* Cards Principais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card Saldo Total */}
            <div className="bg-blue-600 p-6 rounded-2xl shadow-lg shadow-blue-200 text-white relative overflow-hidden group">
              <div className="absolute right-0 top-0 p-3 opacity-10 transform translate-x-2 -translate-y-2 group-hover:scale-110 transition-transform">
                <Wallet size={120} />
              </div>
              <div className="relative z-10">
                <p className="text-blue-100 font-medium mb-1">Total Vendido (Geral)</p>
                <h3 className="text-3xl font-bold">{formatMoney(metrics.saldoTotal)}</h3>
                <div className="mt-4 flex items-center gap-2 text-sm bg-white/20 w-fit px-3 py-1 rounded-lg">
                  <TrendingUp size={16} />
                  <span>Performance Total</span>
                </div>
              </div>
            </div>

            {/* Card Vendas do Mês */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-slate-500 font-medium text-sm">Vendas este Mês</p>
                  <h3 className="text-2xl font-bold text-slate-800 mt-1">{formatMoney(metrics.vendasMes)}</h3>
                </div>
                <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                  <Calendar size={24} />
                </div>
              </div>
              <div className="mt-2">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Progresso da Meta</span>
                  <span>{progressoMeta.toFixed(0)}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full transition-all duration-1000" style={{ width: `${progressoMeta}%` }}></div>
                </div>
              </div>
            </div>

            {/* Card Comissão */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-slate-500 font-medium text-sm">Sua Comissão (Estimada 10%)</p>
                  <h3 className="text-2xl font-bold text-blue-600 mt-1">{formatMoney(metrics.comissao)}</h3>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <DollarSign size={24} />
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                <CreditCard size={12} /> Disponível para saque em breve
              </p>
            </div>
          </div>

          {/* Lista de Transações Recentes */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-slate-800">Últimas Vendas</h2>
              <button className="text-blue-600 text-sm font-bold hover:underline">Ver tudo</button>
            </div>

            {metrics.recentes.length === 0 ? (
              <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                Nenhuma venda registrada ainda. Clique em "Nova Venda" para começar!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50">
                      <th className="pb-3 pl-2">Cliente / Produto</th>
                      <th className="pb-3 hidden md:table-cell">Data</th>
                      <th className="pb-3 text-right pr-2">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {metrics.recentes.map((t) => (
                      <tr key={t.id} className="group hover:bg-blue-50/30 transition-colors">
                        <td className="py-4 pl-2">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                              <ArrowUpRight size={18} />
                            </div>
                            <div>
                              {/* CORREÇÃO 2: Acessamos o índice [0] pois agora é um array */}
                              <p className="font-bold text-slate-800 text-sm">
                                {t.clientes?.[0]?.nome_empresa || 'Cliente'}
                              </p>
                              <p className="text-xs text-slate-500">
                                {t.produtos?.[0]?.nome || 'Produto'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-slate-500 text-sm hidden md:table-cell font-medium">
                          {formatDate(t.data_venda)}
                        </td>
                        <td className="py-4 pr-2 text-right">
                          <span className="font-bold text-green-600 text-sm bg-green-50 px-2 py-1 rounded-md">
                            + {formatMoney(t.valor_negociado)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};