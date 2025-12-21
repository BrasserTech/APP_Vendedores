import { UserPlus } from 'lucide-react'; // Removido CheckCircle

export const Clients = () => {
  return (
    <div className="p-5 pb-24 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Clientes</h1>
        <button className="bg-blue-600 text-white p-2 rounded-xl shadow-lg shadow-blue-200">
          <UserPlus size={24} />
        </button>
      </div>

      {/* Lista de Clientes Recentes */}
      <div className="space-y-4">
        {[
          { name: 'Academia FitLife', module: 'Gestão Esportiva', status: 'Ativo' },
          { name: 'Padaria do João', module: 'Controle Financeiro', status: 'Pendente' },
          { name: 'Handball Joaçaba', module: 'Gestão de Time', status: 'Ativo' },
        ].map((client, index) => (
          <div key={index} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-800">{client.name}</h3>
              <p className="text-sm text-slate-500">Módulo: <span className="text-blue-600 font-medium">{client.module}</span></p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${
              client.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {client.status}
            </div>
          </div>
        ))}
      </div>

      {/* Área de Cadastro Rápido */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm mt-6">
        <h3 className="font-bold text-slate-800 mb-4">Novo Contrato</h3>
        <input type="text" placeholder="Nome da Empresa/Cliente" className="w-full p-3 bg-slate-50 rounded-xl mb-3 border-none outline-none focus:ring-2 focus:ring-blue-100" />
        <select className="w-full p-3 bg-slate-50 rounded-xl mb-4 text-slate-600 outline-none">
          <option>Selecione o Módulo...</option>
          <option>Gestão Financeira</option>
          <option>Gestão de Times (Esportes)</option>
          <option>Automação Comercial</option>
        </select>
        <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">
          Cadastrar Cliente
        </button>
      </div>
    </div>
  );
};