import { Search, Filter, ArrowUpCircle, ArrowDownCircle, MoreHorizontal } from 'lucide-react';

export const Transactions = () => {
  // Dados simulados
  const transactions = [
    { id: 1, desc: 'Desenvolvimento Website', cat: 'Vendas', date: '21 Dez, 2025', val: 'R$ 4.500,00', type: 'in', status: 'Concluído' },
    { id: 2, desc: 'Servidor AWS', cat: 'Infraestrutura', date: '20 Dez, 2025', val: 'R$ 350,00', type: 'out', status: 'Pendente' },
    { id: 3, desc: 'Licença Software', cat: 'Ferramentas', date: '19 Dez, 2025', val: 'R$ 120,00', type: 'out', status: 'Concluído' },
    { id: 4, desc: 'Consultoria UI/UX', cat: 'Serviços', date: '18 Dez, 2025', val: 'R$ 2.100,00', type: 'in', status: 'Concluído' },
    { id: 5, desc: 'Campanha Facebook Ads', cat: 'Marketing', date: '15 Dez, 2025', val: 'R$ 800,00', type: 'out', status: 'Agendado' },
  ];

  return (
    <div className="p-6 md:p-8 w-full max-w-7xl mx-auto space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Lançamentos</h1>
          <p className="text-slate-500">Gerencie todas as suas entradas e saídas.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
            <Filter size={18} /> Filtros
          </button>
          <button className="flex-1 md:flex-none bg-blue-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
            + Novo Lançamento
          </button>
        </div>
      </div>

      {/* Barra de Busca e Resumo Rápido */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por descrição, categoria..." 
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl text-slate-700 focus:ring-2 focus:ring-blue-100 outline-none placeholder:text-slate-400"
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto justify-between md:justify-end text-sm font-medium text-slate-500">
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> Receitas</span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Despesas</span>
        </div>
      </div>

      {/* Lista de Transações (Card Layout para Mobile / Table para Desktop) */}
      <div className="space-y-4">
        {transactions.map((t) => (
          <div key={t.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            
            {/* Ícone e Info Principal */}
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className={`p-3 rounded-xl ${t.type === 'in' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                {t.type === 'in' ? <ArrowUpCircle size={24} /> : <ArrowDownCircle size={24} />}
              </div>
              <div>
                <h3 className="font-bold text-slate-800">{t.desc}</h3>
                <p className="text-sm text-slate-500">{t.cat} • {t.date}</p>
              </div>
            </div>

            {/* Status e Valor */}
            <div className="flex items-center justify-between w-full md:w-auto gap-6 md:gap-12">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                t.status === 'Concluído' ? 'bg-blue-50 text-blue-600' : 
                t.status === 'Pendente' ? 'bg-yellow-50 text-yellow-600' : 'bg-slate-100 text-slate-500'
              }`}>
                {t.status}
              </span>
              <div className="text-right">
                <span className={`block font-bold text-lg ${t.type === 'in' ? 'text-green-600' : 'text-slate-800'}`}>
                  {t.type === 'in' ? '+' : '-'} {t.val}
                </span>
              </div>
              <button className="text-slate-300 hover:text-slate-600 p-2 md:hidden group-hover:block">
                <MoreHorizontal size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};