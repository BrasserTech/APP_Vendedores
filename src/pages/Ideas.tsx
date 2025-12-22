import { useState } from 'react';
import { Send, MessageSquarePlus, CheckCircle } from 'lucide-react';
import { sendIdea } from '../services/api';

export const Ideas = () => {
  const [type, setType] = useState('Notificação de Venda'); // Valor padrão
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!description.trim()) {
      alert("Por favor, digite uma descrição.");
      return;
    }

    setLoading(true);
    try {
      await sendIdea(type, description);
      setSuccess(true);
      setDescription(''); // Limpa o campo
      
      // Remove a mensagem de sucesso após 3 segundos
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      alert("Erro ao enviar. Tente novamente.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 pb-24 space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Sugestões & Notificações</h1>
      <p className="text-slate-500">Fez uma venda específica ou tem uma ideia para a Brasser Tech? Nos avise!</p>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
        
        {/* Mensagem de Sucesso (Overlay) */}
        {success && (
          <div className="absolute inset-0 bg-green-50 flex flex-col items-center justify-center z-10 animate-in fade-in">
            <CheckCircle size={48} className="text-green-600 mb-2" />
            <h3 className="font-bold text-green-700">Enviado com Sucesso!</h3>
          </div>
        )}

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
              <button 
                onClick={() => setType('Notificação de Venda')}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${type === 'Notificação de Venda' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                Notificação de Venda
              </button>
              <button 
                onClick={() => setType('Sugestão')}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${type === 'Sugestão' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                Ideia / Sugestão
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Descrição</label>
            <textarea 
              rows={5} 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-blue-100 text-slate-700"
              placeholder={type === 'Notificação de Venda' ? "Descreva os detalhes da venda..." : "Descreva sua ideia inovadora..."}
            ></textarea>
          </div>

          <button 
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-800 text-white hover:bg-slate-900'}`}
          >
            {loading ? 'Enviando...' : <><Send size={18} /> Enviar Agora</>}
          </button>
        </div>
      </div>
    </div>
  );
};