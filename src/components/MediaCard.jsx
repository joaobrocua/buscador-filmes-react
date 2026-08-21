import { urlPoster } from '../utils/tmdb';

export default function MediaCard({ item, tipo, onSelect }) {
  const titulo = tipo === 'movie' ? item.title : item.name;
  const data = tipo === 'movie' ? item.release_date : item.first_air_date;
  const ano = data ? data.slice(0, 4) : '—';
  const poster = urlPoster(item.poster_path);

  return (
    <button className="media-card" onClick={() => onSelect(item)}>
      <div className="media-poster">
        {poster ? (
          <img src={poster} alt={titulo} loading="lazy" />
        ) : (
          <div className="media-poster-fallback">🎞️</div>
        )}
        <span className="media-rating">★ {item.vote_average?.toFixed(1) ?? '—'}</span>
      </div>
      <div className="media-info">
        <h3>{titulo}</h3>
        <p>{ano}</p>
      </div>
    </button>
  );
}
