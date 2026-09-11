import { useEffect, useState } from 'react';
import { buscarProvedoresDisponiveis, urlProvedor } from '../utils/tmdb';

const LIMITE = 8;

export default function ProviderFilter({ tipo, selecionado, onChange }) {
  const [provedores, setProvedores] = useState([]);

  useEffect(() => {
    let ativo = true;
    buscarProvedoresDisponiveis(tipo)
      .then(data => {
        if (!ativo) return;
        const lista = (data.results || [])
          .filter(p => p.logo_path)
          .sort((a, b) => (a.display_priorities?.BR ?? 999) - (b.display_priorities?.BR ?? 999))
          .slice(0, LIMITE);
        setProvedores(lista);
      })
      .catch(() => { if (ativo) setProvedores([]); });
    return () => { ativo = false; };
  }, [tipo]);

  if (provedores.length === 0) return null;

  return (
    <div className="provider-filter" role="group" aria-label="Filtrar por streaming">
      {provedores.map(p => (
        <button
          key={p.provider_id}
          type="button"
          className={`provider-chip ${selecionado === p.provider_id ? 'active' : ''}`}
          onClick={() => onChange(selecionado === p.provider_id ? null : p.provider_id)}
          aria-pressed={selecionado === p.provider_id}
          title={p.provider_name}
        >
          <img src={urlProvedor(p.logo_path)} alt={p.provider_name} loading="lazy" />
        </button>
      ))}
    </div>
  );
}
