import MediaCard from './MediaCard';

export default function MediaGrid({ resultados, tipo, onSelect }) {
  if (resultados.length === 0) {
    return <p className="empty-state">Nenhum resultado encontrado.</p>;
  }

  return (
    <div className="media-grid">
      {resultados.map(item => (
        <MediaCard key={item.id} item={item} tipo={tipo} onSelect={onSelect} />
      ))}
    </div>
  );
}
