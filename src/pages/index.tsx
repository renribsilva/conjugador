import { useEffect, useState } from 'react';
import { conjVerbByAPI } from '../lib/conjVerbByAPI';
import Table from '../components/table';
import { findedVerbByAPI } from '../lib/findedVerbByAPI';
import { ni } from '../lib/normalizeVerb';
import { isIrregVerbByAPI } from '../lib/isIrregVerbByAPI';

const Conjugations = () => {
  const [conjugations, setConjugations] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [showConjugations, setShowConjugations] = useState<boolean>(false);
  const [foundVerbValue, setFoundVerbValue] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Estado de carregamento

  const fetchConjugations = async () => {
    setLoading(true); // Inicia o carregamento
    try {
      const response = await fetch('/api/queryVerb');
      if (!response.ok) throw new Error('Erro ao buscar as conjugações');
      const data = await response.json();
      setConjugations(data);
    } catch (err: any) {
      setError(err.message);
      // Resetar estados em caso de erro
      setConjugations(null);
      setFoundVerbValue(null);
      setShowConjugations(false);
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  };

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && inputValue.trim() !== '') {
      const normalizedInputValue = ni(inputValue);
      setError(null); // Limpa o erro antes de fazer a nova busca
      setLoading(true); // Inicia o carregamento
      setShowConjugations(false); // Oculta as conjugações anteriores

      try {
        const result = await findedVerbByAPI(normalizedInputValue);
        if (!result) {
          setError('O verbo informado não foi encontrado na nossa base de dados.');
          return;
        }

        const response = await isIrregVerbByAPI(normalizedInputValue);
        if (!response.results) {
          setError('O verbo consta na lista de verbos irregulares, mas ainda não possui regras próprias de conjugação.');
          return; 
        }

        await conjVerbByAPI(normalizedInputValue);
        await fetchConjugations(); // Chama a função para buscar as conjugações

        // Atualiza o estado apenas se não houver erro
        setFoundVerbValue(result);
        setShowConjugations(true);
      } catch (err) {
        setError('A palavra informada não foi encontrada na nossa base de dados.');
        // Resetar estados em caso de erro
        setConjugations(null);
        setFoundVerbValue(null);
        setShowConjugations(false);
      } finally {
        setLoading(false); // Finaliza o carregamento
      }
    }
  };

  useEffect(() => {
    fetchConjugations(); // Carrega as conjugações ao montar o componente
  }, []);

  return (
    <div>
      <h1>Conjugations</h1>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite o verbo e pressione Enter"
          style={{ marginRight: '10px', width: "300px" }} // Espaço entre o input e o ícone
        />
        
        {/* Ícone de carregamento */}
        {loading && (
          <div style={{ marginLeft: '10px' }}>
            <span className="loader" style={{ display: 'inline-block', width: '20px', height: '20px' }}>
              {/* Você pode substituir isso por um ícone de carregamento real */}
              &#x21BB; {/* Ícone de reload */}
            </span>
          </div>
        )}
      </div>

      {/* Renderização do erro, se existir */}
      {error && (
        <div style={{ color: 'orange', margin: '10px 0' }}>
          {error}
        </div>
      )}

      {/* Renderização das conjugações, se não houver erro e se estiver habilitado */}
      {showConjugations && conjugations && foundVerbValue && !error && (
        <>
          <p>Verbo encontrado: {foundVerbValue}</p>
          <Table conjugations={conjugations} />
        </>
      )}
    </div>
  );
};

export default Conjugations;
