import { useEffect, useState } from 'react';
import { Tag } from 'lucide-react';
import { getProducts } from '../services/api';

interface Produto {
  id: string;
  nome: string;
  preco_mensal: number;
  variantes: string[]; // No banco é array de texto
}

export const Products = () => {
  const [products, setProducts] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data || []);
      } catch (error) {
        console.error("Erro ao carregar produtos", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500">Carregando catálogo...</div>;

  return (
    <div className="p-5 pb-24 space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Nossos Produtos</h1>
      
      <div className="grid gap-4">
        {products.map((prod) => (
          <div key={prod.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold text-slate-800">{prod.nome}</h3>
              <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded-md">
                R$ {prod.preco_mensal}/mês
              </span>
            </div>
            
            <div className="mt-4">
              <p className="text-xs text-slate-400 mb-2 uppercase font-bold tracking-wider">Variantes Disponíveis:</p>
              <div className="flex flex-wrap gap-2">
                {/* Verifica se variantes existe antes de fazer o map */}
                {prod.variantes && prod.variantes.map((v) => (
                  <span key={v} className="flex items-center gap-1 bg-slate-50 text-slate-600 px-3 py-1 rounded-lg text-sm border border-slate-100">
                    <Tag size={12} /> {v}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};