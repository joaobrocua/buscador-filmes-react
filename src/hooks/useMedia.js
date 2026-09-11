import { useEffect, useState, useCallback } from 'react';
import { buscarPopulares, buscarPorTermo } from '../utils/tmdb';

const PAGINAS_INICIAIS = 2;

export function useMedia(tipo, provedorId, ordenarPor, generoId) {
  const [resultados, setResultados] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [erro, setErro] = useState(null);
  const [termoAtual, setTermoAtual] = useState('');
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  const carregarPopulares = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    setTermoAtual('');
    try {
      const paginas = await Promise.all(
        Array.from({ length: PAGINAS_INICIAIS }, (_, i) =>
          buscarPopulares(tipo, provedorId, ordenarPor, i + 1, generoId)),
      );
      setResultados(paginas.flatMap(p => p.results || []));
      setPagina(PAGINAS_INICIAIS);
      setTotalPaginas(paginas[0]?.total_pages || 1);
    } catch (e) {
      setErro(e.message === 'CHAVE_AUSENTE' ? 'CHAVE_AUSENTE' : 'ERRO_API');
    } finally {
      setCarregando(false);
    }
  }, [tipo, provedorId, ordenarPor, generoId]);

  const carregarMais = useCallback(async () => {
    const proxima = pagina + 1;
    if (termoAtual || proxima > totalPaginas) return;
    setCarregandoMais(true);
    try {
      const data = await buscarPopulares(tipo, provedorId, ordenarPor, proxima, generoId);
      setResultados(atuais => [...atuais, ...(data.results || [])]);
      setPagina(proxima);
    } catch {
      // a tela já tem conteúdo — uma falha aqui não vira um erro de página inteira
    } finally {
      setCarregandoMais(false);
    }
  }, [tipo, provedorId, ordenarPor, generoId, pagina, totalPaginas, termoAtual]);

  const buscar = useCallback(async (termo) => {
    if (!termo.trim()) {
      carregarPopulares();
      return;
    }
    setCarregando(true);
    setErro(null);
    setTermoAtual(termo);
    try {
      const data = await buscarPorTermo(tipo, termo);
      setResultados(data.results || []);
    } catch (e) {
      setErro(e.message === 'CHAVE_AUSENTE' ? 'CHAVE_AUSENTE' : 'ERRO_API');
    } finally {
      setCarregando(false);
    }
  }, [tipo, carregarPopulares]);

  useEffect(() => {
    carregarPopulares();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipo, provedorId, ordenarPor, generoId]);

  const podeCarregarMais = !termoAtual && pagina < totalPaginas;

  return { resultados, carregando, carregandoMais, erro, termoAtual, buscar, carregarMais, podeCarregarMais };
}
