import { useRef, useState } from 'react';
import { IconSearch, IconSpinner, IconX } from './Icons';

export default function SearchBar({ onSearch, tipo, carregando }) {
  const [valor, setValor] = useState('');
  const inputRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    onSearch(valor);
  }

  function limpar() {
    setValor('');
    onSearch('');
    inputRef.current?.focus();
  }

  const label = tipo === 'movie' ? 'Buscar filme' : 'Buscar série';

  return (
    <form className="search-bar" onSubmit={handleSubmit} role="search">
      <div className="search-field">
        <IconSearch className="search-icon" />
        <input
          ref={inputRef}
          type="text"
          placeholder={`${label} pelo título...`}
          value={valor}
          onChange={e => setValor(e.target.value)}
          aria-label={label}
        />
        {valor && (
          <button type="button" className="search-clear" onClick={limpar} aria-label="Limpar busca">
            <IconX />
          </button>
        )}
      </div>
      <button type="submit" className="search-submit" disabled={carregando}>
        {carregando ? <IconSpinner className="spin" aria-hidden="true" /> : 'Buscar'}
      </button>
    </form>
  );
}
