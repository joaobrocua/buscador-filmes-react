import { useEffect, useRef, useState } from 'react';
import { buscarTemporada, urlPoster } from '../utils/tmdb';
import { IconChevronDown, IconFilm } from './Icons';

function formatarData(data) {
  if (!data) return 'Data desconhecida';
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}

function rotuloTemporada(t) {
  return t.season_number === 0 ? 'Especiais' : `Temporada ${t.season_number}`;
}

export default function SeasonEpisodes({ tvId, temporadas, linkAssistir }) {
  const validas = (temporadas || []).filter(t => t.episode_count > 0);
  const [numeroSelecionado, setNumeroSelecionado] = useState(() => {
    const primeiraNormal = validas.find(t => t.season_number > 0);
    return (primeiraNormal ?? validas[0])?.season_number;
  });
  const [episodios, setEpisodios] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (numeroSelecionado == null) return;
    let ativo = true;
    setCarregando(true);
    buscarTemporada(tvId, numeroSelecionado)
      .then(data => { if (ativo) setEpisodios(data.episodes || []); })
      .catch(() => { if (ativo) setEpisodios([]); })
      .finally(() => { if (ativo) setCarregando(false); });
    return () => { ativo = false; };
  }, [tvId, numeroSelecionado]);

  useEffect(() => {
    if (!menuAberto) return;

    function aoClicarFora(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuAberto(false);
      }
    }
    function aoTeclar(e) {
      if (e.key === 'Escape') setMenuAberto(false);
    }

    document.addEventListener('mousedown', aoClicarFora);
    document.addEventListener('keydown', aoTeclar);
    return () => {
      document.removeEventListener('mousedown', aoClicarFora);
      document.removeEventListener('keydown', aoTeclar);
    };
  }, [menuAberto]);

  if (validas.length === 0) return null;

  const temporadaAtual = validas.find(t => t.season_number === numeroSelecionado);

  function selecionar(numero) {
    setNumeroSelecionado(numero);
    setMenuAberto(false);
  }

  return (
    <div className="seasons-block">
      <span className="modal-providers-label">Temporadas</span>

      <div className="season-dropdown" ref={dropdownRef}>
        <button
          type="button"
          className="season-dropdown-trigger"
          aria-haspopup="listbox"
          aria-expanded={menuAberto}
          onClick={() => setMenuAberto(a => !a)}
        >
          {temporadaAtual ? rotuloTemporada(temporadaAtual) : 'Selecionar'}
          <IconChevronDown className={`season-chevron${menuAberto ? ' open' : ''}`} />
        </button>

        {menuAberto && (
          <div className="season-dropdown-list" role="listbox" aria-label="Temporadas">
            {validas.map(t => (
              <button
                key={t.season_number}
                type="button"
                role="option"
                aria-selected={numeroSelecionado === t.season_number}
                className={numeroSelecionado === t.season_number ? 'active' : ''}
                onClick={() => selecionar(t.season_number)}
              >
                {rotuloTemporada(t)}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="episode-list">
        {carregando && <p className="episode-loading">Carregando episódios...</p>}

        {!carregando && episodios.map(ep => {
          const still = urlPoster(ep.still_path, 'w185');
          return (
            <div className="episode-row" key={ep.id}>
              <span className="episode-number">{ep.episode_number}</span>
              {still
                ? <img src={still} alt="" className="episode-still" loading="lazy" />
                : <div className="episode-still episode-still-fallback"><IconFilm /></div>}
              <div className="episode-info">
                <h4>{ep.name}</h4>
                <span className="episode-meta">
                  {formatarData(ep.air_date)}
                  {ep.runtime ? ` · ${ep.runtime} min` : ''}
                </span>
              </div>
              {linkAssistir && (
                <a
                  href={linkAssistir}
                  target="_blank"
                  rel="noreferrer"
                  className="episode-watch"
                  title="Ver em quais streamings a série está disponível"
                >
                  Assistir
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
