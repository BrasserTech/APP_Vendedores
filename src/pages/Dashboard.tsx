import { SummaryCard } from '../components/SummaryCard';
import { Plus, Search, Filter } from 'lucide-react';

export const Dashboard = () => {
  const transactions = [
    { id: 1, desc: 'Desenvolvimento Website', cat: 'Vendas', date: '21 Dez, 2025', val: '+ R$ 4.500,00', type: 'in' },
    { id: 2, desc: 'Servidor AWS', cat: 'Infraestrutura', date: '20 Dez, 2025', val: '- R$ 350,00', type: 'out' },
    { id: 3, desc: 'Licença Software', cat: 'Ferramentas', date: '19 Dez, 2025', val: '- R$ 120,00', type: 'out' },
  ];

  return (
    <div className="p-6 md:p-8 w-full max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Olá, Usuário 👋</h1>
          <p className="text-slate-500 mt-1">Aqui está o resumo financeiro de hoje.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-lg shadow-blue-200 w-full md:w-auto justify-center">
          <Plus size={20} />
          Nova Transação
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SummaryCard title="Saldo Total" value="R$ 12.450,00" type="balance" />
        <SummaryCard title="Entradas" value="R$ 6.600,00" type="income" />
        <SummaryCard title="Saídas" value="R$ 470,00" type="expense" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-800">Transações Recentes</h2>
          <div className="flex gap-2">
            <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg"><Search size={20} /></button>
            <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg"><Filter size={20} /></button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="text-left text-sm font-semibold text-slate-400 border-b border-slate-100">
                <th className="pb-4 pl-2">Descrição</th>
                <th className="pb-4">Categoria</th>
                <th className="pb-4">Data</th>
                <th className="pb-4 pr-2 text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {transactions.map((t) => (
                <tr key={t.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 pl-2 font-medium text-slate-700">{t.desc}</td>
                  <td className="py-4"><span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-md font-medium">{t.cat}</span></td>
                  <td className="py-4 text-slate-500 text-sm">{t.date}</td>
                  <td className={`py-4 pr-2 text-right font-semibold ${t.type === 'in' ? 'text-green-600' : 'text-slate-800'}`}>{t.val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};