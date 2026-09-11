import { IconStar } from './Icons';

// Selo de nota — convenção universal do gênero (IMDb, JustWatch, Filmow):
// estrela + número, sempre em dourado, sempre no mesmo lugar.
export default function RatingBadge({ value, className = '' }) {
  return (
    <span className={`rating-badge ${className}`}>
      <IconStar />
      {value.toFixed(1)}
    </span>
  );
}
