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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // GET — lista todos os alertas (público)
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('alertas')
      .select('*')
      .order('criado_em', { ascending: false });

    if (error) return res.status(500).json({ erro: error.message });
    return res.status(200).json(data);
  }

  // POST — cria novo alerta (exige token)
  if (req.method === 'POST') {
    const usuario = verificarToken(req);
    if (!usuario) return res.status(401).json({ erro: 'Não autorizado.' });

    const { tipo, comentario, latitude, longitude, automatico } = req.body;

    if (!tipo || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ erro: 'Tipo, latitude e longitude são obrigatórios.' });
    }

    const { data, error } = await supabase
      .from('alertas')
      .insert({
        tipo,
        comentario,
        latitude,
        longitude,
        automatico: automatico || false,
        usuario_id: usuario.id,
        nome_usuario: usuario.nome
      })
      .select()
      .single();

    if (error) return res.status(500).json({ erro: error.message });
    return res.status(200).json(data);
  }

  return res.status(405).json({ erro: 'Método não permitido.' });
}
