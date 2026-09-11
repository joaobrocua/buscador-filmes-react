import { useEffect, useRef, useState, useCallback } from 'react';
import { buscarPopulares, buscarPorTermo } from '../utils/tmdb';

const PAGINAS_INICIAIS = 2;

// A TMDB pagina por "popularidade no instante da chamada": como buscamos
// duas páginas em paralelo, a popularidade pode mudar entre uma chamada e
// outra e o mesmo título aparecer nas duas páginas. Sem isso, ele aparece
// duplicado na grade.
function semDuplicatas(itens) {
  const vistos = new Set();
  return itens.filter((item) => {
    if (vistos.has(item.id)) return false;
    vistos.add(item.id);
    return true;
  });
}

export function useMedia(tipo, provedorId, ordenarPor, generoId) {
  const [resultados, setResultados] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [erro, setErro] = useState(null);
  const [termoAtual, setTermoAtual] = useState('');
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  // Toda busca (populares, "carregar mais" ou por texto) incrementa esse
  // contador antes de disparar a chamada. Quando a resposta chega, só é
  // aplicada ao estado se ainda for a requisição mais recente — do
  // contrário, uma resposta antiga (de um clique anterior mais lento)
  // poderia chegar depois e sobrescrever o resultado do clique atual.
  const requisicaoAtual = useRef(0);

  const carregarPopulares = useCallback(async () => {
    const minhaRequisicao = ++requisicaoAtual.current;
    setCarregando(true);
    setErro(null);
    setTermoAtual('');
    try {
      const paginas = await Promise.all(
        Array.from({ length: PAGINAS_INICIAIS }, (_, i) =>
          buscarPopulares(tipo, provedorId, ordenarPor, i + 1, generoId)),
      );
      if (requisicaoAtual.current !== minhaRequisicao) return;
      setResultados(semDuplicatas(paginas.flatMap(p => p.results || [])));
      setPagina(PAGINAS_INICIAIS);
      setTotalPaginas(paginas[0]?.total_pages || 1);
    } catch (e) {
      if (requisicaoAtual.current !== minhaRequisicao) return;
      setErro(e.message === 'CHAVE_AUSENTE' ? 'CHAVE_AUSENTE' : 'ERRO_API');
    } finally {
      if (requisicaoAtual.current === minhaRequisicao) setCarregando(false);
    }
  }, [tipo, provedorId, ordenarPor, generoId]);

  const carregarMais = useCallback(async () => {
    const proxima = pagina + 1;
    if (termoAtual || proxima > totalPaginas) return;
    const minhaRequisicao = ++requisicaoAtual.current;
    setCarregandoMais(true);
    try {
      const data = await buscarPopulares(tipo, provedorId, ordenarPor, proxima, generoId);
      if (requisicaoAtual.current !== minhaRequisicao) return;
      setResultados(atuais => semDuplicatas([...atuais, ...(data.results || [])]));
      setPagina(proxima);
    } catch {
      // a tela já tem conteúdo — uma falha aqui não vira um erro de página inteira
    } finally {
      if (requisicaoAtual.current === minhaRequisicao) setCarregandoMais(false);
    }
  }, [tipo, provedorId, ordenarPor, generoId, pagina, totalPaginas, termoAtual]);

  const buscar = useCallback(async (termo) => {
    if (!termo.trim()) {
      carregarPopulares();
      return;
    }
    const minhaRequisicao = ++requisicaoAtual.current;
    setCarregando(true);
    setErro(null);
    setTermoAtual(termo);
    try {
      const data = await buscarPorTermo(tipo, termo);
      if (requisicaoAtual.current !== minhaRequisicao) return;
      setResultados(data.results || []);
    } catch (e) {
      if (requisicaoAtual.current !== minhaRequisicao) return;
      setErro(e.message === 'CHAVE_AUSENTE' ? 'CHAVE_AUSENTE' : 'ERRO_API');
    } finally {
      if (requisicaoAtual.current === minhaRequisicao) setCarregando(false);
    }
  }, [tipo, carregarPopulares]);

  useEffect(() => {
    // Espera um instante antes de buscar: se o usuário clicar em vários
    // filtros em sequência rápida (ex.: trocando de streaming várias vezes),
    // isso evita disparar uma busca — e uma troca de tela para o skeleton —
    // para cada clique intermediário, ficando só com a última escolha.
    const timer = setTimeout(() => {
      carregarPopulares();
    }, 150);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipo, provedorId, ordenarPor, generoId]);

  const podeCarregarMais = !termoAtual && pagina < totalPaginas;

  return { resultados, carregando, carregandoMais, erro, termoAtual, buscar, carregarMais, podeCarregarMais };
}
