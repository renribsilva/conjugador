import { useEffect, useState } from 'react';
import { conjVerbByAPI } from '../lib/conjVerbByAPI';
import Table from '../components/table';
import { ni } from '../lib/normalizeVerb';
import { isValidVerbByAPI } from '../lib/isValidVerbByAPI';
import { findPropsOfVerb } from '../lib/findPropsOfVerb';

const Conjugations = () => {
  const [conjugations, setConjugations] = useState<any>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [inputReq, setInputReq] = useState<string>('');
  const [showConjugations, setShowConjugations] = useState<boolean>(false);
  const [foundVerb, setFoundVerb] = useState<string | null>(null);
  const [isValidVerb, setIsvalidVerb] = useState<boolean>(false);
  const [abundance, setAbundance] = useState<object | null | undefined>(null);
  const [afixo, setAfixo] = useState<string | null | undefined>(null);
  const [ending, setEnding] = useState<string | null | undefined>(null);
  const [hasTarget, setHasTarget] = useState<string | null | undefined>(null);
  const [note, setNote] = useState<string[] | null | undefined>(null);
  const [types, setTypes] = useState<string[] | null | undefined>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchConjugations = async () => {
    const response = await fetch('/api/queryVerb');
    if (!response.ok) throw new Error('Erro ao buscar as conjugações');
    setConjugations(await response.json());
    setLoading(false);
  };

  const normalizedInputValue = ni(inputValue);

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && inputValue !== '') {
      const { result, findedWord } = await isValidVerbByAPI(normalizedInputValue);
      const propsOfWord = await findPropsOfVerb(normalizedInputValue, result, findedWord);

      setInputReq(inputValue);
      setFoundVerb(findedWord);
      setIsvalidVerb(result);

      setAbundance(propsOfWord?.abundance);
      setAfixo(propsOfWord?.afixo);
      setEnding(propsOfWord?.ending);
      setTypes(propsOfWord?.types);
      setHasTarget(null);
      setNote(null);

      setShowConjugations(false);

      if (!result) {

        setConjugations(null);
        setShowConjugations(false);
        setHasTarget(propsOfWord?.hasTarget);
        setNote(propsOfWord?.note);

      } else {

        setLoading(true);
        await conjVerbByAPI(normalizedInputValue);
        await fetchConjugations();
        setShowConjugations(true);
        setHasTarget(propsOfWord?.hasTarget);
        setNote(propsOfWord?.note);

      }
    }
  };

  useEffect(() => {
    const data = {
      conjugations,
      inputReq,
      hasTarget,
      showConjugations,
      foundVerb,
      abundance,
      afixo,
      ending,
      note,
      types,
      isValidVerb,
    };

    console.log(data);
  }, [
    inputReq,
    conjugations,
    hasTarget,
    showConjugations,
    foundVerb,
    abundance,
    afixo,
    ending,
    note,
    types,
    isValidVerb,
  ]);

  // Função para formatar o array `types` como uma string
  const formatTypes = (types: string[] | null | undefined) => {
    if (!types || types.length === 0) return '';
    if (types.length === 1) return types[0];
    return types.slice(0, -1).join(', ') + ' e ' + types[types.length - 1];
  };

  return (
    <div>
      <h1>Conjugations</h1>
      <div>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite o verbo e pressione Enter"
          style={{ marginRight: 10, width: 300 }}
        />
        {loading && "conjugando..."}
      </div>
      <section>
        {!showConjugations && conjugations === null && (
          <p>{hasTarget}</p> // Exibe o hasTarget quando conjugations for null
        )}
      </section>
      <section>
        {showConjugations && conjugations !== null && (
          <>
            <p>{hasTarget}</p>
            <p>{note}</p>
            <p>{types && <p>Classificação: {formatTypes(types)}</p>}</p>
            <Table conjugations={conjugations} />
          </>
        )}
      </section>
    </div>
  );
};

export default Conjugations;
