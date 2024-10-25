import { useState } from 'react';
import { ni } from '../lib/normalizeVerb';
import Table from '../components/table';
import checkVerbByAPI from '../lib/checkVerbByAPI';
import { writeConjVerbByAPI } from '../lib/writeConjVerbByAPI';
import { findedVerbByAPI } from '../lib/findedVerbByAPI';

export default function Home() {
  const [verb, setVerb] = useState('');
  const [result, setResult] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [foundVerb, setFoundVerb] = useState<string | null>(null); // Permite que foundVerb seja string ou null

  const handleChange = (event) => {
    setVerb(event.target.value);
  };

  const normalized = ni(verb);

  const handleCheckVerb = async () => {
    const exists = await checkVerbByAPI(normalized);
    setResult(exists);
    return exists;
  };

  const handleKeyDown = async (event) => {
    if (event.key === 'Enter') {
      const exists = await handleCheckVerb();
      if (exists) {
        try {
          const result = await findedVerbByAPI(normalized); // Chama a função de fetch
          setFoundVerb(result); // Atualiza o estado com o resultado
        } catch (error) {
          setFoundVerb(error.message); // Atualiza o estado com a mensagem de erro
        }

        await writeConjVerbByAPI(normalized);
        setShowTable(true);
      } else {
        setShowTable(false);
        setFoundVerb(null); // Limpa o verbo encontrado se não existir
      }
    }
  };

  return (
    <>
      <div>
        <h1>Conjugar Verbo</h1>
        <input
          type="text"
          value={verb}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Digite o verbo"
        />
        {result !== null && foundVerb && (
          <div>
            <p>
              {verb !== foundVerb 
                ? result 
                  ? `Você quis dizer '${foundVerb}'? Aqui está a conjugação para o verbo '${foundVerb}'` 
                  : `${foundVerb} não consta em nossa base de dados.`
                : result 
                  ? `Conjugação para o verbo '${foundVerb}'.` 
                  : `'${foundVerb}' não consta em nossa base de dados.`}
            </p>
          </div>
        )}
      </div>
      {showTable && <Table verb={normalized} />} {/* Renderiza a tabela apenas se showTable for true */}
    </>
  );
}
