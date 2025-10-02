import { useRef, useEffect, useState, Suspense, lazy } from "react";
import Home from "../components/mdx/Home.mdx"
import styles from "../styles/index.module.css";
import Footer from "../components/tsx/footer";
import Socials from "../components/tsx/socials";
import Theme from "../components/tsx/theme";
import Button from "../components/tsx/button";  
import { nw } from "../lib/ssr/normalizeVerb";
import postReqVerbByAPI from "../lib/csr/postReqVerbByAPI";
import { flowOfReact } from "../lib/csr/flowOfReact";
import ProgressBar from "../components/tsx/progress";
import Sorry from "../components/mdx/Sorry.mdx"

const Table = lazy(() => import("../components/tsx/table"));
const InstallPWA = lazy(() => import("../components/tsx/install"));
const NoteRefList = lazy(() => import("../components/tsx/references"));
const Gracias = lazy(() => import("../components/mdx/Gracias.mdx"));
const About = lazy(() => import("../components/mdx/About.mdx"));
const Statistic = lazy(() => import("../components/mdx/Statistic.mdx"));
const Warning = lazy(() => import("../components/mdx/Warning.mdx"));
const Emphasis = lazy(() => import("../components/mdx/Emphasis.mdx"));
const Reflexive = lazy(() => import("../components/mdx/Reflexive.mdx"));
const SobreErros = lazy(() => import("../components/mdx/SobreErros.mdx"));

const Index = () => {

  const [activeTab, setActiveTab] = useState('home');
  const [mounted, setMounted] = useState(false);
  const [currentProgress, setCurrentProgress] = useState<number>(0);
  const [axi, setAxi] = useState<string>('');
  const [eita, setEita] = useState<string>('');
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { state, setState, handleKeyDown } = flowOfReact();

  const handleSolicitar = async (inputReq: string) => {
    setTimeout(() => {
      setCurrentProgress(0)
      setState(prev => ({ 
        ...prev, 
        progress: 50, 
        loading: true
      }));
    }, 0);
    const response = await postReqVerbByAPI(inputReq, "new_verbs");
    setState({ 
      ...state,
      showButton: false,
      isButtonDisabled: true,
      postReq: response,
      progress: 100,
      loading: false
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
      loading: false
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
      loading: false
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
      loading: false
    });
    setActiveTab('statistic');
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

  const hasNotes = state.note_ref && Object.keys(state.note_ref).length > 0;

  const axiExpression = ["Vish Maria!", "Té doidé!?", "Axi credo!", "Oxi!"]
  const randomAxi = () => {
    const randomIndex = Math.floor(Math.random() * axiExpression.length);
    setAxi(axiExpression[randomIndex]);
  };

  const eitaExpression = ["Eita!", "Oh só!", "Ih, rapaz!", "Uai!", "Vish!", "Lascou!", "Poxa vida!", "Deu ruim!"]
  const randomEita = () => {
    const randomIndex = Math.floor(Math.random() * eitaExpression.length);
    setEita(eitaExpression[randomIndex]);
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
    setTimeout(() => {
      randomAxi();
      randomEita();
    }, 500)
  }, [state.enter]);

  useEffect(() => {
    let raf: number;
    const animate = () => {
      setCurrentProgress(prev => { 
          if (state.progress === null) {
              return prev;
          }
          const target = state.progress;
          if (prev >= target - 1) {
              cancelAnimationFrame(raf);
              return target;
          }
          const increment = (target - prev) * 0.3;
          // console.log(prev)
          // console.log(increment)
          // console.log(target)
          if (target >= 100) {
            setTimeout(() => {
              setState(prev => ({ ...prev, progress: null }));
              setCurrentProgress(0);
            }, 500);
            return 100;
          }
          return prev + increment;
      });
      raf = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(raf);
}, [state.progress]);


  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return null;
  }

  // console.log("currente:", currentProgress)
  // console.log("progress:", state.progress)
  // console.log(state.progress)

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
              disabled={state.isDisabled}
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
                <div className={styles.index_tabs_button}>
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
                </div>
                <div className={styles.index_tabs_button}>
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
                </div>
                <div className={styles.index_tabs_button}>
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
                </div>
                <div className={styles.index_tabs_button}>
                  {mounted && <Theme />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* main */}
      <section className={styles.main} role="main">
        <div className={styles.panel}>
          <div className={styles.progress_container}>
            {state.progress !== null && (
              <ProgressBar progress={currentProgress} />
            )}
          </div>
          <div className={styles.subpanel}>
            <div className={styles.loading}>
              {(state.loading) && (
                <>
                  <p>aguarde...</p>
                </>
              )}
            </div>
            <Suspense fallback={null}>
              {state.showHome && !state.showSobre && !state.showStatistic &&
                <>
                  <Home />
                  <div className={styles.knowmore}>
                    <Button onClick={handleSobre}>saber mais sobre essa porra</Button>
                  </div>
                  <div className={styles.install}>
                    <InstallPWA />
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
              {state.conjugations === null && state.showButton && !state.loading && (
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
                              <span>Infelizmente a lista de vocábulos do LibreOffice não possui todas as formas verbais prefixadas. Por isso, não encontramos a palavra </span>
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
                              <span>Infelizmente a lista de vocábulos do LibreOffice não possui todas as formas verbais prefixadas. Por isso, não encontramos a palavra </span>
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
                              <span>Infelizmente a lista de vocábulos do LibreOffice não possui todas as formas verbais prefixadas. Por isso, não encontramos a palavra </span>
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
              {state.isButtonDisabled && !state.postReq &&(
                <div>
                  <Sorry/>
                  <div className={styles.gotohome}>
                    <Button onClick={handleHome}>voltar para o início</Button>
                  </div>
                </div>
              )}
              {state.isButtonDisabled && state.postReq && (
                <div>
                  <Gracias />
                  <div className={styles.gotohome}>
                    <Button onClick={handleHome}>voltar para o início</Button>
                  </div>
                </div>
              )}
            </Suspense>
            <Suspense fallback={null}>
              {state.conjugations !== null 
              && state.foundVerb
              && (nw(String(state.conjugations.canonical1.inf.p3).replace("*","")) 
                === nw(String(state.foundVerb).replace("*","")) || 
                nw(String(state.conjugations.canonical1.inf.p3).replace("*","")) 
                === "---") && (
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
                  <div className={styles.gotohome}>
                    <Button onClick={handleHome}>voltar para o início</Button>
                  </div>
                </>
              )}
            </Suspense>
          </div>
        </div>
      </section>
      {/* foot */}
      <section className={styles.foot_info}>
        <div className={styles.foot_info_div}>
          {mounted && <Socials />}
        </div>
        <div className={styles.foot_info_div}>
          <Footer />
        </div>
      </section>
    </div>
  );
};

export default Index;