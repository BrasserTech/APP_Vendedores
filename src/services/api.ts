import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../constants';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==========================================
// 1. AUTENTICAÇÃO
// ==========================================

export const loginManual = async (email: string, senha: string) => {
  const { data: userData, error: userError } = await supabase
    .from('usuarios')
    .select('*')
    .eq('email', email)
    .eq('senha', senha)
    .single();

  if (userError || !userData) return null;

  // Busca dados extras do vendedor
  const { data: vendedorData } = await supabase
    .from('vendedores')
    .select('status_autorizacao')
    .eq('usuario_id', userData.id)
    .single();

  // Regra de Login:
  // Se for Admin, entra direto.
  // Se for Vendedor, precisa estar Aprovado (status 1).
  if (userData.cargo !== 'Administrador') {
    if (!vendedorData) throw new Error("Perfil de vendedor não encontrado.");
    if (vendedorData.status_autorizacao === 2) throw new Error("Cadastro em análise. Aguarde aprovação.");
  }

  return userData;
};

export const registerManual = async (nome: string, email: string, senha: string) => {
  const { data: existingUser } = await supabase.from('usuarios').select('id').eq('email', email).single();
  let userId = existingUser?.id;

  if (!userId) {
    const { data: newUser, error } = await supabase
      .from('usuarios')
      // Todo novo cadastro nasce como 'Vendedor' por segurança
      .insert([{ nome, email, senha, cargo: 'Vendedor' }]) 
      .select().single();
    if (error) throw error;
    userId = newUser.id;
  }

  const { data: existingSeller } = await supabase.from('vendedores').select('id').eq('usuario_id', userId).single();
  if (!existingSeller) {
    await supabase.from('vendedores').insert([{ 
      nome, email, usuario_id: userId, status_autorizacao: 2, total_vendas: 0 
    }]);
  }

  return { id: userId, email };
};

// ==========================================
// 2. LEITURA DE DADOS (COM PERMISSÕES)
// ==========================================

// BUSCAR CLIENTES
// Se cargo for Admin, vê tudo. Se não, vê só os seus.
export const getClients = async (userId: string, userCargo: string = 'Vendedor') => {
  let query = supabase.from('clientes').select('*, vendedores(nome)').order('created_at', { ascending: false });

  if (userCargo !== 'Administrador') {
    query = query.eq('usuario_id', userId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

// BUSCAR VENDAS
// Renomeado de getMySales para getSales pois agora pode buscar de todos
export const getSales = async (userId: string, userCargo: string = 'Vendedor') => {
  let query = supabase
    .from('vendas')
    .select(`*, produtos(nome), clientes(nome_empresa), vendedores(nome)`)
    .order('data_venda', { ascending: false });

  if (userCargo !== 'Administrador') {
    query = query.eq('usuario_id', userId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

// BUSCAR IDEIAS E NOTIFICAÇÕES
export const getIdeas = async (userId: string, userCargo: string = 'Vendedor') => {
  const { data, error } = await supabase
    .from('ideias')
    .select(`*, vendedores:usuario_id(nome)`) // JOIN para saber quem mandou
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Filtragem Lógica:
  // 1. Admin vê tudo.
  // 2. Dono vê as suas.
  // 3. Outros vêem apenas o que NÃO é privado e NÃO é venda.
  const filteredData = data.filter((item: any) => {
    if (userCargo === 'Administrador') return true; 
    if (item.usuario_id === userId) return true;
    if (!item.privado && item.tipo !== 'Venda de Projeto') return true;
    return false;
  });

  return filteredData;
};

// BUSCAR LISTA DE VENDEDORES (Para filtro do Admin)
export const getSellersList = async () => {
  const { data } = await supabase.from('vendedores').select('*').eq('status_autorizacao', 1);
  return data || [];
};

// ==========================================
// 3. OUTROS (Ranking, Dashboard, etc)
// ==========================================

export const getRanking = async () => {
  const { data: vendedores } = await supabase.from('vendedores').select('id, nome, usuario_id').eq('status_autorizacao', 1);
  if (!vendedores) return [];

  const rankingCalculado = await Promise.all(vendedores.map(async (vendedor) => {
    const { data: vendas } = await supabase.from('vendas').select('valor_negociado').eq('usuario_id', vendedor.usuario_id);
    const totalVendas = vendas?.reduce((acc, curr) => acc + Number(curr.valor_negociado), 0) || 0;
    return {
      id: vendedor.id, nome: vendedor.nome, total_vendas: totalVendas, contratos_fechados: vendas?.length || 0
    };
  }));

  return rankingCalculado.sort((a, b) => b.total_vendas - a.total_vendas);
};

export const getDashboardMetrics = async (usuarioId: string, userCargo: string = 'Vendedor') => {
  const hoje = new Date();
  const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1).toISOString();

  // Reutiliza a lógica de permissão
  const vendas = await getSales(usuarioId, userCargo); 

  const saldoTotal = vendas?.reduce((acc: number, curr: any) => acc + Number(curr.valor_negociado), 0) || 0;
  const vendasMes = vendas?.filter((v: any) => v.data_venda >= primeiroDiaMes)
    .reduce((acc: number, curr: any) => acc + Number(curr.valor_negociado), 0) || 0;
  
  return { 
    saldoTotal, vendasMes, comissao: saldoTotal * 0.10, recentes: vendas?.slice(0, 5) || [] 
  };
};

export const getProducts = async () => {
  const { data } = await supabase.from('produtos').select('*');
  return data;
};

// --- ESCRITA (CREATE/UPDATE) ---

export const createSale = async (venda: any) => {
  const { numero_contrato, ...dadosVenda } = venda;
  const { data, error } = await supabase.from('vendas').insert([dadosVenda]).select().single();
  if (error) throw error; return data;
};

export const updateSale = async (id: string, updates: any) => {
  const { numero_contrato, ...dadosUpdate } = updates;
  const { data, error } = await supabase.from('vendas').update(dadosUpdate).eq('id', id).select().single();
  if (error) throw error; return data;
};

export const updateClient = async (id: string, updates: any) => {
  const { data, error } = await supabase.from('clientes').update(updates).eq('id', id).select().single();
  if (error) throw error; return data;
};

// Atualizado para aceitar objeto completo
export const sendIdea = async (dados: any) => {
  const { error } = await supabase.from('ideias').insert([dados]);
  if (error) throw error; return true;
};