# Caderno de Cinema — Buscador de Filmes & Séries

Mini-projeto em React (Vite) que consome a API pública do [TMDB](https://www.themoviedb.org/) para buscar filmes e séries populares, com busca por nome e página de detalhes.

As chamadas à TMDB passam por um **proxy serverless** (`api/tmdb.js`, roda na Vercel): a chave da API fica só no servidor e nunca é embutida no JavaScript enviado ao navegador.

## Como configurar (local)

1. Crie uma conta gratuita em [themoviedb.org](https://www.themoviedb.org/).
2. Vá em **Configurações (Settings) > API** e solicite uma chave de desenvolvedor (uso pessoal/educacional).
3. Copie a **"API Key (v3 auth)"**.
4. Copie `.env.example` para `.env` e preencha:

```
TMDB_API_KEY=sua_chave_aqui
```

> A variável **não** tem prefixo `VITE_` de propósito — assim ela nunca chega ao bundle do cliente. O `.env` já está no `.gitignore`.

## Como rodar

```
npm install
npm run dev
```

O `npm run dev` sobe o Vite com um middleware que reproduz o proxy `/api/tmdb` localmente — não é preciso instalar a CLI da Vercel. Abra o link mostrado no terminal (geralmente `http://localhost:5173`).

## Deploy (Vercel)

1. Importe o repositório em [vercel.com/new](https://vercel.com/new) — a Vercel detecta Vite e a pasta `api/` automaticamente.
2. Em **Settings → Environment Variables**, adicione `TMDB_API_KEY` com a sua chave (marque os ambientes Production e Preview).
3. Deploy. O front-end é estático; `api/tmdb.js` vira uma função serverless.

## Tecnologias

- React + Vite
- Função serverless (Vercel) como proxy da API TMDB
- CSS puro (sem framework de UI)

Este produto usa a API TMDB mas não é endossado ou certificado pela TMDB.
