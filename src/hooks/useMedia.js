import { useEffect, useState, useCallback } from 'react';
import { buscarPopulares, buscarPorTermo, semChave } from '../utils/tmdb';

export function useMedia(tipo) {
  const [resultados, setResultados] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [termoAtual, setTermoAtual] = useState('');

  const carregarPopulares = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    setTermoAtual('');
    try {
      const data = await buscarPopulares(tipo);
      setResultados(data.results || []);
    } catch (e) {
      setErro(e.message === 'CHAVE_AUSENTE' ? 'CHAVE_AUSENTE' : 'ERRO_API');
    } finally {
      setCarregando(false);
    }
  }, [tipo]);

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
    if (semChave) {
      setErro('CHAVE_AUSENTE');
      return;
    }
    carregarPopulares();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipo]);

  return { resultados, carregando, erro, termoAtual, buscar };
}
