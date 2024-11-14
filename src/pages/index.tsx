import Table from '../components/table';
import { flowOfReact } from '../lib/flowOfReact';
import postReqVerbByAPI from '../lib/postReqVerbByAPI';
import { useState, useEffect } from 'react';
import styles from "../styles/pages.module.css";

const Conjugations = () => {
  const { state, setState, handleKeyDown } = flowOfReact();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    if (state.inputValue) {
      setIsButtonDisabled(false);
      setState(prevState => ({
        ...prevState,
        hasTarget: null,
        showButton: false,
      }));
    }
  }, [state.inputValue, setState]);

  const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setState(prevState => ({
        ...prevState,
        hasTarget: null,
        showButton: false,
        showConjugations: false,
        conjugations: null,
      }));
      setIsButtonDisabled(false);
    }
  };

  const formatTypes = (types: string[] | null | undefined) => {
    if (!types || types.length === 0) return '';
    if (types.length === 1) return types[0];
    return types.slice(0, -1).join(', ') + ' e ' + types[types.length - 1];
  };

  const handleButtonClick = async () => {
    await postReqVerbByAPI(state.inputValue);
    setState(prevState => ({ ...prevState, hasTarget: null }));
    setIsButtonDisabled(true);
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
            onKeyDown={(e) => {
              handleKeyDown(e);
              handleEnterKey(e);
            }}
            placeholder="amar, viajar, colorir, ..."
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
            {!state.showConjugations && state.conjugations === null && (
              <>
                <p>{state.hasTarget}</p>
                {!isButtonDisabled && state.showButton && (
                  <button onClick={handleButtonClick}>Solicitar</button>
                )}
                {isButtonDisabled && (
                  <p>Muito obrigado! Já recebemos a tua solicitação.</p>
                )}
              </>
            )}
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
