import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { endpointPermitido, montarUrlTmdb } from './api/_tmdb-core.js'

// Em `npm run dev` a função serverless da Vercel não roda, então este plugin
// reproduz o mesmo proxy /api/tmdb no servidor de desenvolvimento do Vite.
// Assim `npm run dev` continua funcionando sem precisar do `vercel dev`.
function tmdbDevProxy(env) {
  return {
    name: 'tmdb-dev-proxy',
    configureServer(server) {
      server.middlewares.use('/api/tmdb', async (req, res) => {
        const enviar = (status, obj) => {
          res.statusCode = status
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(typeof obj === 'string' ? obj : JSON.stringify(obj))
        }
        try {
          const reqUrl = new URL(req.originalUrl || req.url, 'http://localhost')
          const caminho = reqUrl.searchParams.get('path') || ''
          const query = reqUrl.searchParams.get('query') || ''

          if (!endpointPermitido(caminho)) {
            return enviar(400, { error: 'endpoint não permitido' })
          }

          let url
          try {
            url = montarUrlTmdb(caminho, query, env.TMDB_API_KEY)
          } catch {
            return enviar(503, { error: 'CHAVE_AUSENTE' })
          }

          const resposta = await fetch(url)
          const corpo = await resposta.text()
          return enviar(resposta.status, corpo)
        } catch {
          return enviar(502, { error: 'falha ao consultar a TMDB' })
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), tmdbDevProxy(env)],
  }
})
