import { useState, useEffect } from "react";
import { conjVerbByAPI } from "./conjVerbByAPI";
import { ni } from "./normalizeVerb";
import { isValidVerbByAPI } from "./isValidVerbByAPI";
import { getPropsOfVerb } from "./getPropsOfVerb";
import type { Conjugation } from "../types";
import getSimilarVerbs from "./getSimilarWords";
import isValidPrefix from "./isValidPrefix";

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
    hasOriginalVerb: boolean;
    originalVerb: string | null;
    similar: string[] | null;
    askForSimilar: boolean;
    hasPunct: boolean;
    puncts: string[] | null

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
    showReviewButton: false,
    hasOriginalVerb: false,
    originalVerb: null,
    similar: null,
    askForSimilar: false,
    hasPunct:false,
    puncts: null

  });

  const fetchConjugations = async () => {
    const response = await fetch("/api/queryVerb");
    if (!response.ok) {throw new Error("Erro ao buscar as conjugações");}
    const data: Conjugation = await response.json();
    setState(prev => ({
      ...prev,
      conjugations: data,
    }));
  };

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {

    if (event.key === "Enter" && state.inputValue !== "") {

      const normalizedInputValue = ni(state.inputValue);

      setState(prev => ({
        ...prev,
        conjugations: null,
        loading: true,
        inputValue: "",
        inputReq: state.inputValue,
        showConjugations: false,
        foundVerb: findedWord,
        isValidVerb: result,
        suggestions: null,
        showButton: false,
        showSuggestions: false,
        isButtonDisabled: false,
        showHome: false,
        showSobre: false,
        showReviewButton: false,
        hasOriginalVerb: hasOriginalVerb,
        originalVerb: originalVerb,
        askForSimilar: false,

      }));

      let result = false;
      let findedWord = "";
      let isRePrefix = isValidPrefix(state.inputValue)
      let hasOriginalVerb = false
      let originalVerb = null
      let similar = null
      let hasPunctAPI  = false
      let punctAPI  = null
  
      if (normalizedInputValue !== "") {

        const apiResponse = await isValidVerbByAPI(normalizedInputValue);
        result = apiResponse.result;
        findedWord = apiResponse.findedWord;
        similar = apiResponse.similar;
        hasPunctAPI = apiResponse.hasPunct
        punctAPI = apiResponse.punct

        // console.log(apiResponse)
        
        // if (similar !== null) {
        //   setState(prev => ({
        //     ...prev,
        //     loading:false,
        //     askForSimilar: true,
        //   }))
        // }

        if (hasPunctAPI) {
          setState(prev => ({
            ...prev,
            loading: false,
            hasPunct: hasPunctAPI,
            puncts: punctAPI,
            showButton: true,
            conjugations: null,
            isValidVerb: result,
            foundVerb: findedWord
          }));
          return
        }

        if ( isRePrefix.isValid ) {

          let or = state.inputValue.replace((isRePrefix.afixo as string), '').replace(/-/g, '');
          const apiRes = await isValidVerbByAPI(ni(or))
          hasOriginalVerb = apiRes.result
          originalVerb = apiRes.findedWord

        }

      }

      const propsOfWord = await getPropsOfVerb(normalizedInputValue, result, findedWord);
      const suggestions = getSimilarVerbs(state.inputValue);

      if (!result) {

        setState(prev => ({
          ...prev,
          loading: false,
          showButton: true,
          suggestions: suggestions,
          showSuggestions: true,
          ending: null,
          hasTarget: null,
          types: null,
          abundance: null,
          note_plain: null,
          note_ref: null,
          afixo: null,
          showReviewButton: false,
          hasOriginalVerb: hasOriginalVerb,
          originalVerb: originalVerb,
          hasPunct: hasPunctAPI,
          puncts:punctAPI

        }));

      } else {

        setState(prev => ({
          ...prev,
          ending: propsOfWord[0].ending,
          hasTarget: propsOfWord[0].hasTarget,
          types: propsOfWord[0].types,
          abundance: propsOfWord[0].abundance,
          note_plain: propsOfWord[0].note_plain,
          note_ref: propsOfWord[0].note_ref,
          afixo: propsOfWord[0].afixo,
          similar: similar,
          showReviewButton: true,
        }));
        
        await conjVerbByAPI(ni(findedWord));
        await fetchConjugations();

        setState(prev => ({
          ...prev,
          loading: false,
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
    state.showReviewButton,
    state.hasOriginalVerb,
    state.similar,
    state.askForSimilar,
    state.hasPunct,
    state.puncts
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
      showReviewButton: state.showReviewButton,
      hasOriginalVerb: state.hasOriginalVerb,
      similar: state.similar,
      askForSimilar: state.askForSimilar,
      hasPunct: state.hasPunct,
      puncts: state.puncts

    };
  
    console.log(data);
  }, dependencies);

  return {
    state,
    setState,
    handleKeyDown,
  };
};
