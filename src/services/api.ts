import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../constants';

// Inicializa a conexão com o Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==========================================
// 1. AUTENTICAÇÃO MANUAL (Tabela 'usuarios')
// ==========================================

export const loginManual = async (email: string, senha: string) => {
  // Busca usuário onde email E senha batem
  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('email', email)
    .eq('senha', senha) // Em produção, usaríamos criptografia/hash
    .single();

  if (error) return null;
  return data;
};

export const registerManual = async (nome: string, email: string, senha: string) => {
  const { data, error } = await supabase
    .from('usuarios')
    .insert([{ nome, email, senha }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// ==========================================
// 2. DASHBOARD & MÉTRICAS
// ==========================================

export const getDashboardMetrics = async (usuarioId: string) => {
  const hoje = new Date();
  // Data do primeiro dia do mês atual (para filtro)
  const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1).toISOString();

  // A. Busca TODAS as vendas do usuário (para saldo total)
  const { data: todasVendas, error: errorTotal } = await supabase
    .from('vendas')
    .select('valor_negociado, data_venda')
    .eq('usuario_id', usuarioId);

  if (errorTotal) throw errorTotal;

  // B. Busca as 5 vendas mais recentes com detalhes (Join)
  const { data: vendasRecentes, error: errorRecentes } = await supabase
    .from('vendas')
    .select(`
      id,
      valor_negociado,
      data_venda,
      status,
      produtos (nome),
      clientes (nome_empresa)
    `)
    .eq('usuario_id', usuarioId)
    .order('data_venda', { ascending: false })
    .limit(5);

  if (errorRecentes) throw errorRecentes;

  // C. Cálculos Matemáticos (Frontend)
  
  // Soma tudo
  const saldoTotal = todasVendas?.reduce((acc, curr) => acc + Number(curr.valor_negociado), 0) || 0;

  // Soma só o que é deste mês
  const vendasMes = todasVendas
    ?.filter(v => v.data_venda >= primeiroDiaMes)
    .reduce((acc, curr) => acc + Number(curr.valor_negociado), 0) || 0;

  // Calcula comissão de 10%
  const comissao = saldoTotal * 0.10;

  return {
    saldoTotal,
    vendasMes,
    comissao,
    recentes: vendasRecentes || []
  };
};

// ==========================================
// 3. LEITURA DE DADOS (GET)
// ==========================================

// Buscar Clientes (Filtra pelo usuário logado se quiser, aqui traz tudo)
export const getClients = async () => {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

// Buscar Catálogo de Produtos
export const getProducts = async () => {
  const { data, error } = await supabase
    .from('produtos')
    .select('*');

  if (error) throw error;
  return data;
};

// Buscar Ranking (Baseado na tabela antiga de vendedores por enquanto)
export const getRanking = async () => {
  const { data, error } = await supabase
    .from('vendedores')
    .select('*')
    .order('total_vendas', { ascending: false });

  if (error) {
    console.warn("Erro ranking ou tabela vazia:", error);
    return [];
  }
  return data;
};

// Buscar Licenças/Validades próximas do vencimento
export const getExpiringLicenses = async () => {
  const hoje = new Date();
  const proximaSemana = new Date();
  proximaSemana.setDate(hoje.getDate() + 7);

  const hojeStr = hoje.toISOString().split('T')[0];
  const semanaStr = proximaSemana.toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('validades')
    .select(`
      id,
      data_fim,
      status,
      vendas (
        clientes (nome_empresa),
        produtos (nome)
      )
    `)
    .eq('status', 'Ativo')
    .gte('data_fim', hojeStr)
    .lte('data_fim', semanaStr);

  if (error) throw error;
  return data;
};

// ==========================================
// 4. ESCRITA DE DADOS (POST/INSERT)
// ==========================================

// Criar Nova Venda
export const createSale = async (venda: any) => {
  const { data, error } = await supabase
    .from('vendas')
    .insert([venda])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Criar Nova Validade (Licença)
export const createValidity = async (validade: any) => {
  const { data, error } = await supabase
    .from('validades')
    .insert([validade]);

  if (error) throw error;
  return data;
};

// Enviar Ideia ou Notificação
export const sendIdea = async (tipo: string, descricao: string, usuario_id: string) => {
  const { data, error } = await supabase
    .from('ideias')
    .insert([{ tipo, descricao, usuario_id }]);

  if (error) throw error;
  return data;
};