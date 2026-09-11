import { useEffect, useState } from 'react';
import { buscarEmAlta, buscarOndeAssistir, buscarVideos, urlPoster, urlProvedor } from '../utils/tmdb';
import { IconChevronLeft, IconChevronRight, IconPlay, IconX } from './Icons';
import RatingBadge from './RatingBadge';

const LIMITE = 7;

export default function HeroCarousel({ tipo, onSelect }) {
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [indice, setIndice] = useState(0);
  const [trailerAberto, setTrailerAberto] = useState(false);

  useEffect(() => {
    let ativo = true;
    setCarregando(true);
    setIndice(0);
    setTrailerAberto(false);

    buscarEmAlta(tipo)
      .then(async data => {
        const base = (data.results || []).filter(i => i.backdrop_path).slice(0, LIMITE);
        const completos = await Promise.all(base.map(async item => {
          const [prov, videos] = await Promise.all([
            buscarOndeAssistir(tipo, item.id).catch(() => null),
            buscarVideos(tipo, item.id).catch(() => null),
          ]);
          const br = prov?.results?.BR;
          const opcao = br?.flatrate?.[0] || br?.ads?.[0] || br?.free?.[0] || br?.rent?.[0] || br?.buy?.[0] || null;
          const trailer = (videos?.results || []).find(v => v.site === 'YouTube' && v.type === 'Trailer')
            || (videos?.results || []).find(v => v.site === 'YouTube');
          return { ...item, provedor: opcao, linkAssistir: br?.link || null, trailerKey: trailer?.key || null };
        }));
        if (ativo) setItens(completos);
      })
      .catch(() => { if (ativo) setItens([]); })
      .finally(() => { if (ativo) setCarregando(false); });

    return () => { ativo = false; };
  }, [tipo]);

  if (!carregando && itens.length === 0) return null;

  if (carregando) {
    return <div className="hero-carousel-skeleton" aria-hidden="true" />;
  }

  const item = itens[indice];
  const titulo = tipo === 'movie' ? item.title : item.name;
  const data = tipo === 'movie' ? item.release_date : item.first_air_date;
  const ano = data ? data.slice(0, 4) : '—';
  const backdrop = urlPoster(item.backdrop_path, 'w1280');

  function irPara(i) {
    setTrailerAberto(false);
    setIndice(i);
  }

  function anterior() {
    irPara((indice - 1 + itens.length) % itens.length);
  }

  function proximo() {
    irPara((indice + 1) % itens.length);
  }

  return (
    <section className="hero-carousel" aria-label="Em alta hoje">
      <h2 className="section-title hero-section-title">Em alta hoje</h2>

      <div className="hero-slide">
        <div className="hero-slide-inner" key={item.id}>
          <img src={backdrop} alt="" className="hero-backdrop" />
          <div className="hero-scrim" />

          {item.vote_average > 0 && <RatingBadge value={item.vote_average} className="hero-rating-corner" />}

          <div className="hero-content">
            <span className="hero-badge">Em alta</span>
            <h3 className="hero-title-wrap">
              <button type="button" className="hero-title" onClick={() => onSelect(item)}>
                {titulo}
              </button>
            </h3>
            <div className="hero-meta">
              <span>{ano}</span>
            </div>
            {item.overview && <p className="hero-overview">{item.overview}</p>}
            <div className="hero-actions">
              {item.trailerKey && (
                <button type="button" className="hero-trailer-btn" onClick={() => setTrailerAberto(true)}>
                  <IconPlay /> Assistir trailer
                </button>
              )}
              {item.linkAssistir && (
                <a href={item.linkAssistir} target="_blank" rel="noreferrer" className="hero-watch-btn">
                  {item.provedor && <img src={urlProvedor(item.provedor.logo_path, 'w45')} alt="" />}
                  Assista agora
                </a>
              )}
            </div>
          </div>
        </div>

        {itens.length > 1 && (
          <>
            <button type="button" className="hero-arrow hero-arrow-prev" onClick={anterior} aria-label="Título anterior">
              <IconChevronLeft />
            </button>
            <button type="button" className="hero-arrow hero-arrow-next" onClick={proximo} aria-label="Próximo título">
              <IconChevronRight />
            </button>
          </>
        )}

        {itens.length > 1 && (
          <div className="hero-dots">
            {itens.map((_, i) => (
              <button
                key={i}
                type="button"
                className={i === indice ? 'active' : ''}
                onClick={() => irPara(i)}
                aria-label={`Ir para título ${i + 1}`}
                aria-current={i === indice}
              />
            ))}
          </div>
        )}
      </div>

      {trailerAberto && item.trailerKey && (
        <div className="trailer-overlay" onClick={() => setTrailerAberto(false)}>
          <div className="trailer-box" onClick={e => e.stopPropagation()}>
            <button type="button" className="trailer-close" onClick={() => setTrailerAberto(false)} aria-label="Fechar trailer">
              <IconX />
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${item.trailerKey}?autoplay=1`}
              title={`Trailer de ${titulo}`}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
}
