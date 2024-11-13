import { useState, useEffect } from 'react';
import { conjVerbByAPI } from '../lib/conjVerbByAPI';
import { ni } from '../lib/normalizeVerb';
import { isValidVerbByAPI } from '../lib/isValidVerbByAPI';
import { getPropsOfVerb } from '../lib/getPropsOfVerb';
import type { Conjugation } from '../types';

export const useConjugations = () => {
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
    hasTarget: string | null | undefined;
    note: string[] | null | undefined;
    types: string[] | null | undefined;
    loading: boolean;
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

      setState(prev => ({
        ...prev,
        inputReq: state.inputValue,
        foundVerb: findedWord,
        isValidVerb: result,
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
          hasTarget: propsOfWord?.hasTarget,
          note: propsOfWord?.note,
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
  ]);

  return {
    state,
    setState,
    handleKeyDown,
  };
};
