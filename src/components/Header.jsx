import { IconMark } from './Icons';

export default function Header() {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="brand">
          <IconMark className="brand-mark" />
          <h1>Buscador de Filmes &amp; Séries</h1>
        </div>
        <p className="tagline">Explore os títulos mais populares ou pesquise pelo nome</p>
      </div>
    </header>
  );
}
