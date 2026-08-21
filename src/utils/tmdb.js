// Wrapper simples para a API do TMDB (The Movie Database).
// A chave vem de uma variável de ambiente — nunca é escrita no código.
// Veja o README para instruções de como configurar sua chave.

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p';

export const semChave = !API_KEY;

export function urlPoster(path, tamanho = 'w342') {
  if (!path) return null;
  return `${IMG_BASE}/${tamanho}${path}`;
}

async function buscarNaApi(endpoint, params = {}) {
  if (semChave) {
    throw new Error('CHAVE_AUSENTE');
  }

  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('language', 'pt-BR');
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const resp = await fetch(url);
  if (!resp.ok) {
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
