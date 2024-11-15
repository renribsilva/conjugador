import { useRef, useEffect } from 'react';
import Table from '../components/table';
import { flowOfReact } from '../lib/flowOfReact';
import postReqVerbByAPI from '../lib/postReqVerbByAPI';
import styles from "../styles/pages.module.css";
import Link from 'next/link';
import Home from "../mdx/Home.mdx"

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

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      const enterEvent = new KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        key: 'Enter',
        code: 'Enter',
      });
      inputRef.current.dispatchEvent(enterEvent); 
    }
  }, [state.inputReq]);

  const handleVerbClick = (verb: string) => {
    setState({ 
      ...state,
      inputValue: verb,
      inputReq: verb
    });
  };

  function linkToRepository () {
    return (
      <span>
        <Link 
          href="https://github.com/renribsilva/conjugador" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          https//github.com/renribsilva/conjugador
        </Link>
      </span>
    )
  }

  return (
    <section className={styles.principal}>
      <div className={styles.menu}>
        <div>
          <input
            ref={inputRef}  // Referência do input
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
          <h1 className={styles.title}>conjugador-gules</h1>
        </div>
      </div>
      <Home />
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
                <h2>Ah, muito obrigado!</h2>
                <span>
                  <p>O pedido foi registrado. E lembramos que a sua contribuição é fundamental, pois não coletamos nenhum tipo de dado sem a sua expressa vontade. Quer conferir? Acesse o repositório desta aplicação: {linkToRepository()}</p>
                </span>
              </>
            )}
            {state.conjugations === null && state.showSuggestions && (
              <>
                <p>Selecionamos alguns verbos que podem ser parecidos com a palavra solicitada...</p>
                <ul>
                  {state.suggestions?.map((verb, index) => (
                    <li key={index}>
                      <button 
                        ref={buttonRef}
                        onClick={() => { handleVerbClick(verb) }}
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
