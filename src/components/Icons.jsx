// Conjunto de ícones autorais em SVG — traço fino de "caneta de caderno", sem emoji.

export function IconMark({ className }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <circle cx="16" cy="16" r="14.2" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M16 8.6l2.4 5.1 5.5.6-4.1 3.8 1.2 5.5L16 20.7l-4.9 2.9 1.2-5.5-4.1-3.8 5.5-.6z"
        fill="currentColor"
      />
    </svg>
  );
}

export function IconStar({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 2.7l2.9 6.3 6.8.7-5.1 4.6 1.5 6.8L12 17.7l-6.1 3.4 1.5-6.8-5.1-4.6 6.8-.7z"
        fill="currentColor"
      />
    </svg>
  );
}

export function IconStarOutline({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 2.7l2.9 6.3 6.8.7-5.1 4.6 1.5 6.8L12 17.7l-6.1 3.4 1.5-6.8-5.1-4.6 6.8-.7z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconSearch({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M20 20l-4.4-4.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function IconX({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function IconFilm({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="2.5" y="2.5" width="19" height="19" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2.5 8.3h19M2.5 15.7h19M8.2 2.5v19M15.8 2.5v19" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function IconSpinner({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeDasharray="40 100"
      />
    </svg>
  );
}

export function IconAlert({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 3.4 22 20.6H2z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M12 9.6v4.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="17.2" r="1" fill="currentColor" />
    </svg>
  );
}

export function IconPin({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="3.6" fill="currentColor" />
      <circle cx="12" cy="12" r="3.6" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4" />
    </svg>
  );
}
