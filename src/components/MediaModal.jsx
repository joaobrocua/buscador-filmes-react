import { useEffect, useRef, useState } from 'react';
import { buscarDetalhes, buscarOndeAssistir, urlPoster, urlProvedor } from '../utils/tmdb';
import { IconFilm, IconX } from './Icons';
import RatingBadge from './RatingBadge';
import SeasonEpisodes from './SeasonEpisodes';

export default function MediaModal({ item, tipo, onClose }) {
  const [detalhes, setDetalhes] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [ondeAssistir, setOndeAssistir] = useState(null);
  const closeBtnRef = useRef(null);

  useEffect(() => {
    let ativo = true;
    setCarregando(true);
    buscarDetalhes(tipo, item.id)
      .then(data => { if (ativo) setDetalhes(data); })
      .catch(() => { if (ativo) setDetalhes(null); })
      .finally(() => { if (ativo) setCarregando(false); });
    return () => { ativo = false; };
  }, [item.id, tipo]);

  useEffect(() => {
    let ativo = true;
    buscarOndeAssistir(tipo, item.id)
      .then(data => { if (ativo) setOndeAssistir(data.results?.BR || null); })
      .catch(() => { if (ativo) setOndeAssistir(null); });
    return () => { ativo = false; };
  }, [item.id, tipo]);

  useEffect(() => {
    const gatilho = document.activeElement;
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtnRef.current?.focus();

    function aoTeclar(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', aoTeclar);

    return () => {
      document.body.style.overflow = overflowAnterior;
      window.removeEventListener('keydown', aoTeclar);
      if (gatilho instanceof HTMLElement) gatilho.focus();
    };
  }, [onClose]);

  const titulo = tipo === 'movie' ? item.title : item.name;
  const data = tipo === 'movie' ? item.release_date : item.first_air_date;
  const poster = urlPoster(item.poster_path, 'w500');
  const tituloId = `modal-titulo-${item.id}`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby={tituloId}
        onClick={e => e.stopPropagation()}
      >
        <button ref={closeBtnRef} type="button" className="modal-close" onClick={onClose} aria-label="Fechar">
          <IconX />
        </button>

        <div className="modal-body">
          <div className="modal-poster-col">
            <div className="modal-poster">
              {poster
                ? <img src={poster} alt={titulo} />
                : <div className="media-poster-fallback"><IconFilm /></div>}
            </div>

            {ondeAssistir?.flatrate?.length > 0 && (
              <div className="modal-providers">
                <span className="modal-providers-label">Onde assistir</span>
                <div className="modal-providers-list">
                  {ondeAssistir.flatrate.map(p => (
                    <a
                      key={p.provider_id}
                      href={ondeAssistir.link}
                      target="_blank"
                      rel="noreferrer"
                      title={p.provider_name}
                    >
                      <img src={urlProvedor(p.logo_path)} alt={p.provider_name} />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="modal-text">
            <h2 id={tituloId}>{titulo}</h2>

            <div className="modal-facts">
              <span className="modal-year">{data ? data.slice(0, 4) : 'Ano desconhecido'}</span>
              {item.vote_average > 0 && <RatingBadge value={item.vote_average} />}
              {!carregando && detalhes?.runtime ? <span>{detalhes.runtime} min</span> : null}
              {!carregando && detalhes?.number_of_seasons
                ? <span>{detalhes.number_of_seasons} temporada(s)</span>
                : null}
              {!carregando && detalhes?.genres?.length > 0 && detalhes.genres.map(g => (
                <span key={g.id} className="genre-tag">{g.name}</span>
              ))}
            </div>

            <p className="modal-overview">
              {item.overview || 'Sinopse não disponível.'}
            </p>

            {tipo === 'tv' && !carregando && detalhes?.seasons?.length > 0 && (
              <SeasonEpisodes
                tvId={item.id}
                temporadas={detalhes.seasons}
                linkAssistir={ondeAssistir?.link}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
