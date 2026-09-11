// Função serverless da Vercel: proxy para a API da TMDB.
// A chave fica só no servidor, em process.env.TMDB_API_KEY (sem prefixo VITE_,
// portanto nunca é embutida no bundle do cliente).
//
// Uso pelo front-end: /api/tmdb?path=/movie/popular
//                     /api/tmdb?path=/search/movie&query=matrix
//                     /api/tmdb?path=/movie/12345

import { endpointPermitido, montarUrlTmdb } from './_tmdb-core.js';

export default async function handler(req, res) {
  const caminho = typeof req.query.path === 'string' ? req.query.path : '';
  const query = typeof req.query.query === 'string' ? req.query.query : '';

  if (!endpointPermitido(caminho)) {
    return res.status(400).json({ error: 'endpoint não permitido' });
  }

  let url;
  try {
    url = montarUrlTmdb(caminho, query, process.env.TMDB_API_KEY);
  } catch {
    return res.status(503).json({ error: 'CHAVE_AUSENTE' });
  }

  try {
    const resposta = await fetch(url);
    const corpo = await resposta.text();
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    if (resposta.ok) {
      res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    }
    return res.status(resposta.status).send(corpo);
  } catch {
    return res.status(502).json({ error: 'falha ao consultar a TMDB' });
  }
}
