# Buscador de Filmes & Séries

Mini-projeto em React (Vite) que consome a API pública do [TMDB](https://www.themoviedb.org/) para buscar filmes e séries populares, com busca por nome e página de detalhes.

## Como configurar

1. Crie uma conta gratuita em [themoviedb.org](https://www.themoviedb.org/).
2. Vá em **Configurações (Settings) > API** e solicite uma chave de desenvolvedor (uso pessoal/educacional).
3. Copie a **"API Key (v3 auth)"**.
4. Na raiz do projeto, crie um arquivo chamado `.env` (copie o `.env.example` e renomeie) com o conteúdo:

```
VITE_TMDB_API_KEY=sua_chave_aqui
```

**Importante:** o arquivo `.env` já está no `.gitignore` — nunca é enviado pro GitHub. Assim sua chave fica só na sua máquina.

## Como rodar

```
npm install
npm run dev
```

Abra o link mostrado no terminal (geralmente `http://localhost:5173`).

## Tecnologias

- React + Vite
- API TMDB (The Movie Database)
- CSS puro (sem framework de UI)

Este produto usa a API TMDB mas não é endossado ou certificado pela TMDB.
