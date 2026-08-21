import { useEffect, useState } from 'react';
import { buscarDetalhes, urlPoster } from '../utils/tmdb';

export default function MediaModal({ item, tipo, onClose }) {
  const [detalhes, setDetalhes] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;
    setCarregando(true);
    buscarDetalhes(tipo, item.id)
      .then(data => { if (ativo) setDetalhes(data); })
      .catch(() => { if (ativo) setDetalhes(null); })
      .finally(() => { if (ativo) setCarregando(false); });
    return () => { ativo = false; };
  }, [item.id, tipo]);

  const titulo = tipo === 'movie' ? item.title : item.name;
  const data = tipo === 'movie' ? item.release_date : item.first_air_date;
  const poster = urlPoster(item.poster_path, 'w500');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="modal-body">
          <div className="modal-poster">
            {poster
              ? <img src={poster} alt={titulo} />
              : <div className="media-poster-fallback">🎞️</div>}
          </div>

          <div className="modal-text">
            <h2>{titulo}</h2>
            <p className="modal-meta">
              {data ? data.slice(0, 4) : 'Ano desconhecido'} · ★ {item.vote_average?.toFixed(1) ?? '—'}
              {!carregando && detalhes?.runtime ? ` · ${detalhes.runtime} min` : ''}
              {!carregando && detalhes?.number_of_seasons
                ? ` · ${detalhes.number_of_seasons} temporada(s)`
                : ''}
            </p>

            {!carregando && detalhes?.genres?.length > 0 && (
              <div className="modal-genres">
                {detalhes.genres.map(g => (
                  <span key={g.id} className="genre-chip">{g.name}</span>
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
