const OPCOES = [
  { valor: 'movie', rotulo: 'Filmes' },
  { valor: 'tv', rotulo: 'Séries' },
];

export default function TypeToggle({ tipo, onChange }) {
  return (
    <div className="type-toggle" role="tablist" aria-label="Tipo de mídia">
      {OPCOES.map(o => (
        <button
          key={o.valor}
          type="button"
          role="tab"
          aria-selected={tipo === o.valor}
          className={tipo === o.valor ? 'active' : ''}
          onClick={() => onChange(o.valor)}
        >
          {o.rotulo}
        </button>
      ))}
    </div>
  );
}
