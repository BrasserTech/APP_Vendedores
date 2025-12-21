import { Send, MessageSquarePlus } from 'lucide-react';

export const Ideas = () => {
  return (
    <div className="p-5 pb-24 space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Sugestões & Notificações</h1>
      <p className="text-slate-500">Fez uma venda específica ou tem uma ideia para a Brasser Tech? Nos avise!</p>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
          <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
            <MessageSquarePlus size={24} />
          </div>
          <h2 className="font-bold text-slate-800">Enviar Mensagem</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Tipo de Mensagem</label>
            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium">Notificação de Venda</button>
              <button className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-medium">Ideia / Sugestão</button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Descrição</label>
            <textarea 
              rows={5} 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-blue-100 text-slate-700"
              placeholder="Descreva a especificação da venda ou sua ideia inovadora..."
            ></textarea>
          </div>

          <button className="w-full bg-slate-800 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-900 transition-colors">
            <Send size={18} /> Enviar Agora
          </button>
        </div>
      </div>
    </div>
  );
};