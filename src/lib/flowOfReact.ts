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

    if (event.key === 'Enter' && state.inputValue !== '') {

      const normalizedInputValue = ni(state.inputValue)
      const { result, findedWord } = await isValidVerbByAPI(normalizedInputValue);
      const propsOfWord = await getPropsOfVerb(findedWord, result, normalizedInputValue);
      // const suggestions = getSimilarVerbs(state.inputValue)

      setState(prev => ({
        ...prev,
        conjugations: null,
        inputReq: state.inputValue,
        showConjugations: false,
        foundVerb: findedWord,
        isValidVerb: result,
        hasTarget: propsOfWord[0].hasTarget,
        ending: propsOfWord[0].ending,
        types: propsOfWord[0].types,
        abundance: propsOfWord[0].abundance,
        note: propsOfWord[0].note,
        afixo: propsOfWord[0].afixo,
        loading: false,
        suggestions: null,
        showButton: false,
        isButtonDisabled: true,
      }));

      if (!result) {

        setState(prev => ({
          ...prev,
          hasTarget: `Que pena! A palavra '${state.inputValue}' não foi encontrada na nossa lista de verbos válidos. Gostaria de solicitar sua inclusão?`,
          showButton: true,
        }));

      } else {

        setState(prev => ({
          ...prev,
          loading: true,
        }));
        
        await conjVerbByAPI(findedWord);
        await fetchConjugations();

        setState(prev => ({
          ...prev,
          showConjugations: true,
        }));
      }
    }
  };

  const dependencies = [
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
  ];
  
  useEffect(() => {
    const data = {
      conjugations: state.conjugations,
      inputValue: state.inputValue,
      inputReq: state.inputReq,
      showConjugations: state.showConjugations,
      foundVerb: state.foundVerb,
      isValidVerb: state.isValidVerb,
      abundance: state.abundance,
      afixo: state.afixo,
      ending: state.ending,
      hasTarget: state.hasTarget,
      note: state.note,
      types: state.types,
      loading: state.loading,
      suggestions: state.suggestions,
      showButton: state.showButton,
      isButtonDisabled: state.isButtonDisabled,
    };
  
    console.log(data);
  }, dependencies);

  return {
    state,
    setState,
    handleKeyDown,
  };
};
