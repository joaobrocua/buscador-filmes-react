import { urlPoster } from '../utils/tmdb';
import { IconFilm } from './Icons';
import RatingBadge from './RatingBadge';

export default function MediaCard({ item, tipo, onSelect, index = 0 }) {
  const titulo = tipo === 'movie' ? item.title : item.name;
  const poster = urlPoster(item.poster_path);

  return (
    <button
      type="button"
      className="media-card"
      onClick={() => onSelect(item)}
      style={{ '--i': Math.min(index, 10) }}
    >
      <div className="media-poster">
        {poster ? (
          <img src={poster} alt={titulo} loading="lazy" />
        ) : (
          <div className="media-poster-fallback">
            <IconFilm />
          </div>
        )}
        {item.vote_average > 0 && <RatingBadge value={item.vote_average} className="media-rating" />}
        <span className="media-title-overlay">{titulo}</span>
      </div>
    </button>
  );
}
