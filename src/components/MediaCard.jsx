import { urlPoster } from '../utils/tmdb';
import { IconFilm, IconPin } from './Icons';
import StarRating from './StarRating';

export default function MediaCard({ item, tipo, onSelect, index = 0 }) {
  const titulo = tipo === 'movie' ? item.title : item.name;
  const data = tipo === 'movie' ? item.release_date : item.first_air_date;
  const ano = data ? data.slice(0, 4) : '—';
  const poster = urlPoster(item.poster_path);
  const nota = item.vote_average ? item.vote_average / 2 : 0;

  return (
    <button
      type="button"
      className="media-card"
      onClick={() => onSelect(item)}
      style={{ '--i': Math.min(index, 10) }}
    >
      <IconPin className="media-pin" />
      <div className="media-poster">
        {poster ? (
          <img src={poster} alt={titulo} loading="lazy" />
        ) : (
          <div className="media-poster-fallback">
            <IconFilm />
          </div>
        )}
      </div>
      <div className="media-info">
        <h3>{titulo}</h3>
        <div className="media-meta">
          <span className="media-year">{ano}</span>
          {item.vote_average > 0 && <StarRating value={nota} className="media-stars" />}
        </div>
      </div>
    </button>
  );
}
