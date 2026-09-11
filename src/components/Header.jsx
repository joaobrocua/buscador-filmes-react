import { IconMark } from './Icons';

export default function Header() {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="brand">
          <IconMark className="brand-mark" />
          <h1>Caderno de Cinema</h1>
        </div>
        <p className="dateline">registro de filmes &amp; séries assistidos e por assistir</p>
      </div>
    </header>
  );
}
