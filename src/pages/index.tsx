import { useEffect, useState } from 'react';
import { conjVerbByAPI } from '../lib/conjVerbByAPI';
import Table from '../components/table';
import { ni } from '../lib/normalizeVerb';
import { findTypeOfVerb } from '../lib/findTypeOfVerb';
import { isValidVerbByAPI } from '../lib/isValidVerbByAPI';

const Conjugations = () => {
  const [conjugations, setConjugations] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [showConjugations, setShowConjugations] = useState<boolean>(false);
  const [verbType, setVerbType] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [foundVerb, setFoundVerb] = useState<string | null>(null);

  const fetchConjugations = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/queryVerb');
      if (!response.ok) throw new Error('Erro ao buscar as conjugações');
      setConjugations(await response.json());
    } catch (err) {
      setError('Erro ao buscar conjugações');
      setConjugations(null);
      setVerbType(null);
      setShowConjugations(false);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && inputValue.trim()) {
      const normalizedInputValue = ni(inputValue);
      setError(null);
      setLoading(true);
      setShowConjugations(false);

      try {
        const { result, findedVerb } = await isValidVerbByAPI(normalizedInputValue);
        if (!result) return setError('A palavra solicitada não consta na nossa lista de verbos.');
        setFoundVerb(findedVerb);

        await conjVerbByAPI(normalizedInputValue);
        await fetchConjugations();
        setVerbType(findTypeOfVerb(normalizedInputValue));
        setShowConjugations(true);
      } catch {
        setError('A palavra informada não foi encontrada.');
        setConjugations(null);
        setVerbType(null);
        setShowConjugations(false);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchConjugations();
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
          style={{ marginRight: 10, width: 300 }}
        />
        {loading && (
          <span style={{ marginLeft: 10 }}>&#x21BB;</span> // Ícone de carregamento
        )}
      </div>

      {error && <div style={{ color: 'orange', margin: '10px 0' }}>{error}</div>}

      {showConjugations && conjugations && !error && (
        <>
          <p>Verbo encontrado: {foundVerb}</p>
          <p>Tipo: {verbType}</p>
          <Table conjugations={conjugations} />
        </>
      )}
    </div>
  );
};

export default Conjugations;
