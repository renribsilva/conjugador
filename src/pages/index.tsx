import { useEffect, useState } from 'react';
import { conjVerbByAPI } from '../lib/conjVerbByAPI';
import Table from '../components/table';
import { findedVerbByAPI } from '../lib/findedVerbByAPI';
import { ni } from '../lib/normalizeVerb';
import { isIrregVerbByAPI } from '../lib/isIrregVerbByAPI';

interface IsIrregVerbResponse {
  results: boolean;
  isIrreg: boolean;
  hasRules: boolean;
}

const Conjugations = () => {
  const [conjugations, setConjugations] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [showConjugations, setShowConjugations] = useState<boolean>(false);
  const [foundVerbValue, setFoundVerbValue] = useState<string | null>(null);

  const fetchConjugations = async () => {
    try {
      const response = await fetch('/api/queryVerb');
      if (!response.ok) throw new Error('Erro ao buscar as conjugações');
      const data = await response.json();
      setConjugations(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && inputValue.trim() !== '') {
      const normalizedInputValue = ni(inputValue);

      try {
        const result = await findedVerbByAPI(normalizedInputValue);
        if (!result) {
          setError('O verbo informado não foi encontrado.');
          return;
        }

        const response = await isIrregVerbByAPI(normalizedInputValue);
        if (!response.results) {
          setError('O verbo consta na lista de verbos irregulares, mas ainda não possui regras próprias de conjugação.');
          return; 
        }

        await conjVerbByAPI(normalizedInputValue);
        await fetchConjugations();

        setInputValue(result);
        setFoundVerbValue(result);
        setShowConjugations(true);
      } catch (err) {
        setError('Erro ao processar a conjunção: ' + err.message);
      }
    }
  };

  useEffect(() => {
    fetchConjugations();
  }, []);

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Conjugations</h1>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Digite o verbo e pressione Enter"
      />
      {showConjugations && conjugations && foundVerbValue && (
        <>
          <p>Verbo encontrado: {foundVerbValue}</p>
          <Table conjugations={conjugations} />
        </>
      )}
    </div>
  );
};

export default Conjugations;
