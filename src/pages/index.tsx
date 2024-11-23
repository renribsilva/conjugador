import { useRef, useEffect, useState } from "react";
import Table from "../components/table";
import { flowOfReact } from "../lib/flowOfReact";
import postReqVerbByAPI from "../lib/postReqVerbByAPI";
import styles from "../styles/index.module.css";
import Footer from "../components/footer";
import Socials from "../components/socials";
import Home from "../mdx/Home.mdx";
import Gracias from "../mdx/Gracias.mdx";
import About from "../mdx/About.mdx";
import Warning from "../mdx/Warning.mdx";
import SobreErros from "../mdx/SobreErros.mdx";
import Theme from "../components/theme";
import Button from "../components/button";
import postReqConjByAPI from "../lib/postReqConjByAPI";

const Conjugations = () => {

  const { state, setState, handleKeyDown } = flowOfReact();

  const formatTypes = (types: string[] | null | undefined) => {
    if (!types || types.length === 0) {return "";}
    if (types.length === 1) {return types[0];}
    return types.slice(0, -1).join(", ") + " e " + types[types.length - 1];
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
      inputReq: verb,
      goThrough: true,
      enter:true
    });
  };

  const handleSobre = () => {
    setState({ 
      ...state,
      inputValue: "",
      inputReq: "",
      showHome: false,
      showSobre: true,
      conjugations: null,
      showSuggestions: false,
      showButton: false,
      isButtonDisabled: false
    });
  };

  const handleHome = () => {
    setState({ 
      ...state,
      inputValue: "",
      inputReq: "",
      showHome: true,
      showSobre: false,
      conjugations: null,
      showButton: false,
      hasPunct: false,
      isButtonDisabled: false
    });
  };

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      const enterEvent = new KeyboardEvent("keydown", {
        bubbles: true,
        cancelable: true,
        key: "Enter",
        code: "Enter",
      });
      inputRef.current.dispatchEvent(enterEvent);
      inputRef.current.focus();
    }
    randomOhNo();
    randomAxi();
    randomEita();
  }, [state.enter]);

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

  const ohNoExpression = ["Vish!", "Lascou!", "Poxa vida!", "Deu ruim!"]
  const [ohNo, setOhNo] = useState<string>('');
  const randomOhNo = () => {
    const randomIndex = Math.floor(Math.random() * ohNoExpression.length);
    setOhNo(ohNoExpression[randomIndex]);
  };

  const axiExpression = ["Vish Maria!", "Té doidé!?", "Axi credo!", "Oxi!"]
  const [axi, setAxi] = useState<string>('');
  const randomAxi = () => {
    const randomIndex = Math.floor(Math.random() * axiExpression.length);
    setAxi(axiExpression[randomIndex]);
  };

  const eitaExpression = ["Eita!", "Oh só!", "Ih, rapaz!", "Uai!"]
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

  return (
    <>
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
              >
                conjugador-gules
              </button>
            </div>
            <div className={styles.button_inf}>
              <div className={styles.buttonSobre}>
                <button 
                  onClick={handleSobre}
                  className={styles.button_about}
                >
                  Sobre
                </button>
              </div>
              <div className={styles.buttonTheme}>
                <Theme />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.main}>
        <div className={styles.panel}>
          <div className={styles.subpanel}>
            <div className={styles.loading}>
              {state.loading && "buscando..."}
            </div>
            <div>
              {state.showHome && !state.showSobre &&
                <>
                  <Home />
                  <div className={styles.knowmore}>
                    <Button onClick={handleSobre}>saber mais sobre essa poha</Button>
                  </div>
                </>}
              {!state.showHome && state.showSobre &&
                <>
                  <About />
                  <div className={styles.gotohome}>
                    <Button onClick={handleHome}>voltar para o início</Button>
                  </div>
                </>}
              {state.conjugations === null && state.showButton && (
                <>
                  {state.hasPunct && state.puncts && 
                    <>
                      <h2>{axi}</h2>
                      <div>
                        <span>[err 00] </span>
                        <span>{`A palavra '${state.inputReq}' contém caracteres que não podemos consultar: `}</span>
                        <span><strong>" {formatPuncts(state.puncts)} "</strong></span>
                        {state.isValidVerb && (
                          <>
                            <span> Mas encontramos o verbo <span>
                            </span><strong>'{state.foundVerb}'</strong></span>
                            <span>, que você pode conjugar clicando no botão abaixo:</span>
                            <p>
                              <Button 
                                ref={buttonRef}
                                onClick={() => { handleVerbClick((state.foundVerb as string)) }}
                              >
                                {state.foundVerb}
                              </Button>
                            </p>
                            <p>Ou, se preferir:</p>
                          </>
                        )}
                      </div>
                      <p>
                        <Button onClick={handleHome}>voltar para o início</Button>
                      </p>
                    </>
                  }
                  {!state.hasNonPrefixVerb && !state.hasPunct && (
                    <>
                      {state.similar === null && !state.formattedIsForced && (
                        <>
                          <h2>
                            <span>{ohNo}</span>
                          </h2>
                          <p>
                            <span>[err 11] </span>
                            <span>A palavra </span>
                            <span><strong>{`'${state.inputReq}'`}</strong></span>
                            <span> não foi encontrada na nossa lista de verbos válidos. Gostaria de solicitar sua inclusão?</span>
                          </p>
                          <Button 
                            onClick={() => handleSolicitar(state.inputReq)}
                          >
                            solicitar
                          </Button>
                        </>
                      )}
                      {state.similar !== null && !state.formattedIsForced && (
                        <>
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
                        </>
                      )}
                      {state.similar === null && state.formattedIsForced && (
                        <>
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
                        </>
                      )}
                      {state.similar !== null && state.formattedIsForced && (
                        <>
                          <h2>{eita}</h2>
                          <p>
                            <span>[err 14] </span>
                            <span>{`Encontramos algumas palavras que podem estar entre as que quer conjugar. Por isso, você pode escolher qual forma conjugar, clicando no palavra desejada:`}</span>
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
                        </>
                      )}
                    </>
                  )}
                  {state.hasNonPrefixVerb && !state.hasPunct && (
                    <>
                      {state.similar === null && !state.formattedIsForced && (
                        <>
                          <h2>
                            <span>{eita}</span>
                          </h2>
                          <p>
                            <span>[err 23] </span>
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
                        </>
                      )}
                      {state.similar !== null && !state.formattedIsForced && (
                        <>
                          <h2>
                            <span>{eita}</span>
                          </h2>
                          <p>
                            <span>[err 22] </span>
                            <span>Não encontramos a palavra </span>
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
                        </>
                      )}
                      {state.similar === null && state.formattedIsForced && (
                        <>
                          <h2>
                            <span>{eita}</span>
                          </h2>
                          <p>
                            <span>[err 23] </span>
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
                        </>
                      )}
                      {state.similar !== null && state.formattedIsForced && (
                        <>
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
                        </>
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
              {state.conjugations !== null && !state.askForSimilar &&  (
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