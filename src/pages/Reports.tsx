import { PieChart, TrendingUp, Calendar } from 'lucide-react';

export const Reports = () => {
  return (
    <div className="p-6 md:p-8 w-full max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Relatórios</h1>
          <p className="text-slate-500">Análise visual das suas finanças.</p>
        </div>
        <button className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-slate-50">
          <Calendar size={16} /> Este Mês
        </button>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Fluxo de Caixa', val: 'R$ 5.850', color: 'bg-blue-600' },
          { label: 'Ticket Médio', val: 'R$ 840', color: 'bg-indigo-500' },
          { label: 'Maior Despesa', val: 'R$ 1.200', color: 'bg-red-500' },
          { label: 'Economia', val: '24%', color: 'bg-green-500' },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-slate-500 text-sm font-medium">{item.label}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className={`w-2 h-8 rounded-full ${item.color}`}></div>
              <span className="text-2xl font-bold text-slate-800">{item.val}</span>
            </div>
          </div>
        ))}
      </div>

      {/* "Gráfico" de Categorias (Barras de Progresso) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><PieChart size={20} /></div>
          <h2 className="text-lg font-bold text-slate-800">Gastos por Categoria</h2>
        </div>

        <div className="space-y-6">
          {[
            { cat: 'Infraestrutura', val: 'R$ 1.250', percent: '45%', color: 'bg-blue-600', width: 'w-[45%]' },
            { cat: 'Marketing', val: 'R$ 800', percent: '30%', color: 'bg-indigo-500', width: 'w-[30%]' },
            { cat: 'Pessoal', val: 'R$ 450', percent: '15%', color: 'bg-purple-500', width: 'w-[15%]' },
            { cat: 'Outros', val: 'R$ 200', percent: '10%', color: 'bg-slate-400', width: 'w-[10%]' },
          ].map((item) => (
            <div key={item.cat}>
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-slate-700">{item.cat}</span>
                <span className="text-slate-500">{item.val} ({item.percent})</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${item.color} ${item.width}`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dica / Insight */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white flex items-start gap-4 shadow-lg shadow-blue-200">
        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
          <TrendingUp size={24} color="white" />
        </div>
        <div>
          <h3 className="font-bold text-lg">Dica Financeira</h3>
          <p className="text-blue-100 mt-1 text-sm leading-relaxed">
            Seus gastos com marketing subiram 15% este mês. Considere revisar o ROI das campanhas para otimizar seu orçamento no próximo ciclo.
          </p>
        </div>
      </div>
    </div>
  );
};