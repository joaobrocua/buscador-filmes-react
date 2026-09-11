import { useEffect, useRef, useState } from 'react';
import { IconChevronDown } from './Icons';

// Só ordenações que a TMDB sustenta com dado real. Nada de "Trending"
// (já é a fileira "Em alta"), "Acaso" ou "Classificação IMDb" — não temos
// essas fontes.
const OPCOES_MOVIE = [
  { valor: null, rotulo: 'Popularidade' },
  { valor: 'vote_average.desc', rotulo: 'Nota' },
  { valor: 'primary_release_date.desc', rotulo: 'Lançamento recente' },
  { valor: 'original_title.asc', rotulo: 'Alfabética' },
];

const OPCOES_TV = [
  { valor: null, rotulo: 'Popularidade' },
  { valor: 'vote_average.desc', rotulo: 'Nota' },
  { valor: 'first_air_date.desc', rotulo: 'Lançamento recente' },
  { valor: 'original_name.asc', rotulo: 'Alfabética' },
];

export default function SortDropdown({ tipo, valor, onChange }) {
  const [aberto, setAberto] = useState(false);
  const dropdownRef = useRef(null);
  const opcoes = tipo === 'movie' ? OPCOES_MOVIE : OPCOES_TV;
  const atual = opcoes.find(o => o.valor === valor) || opcoes[0];

  useEffect(() => {
    if (!aberto) return;

    function aoClicarFora(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setAberto(false);
      }
    }
    function aoTeclar(e) {
      if (e.key === 'Escape') setAberto(false);
    }

    document.addEventListener('mousedown', aoClicarFora);
    document.addEventListener('keydown', aoTeclar);
    return () => {
      document.removeEventListener('mousedown', aoClicarFora);
      document.removeEventListener('keydown', aoTeclar);
    };
  }, [aberto]);

  function selecionar(v) {
    onChange(v);
    setAberto(false);
  }

  return (
    <div className="sort-dropdown" ref={dropdownRef}>
      <button
        type="button"
        className="sort-dropdown-trigger"
        aria-haspopup="listbox"
        aria-expanded={aberto}
        onClick={() => setAberto(a => !a)}
      >
        <span className="sort-dropdown-label">Ordenar por</span>
        {atual.rotulo}
        <IconChevronDown className={`season-chevron${aberto ? ' open' : ''}`} />
      </button>

      {aberto && (
        <div className="sort-dropdown-list" role="listbox" aria-label="Ordenar por">
          {opcoes.map(o => (
            <button
              key={o.rotulo}
              type="button"
              role="option"
              aria-selected={atual.valor === o.valor}
              className={atual.valor === o.valor ? 'active' : ''}
              onClick={() => selecionar(o.valor)}
            >
              {o.rotulo}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
