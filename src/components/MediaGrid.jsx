import MediaCard from './MediaCard';
import { IconFilm } from './Icons';

const SKELETON_COUNT = 10;

export default function MediaGrid({ resultados, tipo, onSelect, carregando }) {
  if (carregando) {
    return (
      <div className="media-grid" aria-hidden="true">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <div className="media-card media-card-skeleton" key={i}>
            <div className="media-poster skeleton-block" />
            <div className="media-info">
              <div className="skeleton-line skeleton-line-title" />
              <div className="skeleton-line skeleton-line-sub" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (resultados.length === 0) {
    return (
      <div className="empty-state">
        <IconFilm className="empty-icon" />
        <p>Nenhum resultado encontrado nas fichas do arquivo.</p>
      </div>
    );
  }

  return (
    <div className="media-grid">
      {resultados.map((item, i) => (
        <MediaCard key={item.id} item={item} tipo={tipo} onSelect={onSelect} index={i} />
      ))}
    </div>
  );
}
