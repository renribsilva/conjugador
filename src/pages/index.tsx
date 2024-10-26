// components/Conjugations.tsx
import { useEffect, useState } from 'react';
import { conjVerbByAPI } from '../lib/conjVerbByAPI';
import Table from '../components/table';
import { findedVerbByAPI } from '../lib/findedVerbByAPI'; // Importando a função findedVerbByAPI

const Conjugations = () => {
  const [conjugations, setConjugations] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [showConjugations, setShowConjugations] = useState<boolean>(false);
  const [foundVerbValue, setFoundVerbValue] = useState<string | null>(null); // Novo estado para armazenar o valor encontrado

  const fetchConjugations = async () => {
    try {
      const response = await fetch('/api/queryVerb');
      if (!response.ok) {
        throw new Error('Erro ao buscar as conjugações');
      }
      const data = await response.json();
      setConjugations(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && inputValue.trim() !== '') {
      try {
        // Verifique se o verbo existe usando findedVerbByAPI
        const result = await findedVerbByAPI(inputValue);
        setFoundVerbValue(result); // Armazena o valor encontrado
        
        // Se o verbo não for encontrado, lance um erro
        if (!result) {
          setError('O verbo informado não foi encontrado.');
          return; // Interrompa a execução se o verbo não existir
        }

        // Prossiga com a chamada para conjVerbByAPI
        await conjVerbByAPI(inputValue);
        await fetchConjugations();
        setShowConjugations(true);
      } catch (err) {
        setError('Erro ao processar a conjunção: ' + err.message);
      }
      setInputValue('');
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
        placeholder="Digite a conjugação e pressione Enter"
      />
      {foundVerbValue && <p>Verbo encontrado: {foundVerbValue}</p>} {/* Exibe o valor encontrado */}
      {showConjugations && conjugations && (
        <Table conjugations={conjugations} />
      )}
    </div>
  );
};

export default Conjugations;
