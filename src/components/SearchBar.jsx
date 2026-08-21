import { useState } from 'react';

export default function SearchBar({ onSearch, tipo }) {
  const [valor, setValor] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    onSearch(valor);
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder={tipo === 'movie' ? 'Buscar filme...' : 'Buscar série...'}
        value={valor}
        onChange={e => setValor(e.target.value)}
      />
      <button type="submit">Buscar</button>
    </form>
  );
}
