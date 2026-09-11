import { IconStar, IconStarOutline } from './Icons';

export default function StarRating({ value, className = '' }) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));

  return (
    <span className={`star-rating ${className}`} role="img" aria-label={`${value.toFixed(1)} de 5 estrelas`}>
      <span className="star-row star-row-outline" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => <IconStarOutline key={i} />)}
      </span>
      <span className="star-row star-row-filled" aria-hidden="true" style={{ width: `${pct}%` }}>
        {Array.from({ length: 5 }).map((_, i) => <IconStar key={i} />)}
      </span>
    </span>
  );
}
