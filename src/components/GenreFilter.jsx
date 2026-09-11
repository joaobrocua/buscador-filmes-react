import { useEffect, useRef, useState } from 'react';
import { buscarGeneros } from '../utils/tmdb';
import { IconChevronDown } from './Icons';

export default function GenreFilter({ tipo, valor, onChange }) {
  const [generos, setGeneros] = useState([]);
  const [aberto, setAberto] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    let ativo = true;
    buscarGeneros(tipo)
      .then(data => { if (ativo) setGeneros(data.genres || []); })
      .catch(() => { if (ativo) setGeneros([]); });
    return () => { ativo = false; };
  }, [tipo]);

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

  // "Anime" não é um gênero real da TMDB — é um caso especial tratado em
  // buscarPopulares (gênero Animação + idioma japonês). Fica destacado no
  // topo da lista, separado dos gêneros oficiais.
  const opcoes = [
    { valor: null, rotulo: 'Todos os gêneros' },
    { valor: 'anime', rotulo: 'Anime' },
    ...generos.map(g => ({ valor: String(g.id), rotulo: g.name })),
  ];

  const atual = opcoes.find(o => o.valor === valor) || opcoes[0];

  function selecionar(o) {
    onChange(o.valor, o.valor ? o.rotulo : null);
    setAberto(false);
  }

  return (
    <div className="genre-dropdown" ref={dropdownRef}>
      <button
        type="button"
        className={`genre-dropdown-trigger${valor ? ' active' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={aberto}
        onClick={() => setAberto(a => !a)}
      >
        {atual.rotulo}
        <IconChevronDown className={`season-chevron${aberto ? ' open' : ''}`} />
      </button>

      {aberto && (
        <div className="genre-dropdown-list" role="listbox" aria-label="Filtrar por gênero">
          {opcoes.map(o => (
            <button
              key={o.rotulo}
              type="button"
              role="option"
              aria-selected={atual.valor === o.valor}
              className={atual.valor === o.valor ? 'active' : ''}
              onClick={() => selecionar(o)}
            >
              {o.rotulo}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
