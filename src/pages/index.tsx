import Table from '../components/table';
import { flowOfReact } from '../lib/flowOfReact';
import getSimilarVerbs from '../lib/getSimilarWords';
import styles from "../styles/pages.module.css"
import postReqVerbByAPI from '../lib/postReqVerbByAPI'; // Importe a função
import { useState, useEffect } from 'react';

const Conjugations = () => {
  const { state, setState, handleKeyDown } = flowOfReact();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  // Resetar a mensagem, esconder o botão e limpar a solicitação quando o valor do input mudar
  useEffect(() => {
    if (state.inputValue) {
      setIsButtonDisabled(false); // Reabilitar o botão se o input mudar
      setState(prevState => ({ 
        ...prevState, 
        hasTarget: null, // Limpar a mensagem
        showButton: false, // Esconder o botão
      }));
    }
  }, [state.inputValue, setState]);

  const formatTypes = (types: string[] | null | undefined) => {
    if (!types || types.length === 0) return '';
    if (types.length === 1) return types[0];
    return types.slice(0, -1).join(', ') + ' e ' + types[types.length - 1];
  };

  const handleButtonClick = async () => {
    await postReqVerbByAPI(state.inputValue); // Envia a solicitação
    setState(prevState => ({
      ...prevState,
      hasTarget: null
    }));
    setIsButtonDisabled(true); // Desativa o botão após o clique
  };

  return (
    <section className={styles.principal}>
      <menu className={styles.menu}>
        <h1 className={styles.h1}>Conjugations</h1>
        <input
          type="text"
          value={state.inputValue}
          onChange={(e) => setState({ ...state, inputValue: e.target.value })}
          onKeyDown={handleKeyDown}
          placeholder="Digite o verbo e pressione Enter"
          style={{ marginRight: 10, width: 300 }}
        />
        {state.loading && "conjugando..."}
      </menu>
      <section>
        {/* Exibe o botão somente se o estado corresponder à condição */}
        {!state.showConjugations && state.conjugations === null && (
          <>
            <p>{state.hasTarget}</p>
            {!isButtonDisabled && state.showButton && (
              <button onClick={handleButtonClick}>Solicitar</button> // Botão desabilitado após o clique
            )}
            {isButtonDisabled && (
              <p>Muito obrigado! Já recebemos a tua solicitação. Muito em breve iremos analisar o pedido.</p> // Mensagem de confirmação
            )}
          </>
        )}
      </section>
      <section>
        {/* Exibe as conjugações se existirem */}
        {state.showConjugations && state.conjugations !== null && (
          <>
            <p>{state.note}</p>
            {state.types && <p>Classificação: {formatTypes(state.types)}</p>}
            <Table conjugations={state.conjugations} />
          </>
        )}
      </section>
    </section>
  );
};

export default Conjugations;
