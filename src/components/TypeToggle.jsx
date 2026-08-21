export default function TypeToggle({ tipo, onChange }) {
  return (
    <div className="type-toggle">
      <button
        className={tipo === 'movie' ? 'active' : ''}
        onClick={() => onChange('movie')}
      >
        Filmes
      </button>
      <button
        className={tipo === 'tv' ? 'active' : ''}
        onClick={() => onChange('tv')}
      >
        Séries
      </button>
    </div>
  );
}
