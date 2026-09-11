import { IconAlert } from './Icons';

export default function ApiNotice({ tipo }) {
  if (tipo === 'CHAVE_AUSENTE') {
    return (
      <div className="api-notice">
        <IconAlert className="api-notice-icon" />
        <h2>Chave da API não configurada</h2>
        <p>
          No desenvolvimento local, crie um arquivo <code>.env</code> na raiz do projeto com:
        </p>
        <pre>TMDB_API_KEY=sua_chave_aqui</pre>
        <p>
          Em produção (Vercel), defina <code>TMDB_API_KEY</code> em{' '}
          <em>Settings → Environment Variables</em>. Consiga a chave gratuita em{' '}
          <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noreferrer">
            themoviedb.org/settings/api
          </a>.
        </p>
      </div>
    );
  }

  return (
    <div className="api-notice api-notice-error">
      <IconAlert className="api-notice-icon" />
      <h2>Não foi possível carregar os dados</h2>
      <p>Verifique sua conexão ou tente novamente em instantes.</p>
    </div>
  );
}
