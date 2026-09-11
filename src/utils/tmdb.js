// Cliente da API do TMDB via proxy próprio (/api/tmdb).
// A chave NÃO vive mais no front-end: as chamadas passam por uma função
// serverless que injeta a chave no servidor. Veja api/tmdb.js.

const PROXY = '/api/tmdb';
const IMG_BASE = 'https://image.tmdb.org/t/p';

export function urlPoster(path, tamanho = 'w342') {
  if (!path) return null;
  return `${IMG_BASE}/${tamanho}${path}`;
}

export function urlProvedor(path, tamanho = 'w92') {
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

export function buscarPopulares(tipo, provedorId, ordenarPor, pagina = 1, generoId = null) {
  // tipo: 'movie' ou 'tv'. generoId: id numérico da TMDB (string) ou 'anime'.
  if (!provedorId && !ordenarPor && !generoId) {
    return buscarNaApi(`/${tipo}/popular`, { page: pagina });
  }
  const params = { page: pagina };
  if (provedorId) {
    params.with_watch_providers = provedorId;
    // Só título disponível por assinatura — combina com o que "Onde
    // assistir" mostra no modal (também só assinatura, não aluguel/compra).
    params.with_watch_monetization_types = 'flatrate';
  }
  if (generoId === 'anime') {
    // A TMDB não tem categoria "Anime" — a aproximação honesta é gênero
    // Animação (16) + idioma original japonês, a mesma técnica usada pela
    // maioria dos catálogos de anime. Não é 100% perfeita, mas é dado real.
    params.with_genres = '16';
    params.with_original_language = 'ja';
  } else if (generoId) {
    params.with_genres = generoId;
  }
  if (ordenarPor) {
    params.sort_by = ordenarPor;
    if (ordenarPor.startsWith('vote_average')) {
      // Sem um mínimo de votos, um título com 1 nota 10 aparece antes de
      // clássicos com milhares de avaliações — não é "nota", é ruído.
      params['vote_count.gte'] = 200;
    }
  }
  return buscarNaApi(`/discover/${tipo}`, params);
}

export function buscarPorTermo(tipo, termo) {
  return buscarNaApi(`/search/${tipo}`, { query: termo });
}

export function buscarDetalhes(tipo, id) {
  return buscarNaApi(`/${tipo}/${id}`);
}

export function buscarEmAlta(tipo) {
  return buscarNaApi(`/trending/${tipo}/day`);
}

export function buscarProvedoresDisponiveis(tipo) {
  return buscarNaApi(`/watch/providers/${tipo}`);
}

export function buscarOndeAssistir(tipo, id) {
  return buscarNaApi(`/${tipo}/${id}/watch/providers`);
}

export function buscarTemporada(tvId, numeroTemporada) {
  return buscarNaApi(`/tv/${tvId}/season/${numeroTemporada}`);
}

export function buscarVideos(tipo, id) {
  return buscarNaApi(`/${tipo}/${id}/videos`);
}

export function buscarGeneros(tipo) {
  return buscarNaApi(`/genre/${tipo}/list`);
}
