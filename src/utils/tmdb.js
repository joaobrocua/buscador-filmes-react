// Cliente da API do TMDB via proxy próprio (/api/tmdb).
// A chave NÃO vive mais no front-end: as chamadas passam por uma função
// serverless que injeta a chave no servidor. Veja api/tmdb.js.

const PROXY = '/api/tmdb';
const IMG_BASE = 'https://image.tmdb.org/t/p';

export function urlPoster(path, tamanho = 'w342') {
  if (!path) return null;
  return `${IMG_BASE}/${tamanho}${path}`;
}

async function buscarNaApi(caminho, params = {}) {
  const qs = new URLSearchParams({ path: caminho, ...params });
  const resp = await fetch(`${PROXY}?${qs}`);

  if (!resp.ok) {
    if (resp.status === 503) {
      throw new Error('CHAVE_AUSENTE');
    }
    throw new Error(`Erro na API TMDB: ${resp.status}`);
  }
  return resp.json();
}

export function buscarPopulares(tipo) {
  // tipo: 'movie' ou 'tv'
  return buscarNaApi(`/${tipo}/popular`);
}

export function buscarPorTermo(tipo, termo) {
  return buscarNaApi(`/search/${tipo}`, { query: termo });
}

export function buscarDetalhes(tipo, id) {
  return buscarNaApi(`/${tipo}/${id}`);
}
