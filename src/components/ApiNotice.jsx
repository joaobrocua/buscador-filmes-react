export default function ApiNotice({ tipo }) {
  if (tipo === 'CHAVE_AUSENTE') {
    return (
      <div className="api-notice">
        <h2>Chave da API não configurada</h2>
        <p>
          Crie um arquivo <code>.env</code> na raiz do projeto com a linha:
        </p>
        <pre>VITE_TMDB_API_KEY=sua_chave_aqui</pre>
        <p>
          Consiga sua chave gratuita em{' '}
          <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noreferrer">
            themoviedb.org/settings/api
          </a>{' '}
          e reinicie o servidor (<code>npm run dev</code>) depois de salvar.
        </p>
      </div>
    );
  }

  return (
    <div className="api-notice">
      <h2>Não foi possível carregar os dados</h2>
      <p>Verifique sua conexão ou tente novamente em instantes.</p>
    </div>
  );
}
