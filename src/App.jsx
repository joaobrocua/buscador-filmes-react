import { useState } from 'react';
import Header from './components/Header';
import TypeToggle from './components/TypeToggle';
import SearchBar from './components/SearchBar';
import MediaGrid from './components/MediaGrid';
import MediaModal from './components/MediaModal';
import ApiNotice from './components/ApiNotice';
import { useMedia } from './hooks/useMedia';

export default function App() {
  const [tipo, setTipo] = useState('movie');
  const [selecionado, setSelecionado] = useState(null);
  const { resultados, carregando, erro, termoAtual, buscar } = useMedia(tipo);

  return (
    <>
      <Header />
      <main className="container">
        <div className="controls">
          <TypeToggle tipo={tipo} onChange={setTipo} />
          <SearchBar onSearch={buscar} tipo={tipo} />
        </div>

        <h2 className="section-title">
          {termoAtual
            ? `Resultados para "${termoAtual}"`
            : tipo === 'movie' ? 'Filmes populares' : 'Séries populares'}
        </h2>

        {erro && <ApiNotice tipo={erro} />}

        {!erro && carregando && <p className="loading-state">Carregando...</p>}

        {!erro && !carregando && (
          <MediaGrid resultados={resultados} tipo={tipo} onSelect={setSelecionado} />
        )}
      </main>

      {selecionado && (
        <MediaModal
          item={selecionado}
          tipo={tipo}
          onClose={() => setSelecionado(null)}
        />
      )}

      <footer className="footer">
        <p>Dados fornecidos por TMDB. Este produto não é endossado ou certificado pela TMDB.</p>
      </footer>
    </>
  );
}
