import { useRef, useEffect, useState } from "react";
import Table from "../components/table";
import { flowOfReact } from "../lib/flowOfReact";
import styles from "../styles/index.module.css";
import Footer from "../components/footer";
import Socials from "../components/socials";
import Home from "../mdx/Home.mdx";
import Gracias from "../mdx/Gracias.mdx";
import About from "../mdx/About.mdx";
import Statistic from "../mdx/Statistic.mdx";
import Warning from "../mdx/Warning.mdx";
import Emphasis from "../mdx/Emphasis.mdx";
import Reflexive from "../mdx/Reflexive.mdx";
import SobreErros from "../mdx/SobreErros.mdx";
import Theme from "../components/theme";
import Button from "../components/button";  
import { nw } from "../lib/normalizeVerb";
import postReqVerbByAPI from "../lib/postReqVerbByAPI";
// import {Tooltip} from "@nextui-org/tooltip";

const Index = () => {

  const { state, setState, handleKeyDown } = flowOfReact();
  const [activeTab, setActiveTab] = useState('home');
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [currentProgress, setCurrentProgress] = useState<number>(0);

  const handleSolicitar = async (inputReq) => {
    await postReqVerbByAPI(inputReq, "new_verbs");
    setState({ 
      ...state,
      showButton: false,
      isButtonDisabled: true,
    });
  };

  const handleReview = async (inputReq) => {
    await postReqVerbByAPI(inputReq, "review_conj");
    setState({
      ...state, 
      showButton: false,
      showReviewButton: false,
    });
  };

  const handleVerbClick = (verb: string) => {
    setState({ 
      ...state,
      inputValue: verb,
      inputReq: verb,
      goThrough: true,
      enter:true,
    });
  };

  const handleSobre = () => {
    setState({ 
      ...state,
      inputValue: "",
      inputReq: "",
      showHome: false,
      showSobre: true,
      showStatistic: false,
      conjugations: null,
      showSuggestions: false,
      showButton: false,
      isButtonDisabled: false,
    });
    setActiveTab('sobre'); 
  };

  const handleHome = () => {
    setState({ 
      ...state,
      inputValue: "",
      inputReq: "",
      showHome: true,
      showSobre: false,
      showStatistic: false,
      conjugations: null,
      showButton: false,
      punct: null,
      isButtonDisabled: false,
    });
    setActiveTab('home');
  };

  const handleStatistic = () => {
    setState({ 
      ...state,
      inputValue: "",
      inputReq: "",
      showHome: false,
      showSobre: false,
      showStatistic: true,
      conjugations: null,
      showButton: false,
      punct: null,
      isButtonDisabled: false,
    });
    setActiveTab('statistic');
  };

  useEffect(() => {
    if (inputRef.current) {
      const enterEvent = new KeyboardEvent("keydown", {
        bubbles: true,
        cancelable: true,
        key: "Enter",
        code: "Enter",        
      });
      inputRef.current.dispatchEvent(enterEvent);
    } 
    randomAxi();
    randomEita();
  }, [state.enter]);

  // console.log(inputRef)

  function NoteRefList({ noteRef }) {
    if (!noteRef || Object.keys(noteRef).length === 0) {
      return null; 
    }
  
    return (
      <ol>
        {Object.keys(noteRef)
          .sort((a, b) => parseInt(a) - parseInt(b)) 
          .map((key) => (
            Array.isArray(noteRef[key]) && noteRef[key].map((text, index) => (
              <li key={`${key}-${index}`}>{text}</li>
            ))
          ))}
      </ol>
    );
  }

  const hasNotes = state.note_ref && Object.keys(state.note_ref).length > 0;

  const axiExpression = ["Vish Maria!", "Té doidé!?", "Axi credo!", "Oxi!"]
  const [axi, setAxi] = useState<string>('');
  const randomAxi = () => {
    const randomIndex = Math.floor(Math.random() * axiExpression.length);
    setAxi(axiExpression[randomIndex]);
  };

  const eitaExpression = ["Eita!", "Oh só!", "Ih, rapaz!", "Uai!", "Vish!", "Lascou!", "Poxa vida!", "Deu ruim!"]
  const [eita, setEita] = useState<string>('');
  const randomEita = () => {
    const randomIndex = Math.floor(Math.random() * eitaExpression.length);
    setEita(eitaExpression[randomIndex]);
  };

  const formatPuncts = (puncts: string[] | null) => {
    if (!puncts || puncts.length === 0) return null;
  
    return puncts
      .map(punct => `${punct}`)
      .join(' ');
  };
  
  const formatTypes = (types: string[] | null | undefined) => {
    if (!types || types.length === 0) {return "";}
    if (types.length === 1) {return types[0];}
    return types.slice(0, -1).join(", ") + " e " + types[types.length - 1];
  };

  useEffect(() => {

    if (currentProgress === 100) {
      setCurrentProgress(0)
      const interval = setInterval(() => {
        setCurrentProgress(prev => Math.min(prev + 3, 25));
      }, 10);
      return () => clearInterval(interval);
    }
    if (currentProgress < state.progress) {
      const interval = setInterval(() => {
        setCurrentProgress(prev => Math.min(prev + 3, state.progress));
      }, 10);
      return () => clearInterval(interval);
    }
  }, [state.progress]);

  const ProgressBar = ({ progress }: { progress: number }) => {
    return (
      <div className={styles.progress_bar}>
        {currentProgress !== 100 && (
          <div
            style={{
              width: `${progress}%`,
              background: 'var(--foreground)',
              height: '1.5px',
              transition: 'width 0.3s ease-in-out',
              borderRadius: '2rem',
            }}
          />
        )}
      </div>
    );
  };

  // console.log(currentProgress)
  // console.log(state.progress)

  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return null;
  }

  return (
    <div className={styles.index}>
      {/* header */}
      <section className={styles.navbar_container}>
        <div className={styles.navbar}>
          <div className={styles.input_container}>
            <input
              ref={inputRef}  
              className={styles.input}
              type="text"
              value={state.inputValue}
              onChange={(e) => setState({ ...state, inputValue: e.target.value })}
              onKeyDown={(e) => { handleKeyDown(e) } }
              placeholder="amar, escrever, colorir, ..."
              maxLength={50}
            />
          </div>
          <div className={styles.buttons_container}>
            <div className={styles.button_sup}>
              <button 
                className={styles.button_title}
                onClick={handleHome}
                disabled={state.loading === true}
              >
                conjugador-gules
              </button>
            </div>
            <div className={styles.index_tabs}>
              <div className={styles.index_tabs_container}>
                <button
                  onClick={handleHome}
                  className={`${styles.index_tabs_button} ${
                    activeTab === 'home' 
                    && state.conjugations === null 
                    && !state.showButton
                    && !state.loading
                    ? styles.active 
                    : styles.inactive
                  }`}
                  disabled={state.loading === true}
                >
                  início
                </button>
                <button
                  onClick={handleStatistic}
                  className={`${styles.index_tabs_button} ${
                    activeTab === 'statistic' 
                    && state.conjugations === null 
                    && !state.showButton
                    && !state.loading
                    ? styles.active 
                    : styles.inactive
                  }`}
                  disabled={state.loading === true}
                >
                  dados
                </button>
                <button
                  onClick={handleSobre}
                  className={`${styles.index_tabs_button} ${
                    activeTab === 'sobre' 
                    && state.conjugations === null 
                    && !state.showButton
                    && !state.loading
                    ? styles.active 
                    : styles.inactive
                  }`}
                  disabled={state.loading === true}
                >
                  sobre
                </button>
                {mounted && <Theme />}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* main */}
      <section className={styles.main} role="main">
        <div className={styles.panel}>
          {state.loading && <ProgressBar progress={currentProgress} />}
          <div className={styles.subpanel}>
            <div className={styles.loading}>
              {state.loading && (
                <>
                  <p>buscando...</p>
                </>
              )}
            </div>
            <div>
              {state.showHome && !state.showSobre && !state.showStatistic &&
                <>
                  <Home />
                  <div className={styles.knowmore}>
                    <Button onClick={handleSobre}>saber mais sobre essa porra</Button>
                  </div>
                </>
              } 
              {!state.showHome && state.showSobre && !state.showStatistic &&
                <>
                  <About />
                  <div className={styles.gotohome}>
                    <Button onClick={handleHome}>voltar para o início</Button>
                  </div>
                </>
              }
              {!state.showHome && !state.showSobre && state.showStatistic &&
                <>
                  <Statistic />
                  <div className={styles.gotohome}>
                    <Button onClick={handleHome}>voltar para o início</Button>
                  </div>
                </>
              }
              {state.conjugations === null && state.showButton && (
                <>
                  {state.punct !== null && 
                    <div className={styles.lascou}>
                      <div className={styles.lascou_main}>
                        <h2>{axi}</h2>
                        <div>
                          <span>[err 00] </span>
                          <span>A palavra </span>
                          <span><strong>'{state.inputReq}'</strong></span>
                          <span> contém caracteres que não podemos consultar: </span>
                          <span><strong>" {formatPuncts (state.punct)} "</strong></span>
                          {state.foundVerb && (
                            <>
                              <>
                                <span> Mas encontramos o verbo <span>
                                </span><strong>'{state.foundVerb}'</strong></span>
                                <span>, que você pode conjugar clicando no botão abaixo:</span>
                              </>
                              <div className={styles.punctButton}>
                                <Button 
                                  ref={buttonRef}
                                  onClick={() => { handleVerbClick((state.foundVerb as string)) }}
                                >
                                  {state.foundVerb}
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <div className={styles.lascou_foot}>
                        <Button onClick={handleHome}>voltar para o início</Button>
                      </div>
                    </div>
                  }
                  {!state.varPrefixFounded && state.punct === null && (
                    <>
                      {!state.varForcedVerb && state.similar === null && (
                        <div className={styles.lascou}>
                          <div className={styles.lascou_main}>
                            <h2>{eita}</h2>
                            <p>
                              <span>[err 11] </span>
                              <span>A palavra </span>
                              <span><strong>{`'${state.inputReq}'`}</strong></span>
                              <span> não foi encontrada na nossa lista de verbos válidos. Gostaria de solicitar sua inclusão?</span>
                            </p>
                            <div>
                              <Button 
                                onClick={() => handleSolicitar(state.inputReq)}
                              >
                                solicitar
                              </Button>
                            </div>
                          </div>
                          <div className={styles.lascou_suggestion}>
                            <div>
                              <p>
                                <span>{`Ou, se preferir, pode conjugar alguns verbos que semelham a`}</span>
                                <strong>{` '${state.inputReq}'`}</strong>
                              </p>
                            </div>
                            <div className={styles.suggestion_Button}>
                              {state.suggestions?.map((verb, index) => (
                                <Button 
                                  key={index}
                                  ref={buttonRef}
                                  onClick={() => { handleVerbClick(verb) }}
                                >
                                  {verb}
                                </Button>
                              ))}
                            </div>
                          </div>
                          <div className={styles.lascou_foot}>
                            <Button onClick={handleHome}>voltar para o início</Button>
                          </div>
                        </div>
                      )}
                      {!state.varForcedVerb && state.similar !== null && (
                        <div className={styles.lascou}>
                          <div className={styles.lascou_main}>
                            <h2>
                              <span>{eita}</span>
                            </h2>
                            <p>
                              <span>[err 12] </span>
                              <span>Quando buscamos a palavra </span>
                              <span><strong>'{state.inputReq}', </strong></span>
                              <span>encontramos duas palavras com pequenas diferenças formais. Por isso, você pode escolher qual forma conjugar, clicando no palavra desejada:</span>
                            </p>
                            <div>
                              <ul className={styles.similarButton}>
                                {state.similar?.map((verb, index) => (
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
                          </div>
                          <div className={styles.lascou_foot}>
                            <Button onClick={handleHome}>voltar para o início</Button>
                          </div>
                        </div>
                      )}
                      {state.varForcedVerb && state.similar === null && (
                        <div className={styles.lascou}>
                          <div className={styles.lascou_main}>
                            <h2>
                              <span>{eita}</span>
                            </h2>
                            <p>
                              <span>[err 13] </span>
                              <span>Não encontramos a palavra </span>
                              <span><strong>'{state.inputReq}'</strong></span>
                              <span> solicitada. Mas encontramos o verbo </span>
                              <span><strong>'{state.foundVerb}'.</strong></span>
                              <span> Caso queira conjugá-lo, clique no botão abaixo</span>
                            </p>
                            <div>
                              <Button 
                                ref={buttonRef}
                                onClick={() => { handleVerbClick((state.foundVerb as string)) }}
                              >
                                {state.foundVerb}
                              </Button>
                            </div>
                          </div>
                          <div className={styles.lascou_foot}>
                            <Button onClick={handleHome}>voltar para o início</Button>
                          </div>
                        </div>
                      )}
                      {state.varForcedVerb && state.similar !== null && (
                        <div className={styles.lascou}>
                          <div className={styles.lascou_main}>
                            <h2>{eita}</h2>
                            <p>
                              <span>[err 14] </span>
                              <span>{`Não encontramos a palavra solicitada. Mas encontramos outras bastante parecidas. Se quiser conjugá-las, basta clicar na palavra desejada:`}</span>
                            </p>
                            <div>
                              <ul className={styles.similarButton}>
                                {state.similar?.map((verb, index) => (
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
                          </div>
                          <div className={styles.lascou_foot}>
                            <Button onClick={handleHome}>voltar para o início</Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  {state.varPrefixFounded && state.punct === null && (
                    <>
                      {!state.varForcedVerb && state.similar === null && (
                        <div className={styles.lascou}>
                          <div className={styles.lascou_main}>
                            <h2>
                              <span>{eita}</span>
                            </h2>
                            <p>
                              <span>[err 21] </span>
                              <span>Infelizmente a lista de vocábulos do LibreOffice carece de formas verbais prefixadas. Por isso, não encontramos a palavra </span>
                              <span><strong>'{state.inputReq}'</strong></span>
                              <span>. Mas encontramos o verbo </span>
                              <span><strong>'{state.foundVerb}'.</strong></span>
                              <span> Caso queira conjugá-lo, clique no botão abaixo</span>
                            </p>
                            <div>
                            <Button 
                              ref={buttonRef}
                              onClick={() => { handleVerbClick((state.foundVerb as string)) }}
                            >
                              {state.foundVerb}
                            </Button>
                            </div>
                          </div>
                          <div className={styles.lascou_foot}>
                            <Button onClick={handleHome}>voltar para o início</Button>
                          </div>
                        </div>
                      )}
                      {!state.varForcedVerb && state.similar !== null && (
                        <div className={styles.lascou}>
                          <div className={styles.lascou_main}>
                            <h2>
                              <span>{eita}</span>
                            </h2>
                            <p>
                              <span>[err 22] </span>
                              <span>Infelizmente a lista de vocábulos do LibreOffice carece de formas verbais prefixadas. Por isso, não encontramos a palavra </span>
                              <span><strong>'{state.inputReq}'</strong></span>
                              <span>. Mas encontramos palavras muito parecidas. Clique no botão da palavra que gostaria de conjugar:</span>
                            </p>
                            <div>
                              <ul className={styles.similarButton}>
                                {state.similar?.map((verb, index) => (
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
                          </div>
                          <div className={styles.lascou_foot}>
                            <Button onClick={handleHome}>voltar para o início</Button>
                          </div>
                        </div>
                      )}
                      {state.varForcedVerb && state.similar === null && (
                        <div className={styles.lascou}>
                          <div className={styles.lascou_main}>
                            <h2>
                              <span>{eita}</span>
                            </h2>
                            <p>
                              <span>[err 23] </span>
                              <span>Infelizmente a lista de vocábulos do LibreOffice carece de formas verbais prefixadas. Por isso, não encontramos a palavra </span>
                              <span><strong>'{state.inputReq}'</strong></span>
                              <span>. Mas encontramos o verbo </span>
                              <span><strong>'{state.foundVerb}'.</strong></span>
                              <span> Caso queira conjugá-lo, clique no botão abaixo</span>
                            </p>
                            <div>
                            <Button 
                              ref={buttonRef}
                              onClick={() => { handleVerbClick((state.foundVerb as string)) }}
                            >
                              {state.foundVerb}
                            </Button>
                            </div>
                          </div>
                          <div className={styles.lascou_foot}>
                            <Button onClick={handleHome}>voltar para o início</Button>
                          </div>
                        </div>
                      )}
                      {state.varForcedVerb && state.similar !== null && (
                        <div className={styles.lascou}>
                          <div className={styles.lascou_main}>
                            <h2>{eita}</h2>
                            <p>
                              <span>[err 24] </span>
                              <span>{`Não encontramos a palavra solicitada. Mas encontramos outras bastante parecidas. Se quiser conjugá-las, basta clicar na palavra desejada:`}</span>
                            </p>
                            <div>
                              <ul className={styles.similarButton}>
                                {state.similar?.map((verb, index) => (
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
                          </div>
                          <div className={styles.lascou_foot}>
                            <Button onClick={handleHome}>voltar para o início</Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
              {state.isButtonDisabled && (
                <>
                  <Gracias />
                  <div className={styles.gotohome}>
                    <Button onClick={handleHome}>voltar para o início</Button>
                  </div>
                </>
              )}
            </div>
            <div>
              {state.conjugations !== null 
              && state.foundVerb
              && nw(String(state.conjugations.canonical1.inf.p3).replace("*","")) 
                === nw(String(state.foundVerb).replace("*","")) && (
                <>
                  <h2>
                    <span>Verbo </span> 
                    <span>{state.foundVerb} </span>
                    {/* <span>
                      <Tooltip className={styles.tooltip} content={infoContent}>
                        <span className="material-symbols-outlined">info</span>
                      </Tooltip>
                    </span> */}
                  </h2>
                  <p>{state.note_plain}</p>
                  {state.types && (
                    <p>
                      <strong>Classificação: </strong>
                      <span>{formatTypes(state.types)}</span>
                    </p>
                  )}
                  <Table 
                    conj={state.conjugations}
                    canonical={state.canonical}
                  />
                  <div className={styles.warning}>
                    <strong>Aviso:</strong>
                    <ul><Warning /></ul>
                  </div>
                  <div className={styles.warning}>
                    <strong>Destaques:</strong>
                    <ul><Emphasis /></ul>
                  </div>
                  <div className={styles.warning}>
                    <strong>Conjugação reflexiva:</strong>
                    <ul><Reflexive /></ul>
                  </div>
                  <div className={styles.warning}>
                    <strong>Sobre erros:</strong>
                    <ul>
                      <SobreErros />
                      {state.showReviewButton && state.showConjugations && (
                        <Button
                          onClick={() => handleReview(state.foundVerb)}                      
                        >
                          Revisar a conjugação de '{state.foundVerb}'
                        </Button>
                      )}
                      {!state.showReviewButton && state.showConjugations && (
                        <p><strong>Solicitação enviada</strong></p>
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
      {/* foot */}
      <section className={styles.foot_info}>
        {mounted && <Socials />}
        <Footer />
      </section>
    </div>
  );
};

export default Index;