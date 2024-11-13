import { useEffect } from 'react';
import Table from '../components/table';
import { useConjugations } from '../lib/useConjugations';

const Conjugations = () => {

  const { state, setState, handleKeyDown } = useConjugations();

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
          value={state.inputValue}
          onChange={(e) => setState({ ...state, inputValue: e.target.value })}
          onKeyDown={handleKeyDown}
          placeholder="Digite o verbo e pressione Enter"
          style={{ marginRight: 10, width: 300 }}
        />
        {state.loading && "conjugando..."}
      </div>
      <section>
        {!state.showConjugations && state.conjugations === null && (
          <p>{state.hasTarget}</p> 
        )}
      </section>
      <section>
        {state.showConjugations && state.conjugations !== null && (
          <>
            <p>{state.hasTarget}</p>
            <p>{state.note}</p>
            {state.types && <p>Classificação: {formatTypes(state.types)}</p>}
            <Table conjugations={state.conjugations} />
          </>
        )}
      </section>
    </div>
  );
};

export default Conjugations;
