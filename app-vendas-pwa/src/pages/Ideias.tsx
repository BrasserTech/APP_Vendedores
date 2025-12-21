import React, { useState } from "react";
import { Send, Lightbulb } from "lucide-react";

const Ideias = () => {
  const [tipo, setTipo] = useState("otimizacao");

  return (
    <div className="space-y-6">
      <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex gap-3">
        <Lightbulb className="text-green-700 shrink-0" />
        <p className="text-sm text-green-800">
          Sua opinião molda o futuro do sistema! Envie sugestões para a equipe da Brasser Tech.
        </p>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sobre o que é a ideia?</label>
          <div className="grid grid-cols-3 gap-2">
            {["otimizacao", "melhoria", "modulo"].map((t) => (
              <button
                key={t}
                onClick={() => setTipo(t)}
                className={`text-xs py-2 px-1 rounded-lg border capitalize transition-all
                  ${tipo === t 
                    ? "bg-green-700 text-white border-green-700" 
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}
              >
                {t === "modulo" ? "Novo Módulo" : t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
          <textarea 
            rows={5}
            placeholder="Descreva detalhadamente como podemos melhorar..."
            className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none bg-gray-50"
          ></textarea>
        </div>

        <button className="w-full bg-green-800 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-900 transition-colors">
          <Send size={18} />
          Enviar Sugestão
        </button>
      </div>
    </div>
  );
};
export default Ideias;
