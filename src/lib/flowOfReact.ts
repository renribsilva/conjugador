import { useState, useEffect } from 'react';
import { conjVerbByAPI } from './conjVerbByAPI';
import { ni } from './normalizeVerb';
import { isValidVerbByAPI } from './isValidVerbByAPI';
import { getPropsOfVerb } from './getPropsOfVerb';
import type { Conjugation } from '../types';
import getSimilarVerbs from './getSimilarWords';

export const flowOfReact = () => {
  const [state, setState] = useState<{
    conjugations: Conjugation | null;
    inputValue: string;
    inputReq: string;
    showConjugations: boolean;
    foundVerb: string | null;
    isValidVerb: boolean;
    abundance: object | null | undefined;
    afixo: string | null | undefined;
    ending: string | null | undefined;
    hasTarget: string | boolean | null | undefined;
    note: string[] | null | undefined;
    types: string[] | null | undefined;
    loading: boolean;
    suggestions: string[] | null;
    showButton: boolean;
    isButtonDisabled: boolean
  }>({
    conjugations: null,
    inputValue: '',
    inputReq: '',
    showConjugations: false,
    foundVerb: null,
    isValidVerb: false,
    abundance: null,
    afixo: null,
    ending: null,
    hasTarget: null,
    note: null,
    types: null,
    loading: false,
    suggestions: null,
    showButton: false,
    isButtonDisabled: true,
  });

  const fetchConjugations = async () => {
    const response = await fetch('/api/queryVerb');
    if (!response.ok) throw new Error('Erro ao buscar as conjugações');
    const data: Conjugation = await response.json();
    setState(prev => ({
      ...prev,
      conjugations: data,
      loading: false,
    }));
  };

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {

    const normalizedInputValue = ni(state.inputValue);

    if (event.key === 'Enter' && state.inputValue !== '') {

      const { result, findedWord } = await isValidVerbByAPI(normalizedInputValue);
      const propsOfWord = await getPropsOfVerb(normalizedInputValue, result, findedWord);
      const suggestions = getSimilarVerbs(state.inputValue)

      // console.log(suggestions)

      setState(prev => ({
        ...prev,
        inputReq: state.inputValue,
        foundVerb: findedWord,
        isValidVerb: result,
        suggestions: suggestions,
        showButton: false,
        isButtonDisabled: true
      }));

      setState(prev => ({
        ...prev,
        abundance: propsOfWord?.abundance,
        afixo: propsOfWord?.afixo,
        ending: propsOfWord?.ending,
        types: propsOfWord?.types,
        hasTarget: null,
        note: null,
      }));

      setState(prev => ({
        ...prev,
        showConjugations: false,
      }));

      if (!result) {

        setState(prev => ({
          ...prev,
          conjugations: null,
          showConjugations: false,
          hasTarget: `Que pena! A palavra '${state.inputValue}' não foi encontrada na nossa lista de verbos válidos. Gostaria de solicitar sua inclusão?`,
          showButton: true,
          note: null,
        }));

      } else {

        setState(prev => ({
          ...prev,
          loading: true,
        }));

        await conjVerbByAPI(normalizedInputValue);
        await fetchConjugations();

        setState(prev => ({
          ...prev,
          showConjugations: true,
          hasTarget: propsOfWord?.hasTarget,
          note: propsOfWord?.note,
        }));
      }
    }
  };

  useEffect(() => {
    const data = {
      conjugations: state.conjugations,
      inputReq: state.inputReq,
      hasTarget: state.hasTarget,
      showConjugations: state.showConjugations,
      foundVerb: state.foundVerb,
      abundance: state.abundance,
      afixo: state.afixo,
      ending: state.ending,
      note: state.note,
      types: state.types,
      isValidVerb: state.isValidVerb,
      suggestions: state.suggestions,
      showButton: state.showButton,
      isButtonDisabled: state.isButtonDisabled
    };

    console.log(data);
  }, [
    state.inputReq,
    state.conjugations,
    state.hasTarget,
    state.showConjugations,
    state.foundVerb,
    state.abundance,
    state.afixo,
    state.ending,
    state.note,
    state.types,
    state.isValidVerb,
    state.suggestions,
    state.showButton,
    state.isButtonDisabled
  ]);

  return {
    state,
    setState,
    handleKeyDown,
  };
};
