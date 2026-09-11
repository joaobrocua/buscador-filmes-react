// Lógica compartilhada entre a função serverless da Vercel (api/tmdb.js)
// e o middleware de desenvolvimento do Vite (vite.config.js).
// A chave da TMDB nunca aparece aqui: ela vem de process.env em tempo de execução,
// no servidor, e jamais é enviada ao navegador.

const ENDPOINTS_PERMITIDOS = [
  /^\/(movie|tv)\/popular$/,
  /^\/search\/(movie|tv)$/,
  /^\/(movie|tv)\/\d+$/,
];

export function endpointPermitido(caminho) {
  return typeof caminho === 'string' && ENDPOINTS_PERMITIDOS.some(re => re.test(caminho));
}

// Monta a URL da TMDB. Lança 'CHAVE_AUSENTE' quando a chave não está configurada.
export function montarUrlTmdb(caminho, query, chave) {
  if (!chave) throw new Error('CHAVE_AUSENTE');
  const url = new URL(`https://api.themoviedb.org/3${caminho}`);
  url.searchParams.set('api_key', chave);
  url.searchParams.set('language', 'pt-BR');
  if (query) url.searchParams.set('query', query);
  return url;
}
