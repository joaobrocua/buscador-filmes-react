import { useEffect, useRef, useState } from 'react';
import { buscarDetalhes, urlPoster } from '../utils/tmdb';
import { IconFilm, IconX } from './Icons';
import StarRating from './StarRating';

export default function MediaModal({ item, tipo, onClose }) {
  const [detalhes, setDetalhes] = useState(null);
  const [carregando, setCarregando] = useState(true);
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
  const nota = item.vote_average ? item.vote_average / 2 : 0;
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
          <div className="modal-poster">
            {poster
              ? <img src={poster} alt={titulo} />
              : <div className="media-poster-fallback"><IconFilm /></div>}
          </div>

          <div className="modal-text">
            <p className="modal-dateline">
              {data ? `registrado em ${data.slice(0, 4)}` : 'data não registrada'}
            </p>
            <h2 id={tituloId}>{titulo}</h2>

            {item.vote_average > 0 && (
              <div className="modal-rating">
                <StarRating value={nota} />
                <span className="modal-rating-value">{item.vote_average.toFixed(1)}/10</span>
              </div>
            )}

            <p className="modal-runtime">
              {!carregando && detalhes?.runtime ? `${detalhes.runtime} min` : ''}
              {!carregando && detalhes?.number_of_seasons ? `${detalhes.number_of_seasons} temporada(s)` : ''}
            </p>

            {!carregando && detalhes?.genres?.length > 0 && (
              <div className="modal-genres">
                {detalhes.genres.map(g => (
                  <span key={g.id} className="genre-stamp">{g.name}</span>
                ))}
              </div>
            )}

            <p className="modal-overview">
              {item.overview || 'Sinopse não disponível.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
