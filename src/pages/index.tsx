import Table from '../components/table';
import { flowOfReact } from '../lib/flowOfReact';
import styles from "../styles/pages.module.css";

const Conjugations = () => {
  const { state, setState, handleKeyDown } = flowOfReact();

  const formatTypes = (types: string[] | null | undefined) => {
    if (!types || types.length === 0) return '';
    if (types.length === 1) return types[0];
    return types.slice(0, -1).join(', ') + ' e ' + types[types.length - 1];
  };

  return (
    <section className={styles.principal}>
      <div className={styles.menu}>
        <div>
          <input
            className={styles.input}
            type="text"
            value={state.inputValue}
            onChange={(e) => setState({ ...state, inputValue: e.target.value })}
            onKeyDown={(e) => { handleKeyDown(e);}}
            placeholder="amar, escrever, colorir, ..."
            style={{ marginRight: 10, width: 300 }}
          />
        </div>
        <div>
          <h1 className={styles.title}>Conjugação Aberta</h1>
        </div>
      </div>
      <div className={styles.panel}>
        <div className={styles. subpanel}>
          <div className={styles.antesala1}>
            {state.loading && "conjugando..."}
          </div>
          <div className={styles.antesala2}>
            {state.showConjugations && state.conjugations !== null && (
              <>
                <h2>Verbo {state.foundVerb}</h2>
                <p>{state.note}</p>
                {state.types && (
                  <p>
                    <strong>Classificação: </strong>
                    <span>{formatTypes(state.types)}</span>
                  </p>
                )}
                <Table conjugations={state.conjugations} />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Conjugations;
