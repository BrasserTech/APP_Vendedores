import { ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: string;
  type: 'balance' | 'income' | 'expense';
}

export const SummaryCard = ({ title, value, type }: SummaryCardProps) => {
  const styles = {
    balance: { bg: 'bg-blue-600', text: 'text-white', sub: 'text-blue-100', icon: 'bg-white/20 text-white' },
    income: { bg: 'bg-white', text: 'text-slate-800', sub: 'text-green-600', icon: 'bg-green-50 text-green-600' },
    expense: { bg: 'bg-white', text: 'text-slate-800', sub: 'text-red-500', icon: 'bg-red-50 text-red-500' },
  };

  const style = styles[type];
  const shadowClass = type === 'balance' ? 'shadow-lg shadow-blue-200' : 'shadow-sm border border-slate-100';

  return (
    <div className={`${style.bg} ${shadowClass} p-6 rounded-2xl transition-transform hover:-translate-y-1 duration-300`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className={`text-sm font-medium ${type === 'balance' ? 'text-blue-100' : 'text-slate-500'}`}>{title}</p>
          <h3 className={`text-3xl font-bold mt-1 ${style.text}`}>{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${style.icon}`}>
          {type === 'balance' && <DollarSign size={24} />}
          {type === 'income' && <ArrowUpRight size={24} />}
          {type === 'expense' && <ArrowDownRight size={24} />}
        </div>
      </div>
      <p className={`text-sm flex items-center gap-1 font-medium ${style.sub}`}>
        {type === 'balance' ? 'Atualizado agora' : type === 'income' ? '+12% este mês' : '-5% este mês'}
      </p>
    </div>
  );
};