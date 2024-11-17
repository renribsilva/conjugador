import { useRef, useEffect } from 'react';
import Table from '../components/table';
import { flowOfReact } from '../lib/flowOfReact';
import postReqVerbByAPI from '../lib/postReqVerbByAPI';
import styles from "../styles/index.module.css";
import Footer from '../components/footer';
import Socials from '../components/socials';
import Home from "../mdx/Home.mdx"
import Gracias from "../mdx/Gracias.mdx"
import About from "../mdx/About.mdx"
import Warning from "../mdx/Warning.mdx"
import SobreErros from "../mdx/SobreErros.mdx"
import Theme from '../components/theme';
import Button from '../components/button';
import postReqConjByAPI from '../lib/postReqConjByAPI';

const Conjugations = () => {

  const { state, setState, handleKeyDown } = flowOfReact();

  const formatTypes = (types: string[] | null | undefined) => {
    if (!types || types.length === 0) return '';
    if (types.length === 1) return types[0];
    return types.slice(0, -1).join(', ') + ' e ' + types[types.length - 1];
  };

  const handleSolicitar = async (inputReq) => {
    await postReqVerbByAPI(inputReq);
    setState({ 
      ...state, 
      showButton: false,
      isButtonDisabled: true 
    });
  };

  const handleReview = async (inputReq) => {
    await postReqConjByAPI(inputReq);
    setState({ 
      ...state, 
      showButton: false,
      showReviewButton: false 
    });
  };

  const handleVerbClick = (verb: string) => {
    setState({ 
      ...state,
      inputValue: verb,
      inputReq: verb
    });
  };

  const handleSobre = () => {
    setState({ 
      ...state,
      inputValue: '',
      inputReq: '',
      showHome: false,
      showSobre: true,
      conjugations: null,
      showSuggestions: false,
      showButton: false,
      isButtonDisabled: false
    });
  }

  const handleHome = () => {
    setState({ 
      ...state,
      inputValue: '',
      inputReq: '',
      showHome: true,
      showSobre: false,
      conjugations: null
    });
  }

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

  function NoteRefList({ noteRef }) {
    if (!noteRef || Object.keys(noteRef).length === 0) {
      return null; // Retorna null se não houver notas de referência
    }
  
    return (
      <ol>
        {Object.keys(noteRef)
          .sort((a, b) => parseInt(a) - parseInt(b)) // Ordena as chaves numericamente
          .map((key) => (
            Array.isArray(noteRef[key]) && noteRef[key].map((text, index) => (
              <li key={`${key}-${index}`}>{text}</li>
            ))
          ))}
      </ol>
    );
  }

  const hasNotes = state.note_ref && Object.keys(state.note_ref).length > 0;

  return (
    <>
      <section className={styles.navbar_container}>
        <div className={styles.navbar}>
          <div className={styles.input_container}>
            <input
              ref={inputRef}  // Referência do input
              className={styles.input}
              type="text"
              value={state.inputValue}
              onChange={(e) => setState({ ...state, inputValue: e.target.value })}
              onKeyDown={(e) => { handleKeyDown(e); }}
              placeholder="amar, escrever, colorir, ..."
            />
          </div>
          <div className={styles.buttons_container}>
            <div className={styles.button_sup}>
              <button 
                className={styles.button_title}
                onClick={handleHome}
              >
                conjugador-gules
              </button>
            </div>
            <div className={styles.button_inf}>
              <button 
                onClick={handleSobre}
                className={styles.button_about}
              >
                Sobre
              </button>
              <Theme />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.main}>
        <div className={styles.panel}>
          <div className={styles.subpanel}>
            <div className={styles.loading}>
              {state.loading && "conjugando..."}
            </div>
            <div>
              {state.showHome && !state.showSobre &&
                <>
                  <Home />
                  <Button onClick={handleSobre}>saber mais sobre essa poha</Button>
                </>}
              {!state.showHome && state.showSobre &&
                <>
                  <About />
                  <Button onClick={handleHome}>voltar pra Home</Button>
                </>}
              {state.conjugations === null && state.showButton && (
                <>
                  <h2>Que pena!</h2>
                  <p>{state.hasTarget}</p>
                  <Button 
                    onClick={() => handleSolicitar(state.inputReq)}
                  >
                    Solicitar
                  </Button>
                </>
              )}
              {state.isButtonDisabled && (
                <Gracias />
              )}
              {state.conjugations === null && state.showSuggestions && (
                <div>
                  <p>Selecionamos alguns verbos que podem ser parecidos com a palavra solicitada...</p>
                  <ul>
                    {state.suggestions?.map((verb, index) => (
                      <li key={index}>
                        <Button 
                          ref={buttonRef}
                          onClick={() => { handleVerbClick(verb) }}
                        >
                          {verb}
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div>
              {state.conjugations !== null && (
                <>
                  <h2>Verbo {state.foundVerb}</h2>
                  <p>{state.note_plain}</p>
                  {state.types && (
                    <p>
                      <strong>Classificação: </strong>
                      <span>{formatTypes(state.types)}</span>
                    </p>
                  )}
                  <Table conjugations={state.conjugations} />
                  <div className={styles.warning}>
                    <strong>Aviso:</strong>
                    <ul><Warning /></ul>
                  </div>
                  <div className={styles.warning}>
                    <strong>Sobre erros:</strong>
                    <ul>
                      <SobreErros />
                      {state.showReviewButton && state.showConjugations && (
                        <Button
                          onClick={() => handleReview(state.inputReq)}                      
                        >
                          Revisar a conjugação de '{state.inputReq}'
                        </Button>
                      )}
                      {!state.showReviewButton && state.showConjugations && (
                        <p>Solicitação enviada</p>
                      )}
                    </ul>
                  </div>
                  {hasNotes && (
                    <div className={styles.references}>
                      <strong>Referências:</strong>
                      <NoteRefList noteRef={state.note_ref} />
                    </div>
                  )}

                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.foot_info}>
        <Socials />
        <Footer />
      </section>

    </>
  );
};

export default Conjugations;
