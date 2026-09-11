// Lógica compartilhada entre a função serverless da Vercel (api/tmdb.js)
// e o middleware de desenvolvimento do Vite (vite.config.js).
// A chave da TMDB nunca aparece aqui: ela vem de process.env em tempo de execução,
// no servidor, e jamais é enviada ao navegador.

const ENDPOINTS_PERMITIDOS = [
  /^\/(movie|tv)\/popular$/,
  /^\/search\/(movie|tv)$/,
  /^\/(movie|tv)\/\d+$/,
  /^\/discover\/(movie|tv)$/,
  /^\/trending\/(movie|tv)\/day$/,
  /^\/watch\/providers\/(movie|tv)$/,
  /^\/(movie|tv)\/\d+\/watch\/providers$/,
  /^\/tv\/\d+\/season\/\d+$/,
  /^\/(movie|tv)\/\d+\/videos$/,
  /^\/genre\/(movie|tv)\/list$/,
];

// Parâmetros que o cliente pode influenciar. Tudo mais (região, idioma,
// a própria chave) é decidido só pelo servidor.
const PARAMS_PERMITIDOS = new Set([
  'query', 'with_watch_providers', 'sort_by', 'vote_count.gte', 'page',
  'with_genres', 'with_original_language',
]);

// Lista fechada de ordenações reais da TMDB — nunca repassamos um sort_by
// arbitrário vindo do cliente.
const SORTS_PERMITIDOS = new Set([
  'popularity.desc',
  'vote_average.desc',
  'primary_release_date.desc',
  'first_air_date.desc',
  'original_title.asc',
  'original_name.asc',
]);

export function endpointPermitido(caminho) {
  return typeof caminho === 'string' && ENDPOINTS_PERMITIDOS.some(re => re.test(caminho));
}

// Monta a URL da TMDB. Lança 'CHAVE_AUSENTE' quando a chave não está configurada.
export function montarUrlTmdb(caminho, params, chave) {
  if (!chave) throw new Error('CHAVE_AUSENTE');
  const url = new URL(`https://api.themoviedb.org/3${caminho}`);
  url.searchParams.set('api_key', chave);
  url.searchParams.set('language', 'pt-BR');
  url.searchParams.set('watch_region', 'BR');
  if (caminho.startsWith('/discover/')) {
    url.searchParams.set('sort_by', 'popularity.desc');
  }
  if (caminho.endsWith('/videos')) {
    // Amplia a busca de trailers: nem todo título tem vídeo dublado/legendado
    // catalogado, então aceitamos também o original (geralmente em inglês).
    url.searchParams.set('include_video_language', 'pt,en,null');
  }
  for (const [chaveParam, valor] of Object.entries(params || {})) {
    if (!valor || !PARAMS_PERMITIDOS.has(chaveParam)) continue;
    if (chaveParam === 'sort_by' && !SORTS_PERMITIDOS.has(valor)) continue;
    if (chaveParam === 'vote_count.gte' && !/^\d+$/.test(String(valor))) continue;
    if (chaveParam === 'page' && !/^[1-9]\d{0,2}$/.test(String(valor))) continue; // 1-999 (TMDB vai até 500)
    // Gênero: qualquer id numérico real da TMDB (vem da própria lista que
    // buscamos nela, nunca digitado livremente). "with_original_language"
    // só é usado no caso especial "Anime", por isso fica travado em "ja".
    if (chaveParam === 'with_genres' && !/^\d{1,6}$/.test(String(valor))) continue;
    if (chaveParam === 'with_original_language' && valor !== 'ja') continue;
    url.searchParams.set(chaveParam, valor);
  }
  return url;
}
