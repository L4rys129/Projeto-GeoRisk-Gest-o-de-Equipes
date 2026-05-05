import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

function verificarToken(req) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return null;
  try {
    return jwt.verify(header.substring(7), process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'DELETE') {
    return res.status(405).json({ erro: 'Método não permitido.' });
  }

  const usuario = verificarToken(req);
  if (!usuario) return res.status(401).json({ erro: 'Não autorizado.' });

  const { id } = req.query;

  // Verifica se o alerta pertence ao usuário
  const { data: alerta } = await supabase
    .from('alertas')
    .select('usuario_id')
    .eq('id', id)
    .single();

  if (!alerta) return res.status(404).json({ erro: 'Alerta não encontrado.' });
  if (alerta.usuario_id !== usuario.id) return res.status(403).json({ erro: 'Sem permissão.' });

  const { error } = await supabase
    .from('alertas')
    .delete()
    .eq('id', id);

  if (error) return res.status(500).json({ erro: error.message });
  return res.status(200).json({ mensagem: 'Alerta removido.' });
}
