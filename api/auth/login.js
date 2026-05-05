import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ erro: 'Método não permitido.' });
  }

  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'E-mail e senha são obrigatórios.' });
  }

  // Busca usuário
  const { data: usuario, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !usuario) {
    return res.status(401).json({ erro: 'E-mail não encontrado.' });
  }

  // Verifica senha
  const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
  if (!senhaCorreta) {
    return res.status(401).json({ erro: 'Senha incorreta.' });
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
