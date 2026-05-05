import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ erro: 'Método não permitido.' });
  }

  const { nome, sobrenome, email, telefone, senha } = req.body;

  // Validações
  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Nome, e-mail e senha são obrigatórios.' });
  }
  if (senha.length < 6) {
    return res.status(400).json({ erro: 'Senha deve ter ao menos 6 caracteres.' });
  }

  // Verifica se email já existe
  const { data: existente } = await supabase
    .from('usuarios')
    .select('id')
    .eq('email', email)
    .single();

  if (existente) {
    return res.status(400).json({ erro: 'E-mail já cadastrado.' });
  }

  // Criptografa senha
  const senhaHash = await bcrypt.hash(senha, 10);

  // Insere usuário
  const { data: usuario, error } = await supabase
    .from('usuarios')
    .insert({ nome, sobrenome, email, telefone, senha: senhaHash })
    .select()
    .single();

  if (error) {
    console.error(error);
    return res.status(500).json({ erro: 'Erro ao cadastrar usuário.' });
  }

  // Gera token JWT
  const token = jwt.sign(
    { id: usuario.id, email: usuario.email, nome: usuario.nome },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  return res.status(200).json({
    token,
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email
  });
}
