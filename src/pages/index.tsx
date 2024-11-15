import { useRef, useEffect } from 'react';
import Table from '../components/table';
import { flowOfReact } from '../lib/flowOfReact';
import postReqVerbByAPI from '../lib/postReqVerbByAPI';
import styles from "../styles/pages.module.css";
import { conjugateVerb } from '../lib/conjugateVerb';

const Conjugations = () => {

  const { state, setState, handleKeyDown } = flowOfReact();

  const formatTypes = (types: string[] | null | undefined) => {
    if (!types || types.length === 0) return '';
    if (types.length === 1) return types[0];
    return types.slice(0, -1).join(', ') + ' e ' + types[types.length - 1];
  };

  const handleReqButton = async (inputReq) => {
    await postReqVerbByAPI(inputReq);
    setState({ 
      ...state, 
      showButton: false,
      isButtonDisabled: true 
    });
  };

  // Define the ref with the correct type for a button element
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // Ensure buttonRef is updated once the component is mounted
  useEffect(() => {
    console.log(buttonRef.current);
  }, [state.inputReq]);

  return (
    <section className={styles.principal}>
      <div className={styles.menu}>
        <div>
          <input
            className={styles.input}
            type="text"
            value={state.inputValue}
            onChange={(e) => setState({ ...state, inputValue: e.target.value })}
            onKeyDown={(e) => { handleKeyDown(e); }}
            placeholder="amar, escrever, colorir, ..."
            style={{ marginRight: 10, width: 300 }}
          />
        </div>
        <div>
          <h1 className={styles.title}>Conjugação Aberta</h1>
        </div>
      </div>
      <div className={styles.panel}>
        <div className={styles.subpanel}>
          <div className={styles.antesala1}>
            {state.loading && "conjugando..."}
          </div>
          <div>
            {state.conjugations === null && state.showButton && (
              <>
                <h2>Que pena!</h2>
                <p>{state.hasTarget}</p>
                <button onClick={() => handleReqButton(state.inputReq)}>Solicitar</button>
              </>
            )}
            {state.isButtonDisabled && (
              <>
                <h2>Ah, muito obrigado! Sua solicitação já foi registrada. Em breve iremos analisar o pedido. Enquanto isso, gostaria de ver a conjugação de outros verbos?</h2>
                <ul>
                  {state.suggestions && state.suggestions.map((verb, index) => (
                    <li key={index}>
                      <button
                        ref={buttonRef}
                        onClick={() => {
                          conjugateVerb(verb)
                          setState({ 
                            ...state, 
                            inputValue: verb 
                          });
                          buttonRef.current
                        }}
                      >
                        {verb}
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <div className={styles.antesala2}>
            {state.conjugations !== null && (
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
