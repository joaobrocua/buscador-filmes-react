import { useState } from 'react';
import Header from './components/Header';
import TypeToggle from './components/TypeToggle';
import SearchBar from './components/SearchBar';
import ProviderFilter from './components/ProviderFilter';
import GenreFilter from './components/GenreFilter';
import SortDropdown from './components/SortDropdown';
import HeroCarousel from './components/HeroCarousel';
import MediaGrid from './components/MediaGrid';
import MediaModal from './components/MediaModal';
import ApiNotice from './components/ApiNotice';
import { IconSpinner } from './components/Icons';
import { useMedia } from './hooks/useMedia';

export default function App() {
  const [tipo, setTipo] = useState('movie');
  const [provedorId, setProvedorId] = useState(null);
  const [ordenarPor, setOrdenarPor] = useState(null);
  const [generoId, setGeneroId] = useState(null);
  const [generoNome, setGeneroNome] = useState(null);
  const [selecionado, setSelecionado] = useState(null);
  const {
    resultados, carregando, carregandoMais, erro, termoAtual, buscar, carregarMais, podeCarregarMais,
  } = useMedia(tipo, provedorId, ordenarPor, generoId);

  function trocarTipo(novoTipo) {
    setProvedorId(null);
    setOrdenarPor(null);
    setGeneroId(null);
    setGeneroNome(null);
    setTipo(novoTipo);
  }

  function aoBuscar(termo) {
    // Não zera provedorId/ordenarPor/generoId aqui: mudar esse estado dispara,
    // por conta própria, um recarregamento dos "populares" dentro do useMedia —
    // rodando ao mesmo tempo que este buscar() é uma corrida real (quem
    // responder por último vence, às vezes sumindo com o resultado da busca).
    // A busca por texto já reseta termoAtual/resultados sozinha; os filtros só
    // ficam "pausados" visualmente enquanto há um termo buscado (ver abaixo).
    buscar(termo);
  }

  function aoMudarGenero(id, nome) {
    setGeneroId(id);
    setGeneroNome(nome);
  }

  const titulo = termoAtual
    ? `Resultados para "${termoAtual}"`
    : generoId
      ? `${tipo === 'movie' ? 'Filmes' : 'Séries'} — ${generoNome}`
      : provedorId
        ? (tipo === 'movie' ? 'Filmes neste streaming' : 'Séries neste streaming')
        : tipo === 'movie' ? 'Filmes populares' : 'Séries populares';

  return (
    <>
      <Header />
      <main className="container">
        <div className="controls">
          <TypeToggle tipo={tipo} onChange={trocarTipo} />
          <SearchBar onSearch={aoBuscar} tipo={tipo} carregando={carregando} />
        </div>

        {!erro && !termoAtual && (
          <HeroCarousel tipo={tipo} onSelect={setSelecionado} />
        )}

        <div className="quick-filters">
          <GenreFilter tipo={tipo} valor={termoAtual ? null : generoId} onChange={aoMudarGenero} />
          <ProviderFilter tipo={tipo} selecionado={termoAtual ? null : provedorId} onChange={setProvedorId} />
        </div>

        <div className="results-header">
          <h2 className="section-title">{titulo}</h2>
          {!erro && !termoAtual && (
            <SortDropdown tipo={tipo} valor={ordenarPor} onChange={setOrdenarPor} />
          )}
        </div>

        {erro && <ApiNotice tipo={erro} />}

        {!erro && (
          <MediaGrid
            key={`${tipo}:${provedorId}:${ordenarPor}:${generoId}:${termoAtual}`}
            resultados={resultados}
            tipo={tipo}
            onSelect={setSelecionado}
            carregando={carregando}
          />
        )}

        {!erro && !carregando && podeCarregarMais && (
          <button type="button" className="load-more" onClick={carregarMais} disabled={carregandoMais}>
            {carregandoMais ? <IconSpinner className="spin" aria-hidden="true" /> : 'Carregar mais'}
          </button>
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
