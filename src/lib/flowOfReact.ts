import { useState, useEffect } from "react";
import { conjVerbByAPI } from "./conjVerbByAPI";
import { ni } from "./normalizeVerb";
import { isValidVerbByAPI } from "./isValidVerbByAPI";
import { getPropsOfVerb } from "./getPropsOfVerb";
import type { Conjugation } from "../types";
import getSimilarVerbs from "./getSimilarWords";

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
    hasTarget: string | boolean | null ;
    note_plain: string[] | null | undefined;
    note_ref: object | null;
    types: string[] | null | undefined;
    loading: boolean;
    suggestions: string[] | null;
    showSuggestions: boolean;
    showButton: boolean;
    isButtonDisabled: boolean;
    showHome: boolean;
    showSobre: boolean;
    showReviewButton: boolean;
  }>({
    conjugations: null,
    inputValue: "",
    inputReq: "",
    showConjugations: false,
    foundVerb: null,
    isValidVerb: false,
    abundance: null,
    afixo: null,
    ending: null,
    hasTarget: null,
    note_plain: null,
    note_ref: null,
    types: null,
    loading: false,
    suggestions: null,
    showButton: false,
    isButtonDisabled: false,
    showSuggestions: false,
    showHome: true,
    showSobre: false,
    showReviewButton: false
  });

  const fetchConjugations = async () => {
    const response = await fetch("/api/queryVerb");
    if (!response.ok) {throw new Error("Erro ao buscar as conjugações");}
    const data: Conjugation = await response.json();
    setState(prev => ({
      ...prev,
      conjugations: data,
      loading: false,
    }));
  };

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {

    if (event.key === "Enter" && state.inputValue !== "") {

      const normalizedInputValue = ni(state.inputValue);

      let result = false;
      let findedWord = "";
  
      if (normalizedInputValue !== "") {
        const apiResponse = await isValidVerbByAPI(normalizedInputValue);
        result = apiResponse.result;
        findedWord = apiResponse.findedWord;
      }

      const propsOfWord = await getPropsOfVerb(normalizedInputValue, result, findedWord);
      const suggestions = getSimilarVerbs(state.inputValue);

      setState(prev => ({
        ...prev,
        conjugations: null,
        inputValue: "",
        inputReq: state.inputValue,
        showConjugations: false,
        foundVerb: findedWord,
        isValidVerb: result,
        loading: false,
        suggestions: null,
        showButton: false,
        showSuggestions: false,
        isButtonDisabled: false,
        showHome: false,
        showSobre: false,
        showReviewButton: false
      }));

      if (!result) {

        setState(prev => ({
          ...prev,
          showButton: true,
          suggestions: suggestions,
          showSuggestions: true,
          ending: null,
          hasTarget: `A palavra '${state.inputValue}' não foi encontrada na nossa lista de verbos válidos. Gostaria de solicitar sua inclusão?`,
          types: null,
          abundance: null,
          note_plain: null,
          note_ref: null,
          afixo: null,
          showReviewButton: false
        }));

      } else {

        setState(prev => ({
          ...prev,
          loading: true,
          ending: propsOfWord[0].ending,
          hasTarget: propsOfWord[0].hasTarget,
          types: propsOfWord[0].types,
          abundance: propsOfWord[0].abundance,
          note_plain: propsOfWord[0].note_plain,
          note_ref: propsOfWord[0].note_ref,
          afixo: propsOfWord[0].afixo,
          showReviewButton: true
        }));
        
        await conjVerbByAPI(ni(findedWord));
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
    state.note_plain,
    state.note_ref,
    state.types,
    state.isValidVerb,
    state.suggestions,
    state.showButton,
    state.isButtonDisabled,
    state.showSuggestions,
    state.showHome,
    state.showSobre,
    state.showReviewButton
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
      note_plain: state.note_ref,
      types: state.types,
      loading: state.loading,
      suggestions: state.suggestions,
      showButton: state.showButton,
      isButtonDisabled: state.isButtonDisabled,
      showSuggestions: state.showSuggestions,
      showHome: state.showHome,
      showSobre: state.showSobre,
      showReviewButton: state.showReviewButton
      
    };
  
    // console.log(data);
  }, dependencies);

  return {
    state,
    setState,
    handleKeyDown,
  };
};
