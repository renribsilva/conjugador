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
    termination: string | null | undefined;
    termEntrie: string | null | undefined;
    hasTargetCanonical: string | boolean | null ;
    hasTargetAbundance1: string | boolean | null ;
    hasTargetAbundance2: string | boolean | null ;
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
    showStatistic: boolean;
    showReviewButton: boolean;
    goThrough: boolean;
    enter: boolean;
    focus: boolean;
    progress: number;

    originalVerb: object | null;
    variationVerb: object| null,
    result: boolean,
    findedWord: string | null,
    similar: string[] | null,
    punct: string [] | null,

    variations: object | null,
    varHasVariations: boolean,
    varProcessedInput: string | null,
    varForcedVerb: boolean,
    varPrefixFounded: boolean,
    varMatchingAfixo: string | null,
    varConector: string | null,
    varOriginalInput: string | null,

  }>({

    conjugations: null,
    inputValue: "",
    inputReq: "",
    showConjugations: false,
    foundVerb: null,
    termination: null,
    termEntrie: null,
    hasTargetCanonical: null,
    hasTargetAbundance1: null,
    hasTargetAbundance2: null,
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
    showStatistic: false,
    showReviewButton: false,
    goThrough: false,
    enter: false,
    focus: false,
    progress: 0,

    originalVerb: null,
    variationVerb: null,
    result: false,
    findedWord: null,
    similar: null,
    punct: null,

    variations: null,
    varHasVariations: false,
    varProcessedInput: null,
    varForcedVerb: false,
    varPrefixFounded: false,
    varMatchingAfixo: null,
    varConector: null,
    varOriginalInput: null,

  });

  const fetchConjugations = async () => {

    const response = await fetch("/api/queryVerb");

    setState(prev => ({ 
      ...prev, 
      progress: 65 
    }))

    if (!response.ok) {throw new Error("Erro ao buscar as conjugações");}
    const data: Conjugation = await response.json();
    
    setState(prev => ({
      ...prev,
      conjugations: data,
      progress: 70
    }));

  };

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {

    if (event.key === "Enter" && state.inputValue !== "") {

      setTimeout(() => {
        (event.target as HTMLInputElement).blur();
      }, 0);

      setState(prev => ({ 
        ...prev, 
        progress: 1 
      }))

      const normalizedInputValue = ni(state.inputValue);
      const suggestions = getSimilarVerbs(state.inputValue);

      setState(prev => ({ 
        ...prev, 
        progress: 2 
      }))

      setState(prev => ({
        ...prev,
        conjugations: null,
        loading: true,
        inputValue: "",
        inputReq: state.inputValue,
        showConjugations: false,
        suggestions: suggestions,
        showSuggestions: false,
        showButton: false,
        isButtonDisabled: false,
        showHome: false,
        showSobre: false,
        showStatistic: false,
        showReviewButton: false,

        foundVerb: null,
        termination: null,
        termEntrie: null,
        hasTargetCanonical: null,
        hasTargetAbundance1: null,
        hasTargetAbundance2: null,
        note_plain: null,
        note_ref: null,
        types: null,

        goThrough: false,
        enter: false,
        focus: true,

        originalVerb: null,
        variationVerb: null,
        result: false,
        findedWord: null,
        similar: null,
        punct: null,

        variations: null,
        varHasVariations: false,
        varProcessedInput: null,
        varForcedVerb: false,
        varPrefixFounded: false,
        varMatchingAfixo: null,
        varConector: null,
        varOriginalInput: null,

      }));

      setState(prev => ({ 
        ...prev, 
        progress: 3 
      }))

      if (normalizedInputValue.trim() === "") {

        setState(prev => ({
          ...prev,
          showHome: true,
          loading: false
        }));

        return

      }

      setState(prev => ({ 
        ...prev, 
        progress: 5 
      }))

      const apiResponse = await isValidVerbByAPI(normalizedInputValue);      
      const originalVerb = apiResponse.originalVerb;
      const variationVerb = apiResponse.variationVerb;

      setState(prev => ({ 
        ...prev, 
        progress: 7 
      }))

      if (normalizedInputValue !== "") {
        
        setState(prev => ({
          ...prev,
          originalVerb: originalVerb,
          variationVerb: variationVerb
        }))

      }

      setState(prev => ({ 
        ...prev, 
        progress: 10 
      }))

      if (originalVerb === null && variationVerb === null ) {

        setState(prev => ({
          
          ...prev,
          loading: false,
          showButton: true,

        }));

        return

      }

      setState(prev => ({ 
        ...prev, 
        progress: 15 
      }))

      let puncts = null
      puncts = apiResponse.originalVerb?.punct || apiResponse.variationVerb?.punct || null;


      if (originalVerb !== null || variationVerb !== null ) {

        setState(prev => ({          
          ...prev,
          punct: puncts
        }))

      }

      setState(prev => ({ 
        ...prev, 
        progress: 18 
      }))

      if (puncts !== null) {

        setState(prev => ({
          
          ...prev,
          loading: false,
          showButton: true,
          punct: puncts,
          foundVerb: apiResponse.originalVerb.findedWord || apiResponse.variationVerb.findedWord

        }));

        return
      }

      setState(prev => ({ 
        ...prev, 
        progress: 20 
      }))

      let result = false;
      let findedWord = ''
      let similar = null
      let variations = null

      let varHasVariations = false
      let varForcedVerb = false 
      let varProcessedInput = null
      let varOriginalInput = null
      let varPrefixFounded = false 
      let varMatchingAfixo = null
      let varConector = null

      setState(prev => ({ 
        ...prev, 
        progress: 25 
      }))

      if (variationVerb !== null && originalVerb === null) {

        result = apiResponse.variationVerb.result;
        findedWord = apiResponse.variationVerb.findedWord;
        similar = apiResponse.variationVerb.similar;
        variations = apiResponse.variationVerb.variations;

        varHasVariations = apiResponse.variationVerb.variations.hasVariations;
        varForcedVerb = apiResponse.variationVerb.variations.forcedVerb
        varProcessedInput = apiResponse.variationVerb.variations.processedInput;
        varOriginalInput = apiResponse.variationVerb.variations.originalInput;
        varPrefixFounded = apiResponse.variationVerb.variations.prefixFounded;
        varMatchingAfixo = apiResponse.variationVerb.variations.matchingAfixo;
        varConector = apiResponse.variationVerb.variations.conector;

        setState(prev => ({
          
          ...prev,
          inputReq: state.inputValue,
          loading: false,
          showButton: true,

          varHasVariations: varHasVariations,
          varForcedVerb: varForcedVerb,
          varProcessedInput: varProcessedInput,
          varOriginalInput: varOriginalInput,
          varPrefixFounded: varPrefixFounded,
          varMatchingAfixo: varMatchingAfixo,
          varConector: varConector,

          foundVerb: findedWord,
          similar: similar

        }));

        return

      }

      setState(prev => ({ 
        ...prev, 
        progress: 30 
      }))

      if (originalVerb !== null && variationVerb === null) {

        result = apiResponse.originalVerb.result;
        findedWord = apiResponse.originalVerb.findedWord;
        similar = apiResponse.originalVerb.similar;
        variations = apiResponse.originalVerb.variations;

        setState(prev => ({ 
          ...prev, 
          progress: 35  
        }))

        if  (similar !== null && !state.goThrough) {

          setState(prev => ({

            ...prev,
            inputReq: state.inputValue,
            loading: false,
            showButton: true,

            foundVerb: findedWord,
            similar: similar

          }));

          return
        }

        setState(prev => ({ 
          ...prev, 
          progress: 40  
        }))
        
        const propsOfWord = await getPropsOfVerb(normalizedInputValue, result, findedWord);
        
        setState(prev => ({

          ...prev,
          termination: propsOfWord[0].termination,
          termEntrie: propsOfWord[0].termEntrie,
          hasTargetCanonical: propsOfWord[0].hasTargetCanonical,
          hasTargetAbundance1: propsOfWord[0].hasTargetAbundance1,
          hasTargetAbundance2: propsOfWord[0].hasTargetAbundance2,
          types: propsOfWord[0].types,
          note_plain: propsOfWord[0].note_plain,
          note_ref: propsOfWord[0].note_ref,
          afixo: propsOfWord[0].afixo,
          showReviewButton: true,
          goThrough: false,

          foundVerb:findedWord,
          similar: similar
          
        }));

        setState(prev => ({ 
          ...prev, 
          progress: 50  
        }))

        await conjVerbByAPI(ni(findedWord));

        setState(prev => ({ 
          ...prev, 
          progress: 99 
        }))

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
    state.conjugations,
    // state.inputValue,
    state.inputReq,
    state.showConjugations,
    state.foundVerb,
    state.termination,
    state.termEntrie,
    state.hasTargetCanonical,
    state.hasTargetAbundance1,
    state.hasTargetAbundance2,
    state.note_plain,
    state.note_ref,
    state.types,
    state.loading,
    state.suggestions,
    state.showButton,
    state.isButtonDisabled,
    state.showSuggestions,
    state.showHome,
    state.showSobre,
    state.showReviewButton,
    state.goThrough,
    state.enter,
    state.originalVerb,
    state.variationVerb,
    state.result,
    state.findedWord,
    state.similar,
    state.punct,
    state.variations,
    state.varHasVariations,
    state.varProcessedInput,
    state.varForcedVerb,
    state.varPrefixFounded,
    state.varMatchingAfixo,
    state.varConector,
    state.varOriginalInput,
    state.showStatistic,
    state.focus
  ];
  
  useEffect(() => {
    const data = {
      // inputValue: state.inputValue,
      inputReq: state.inputReq,
      conjugations: state.conjugations,
      showConjugations: state.showConjugations,
      foundVerb: state.foundVerb,
      isValidVerbByAPI: {
        result: state.result,
        findedWord: state.findedWord,
        similar: state.similar,
        punct: state.punct,
        variations: state.variations,
        varHasVariations: state.varHasVariations,
        varProcessedInput: state.varProcessedInput,
        varForcedVerb: state.varForcedVerb,
        varPrefixFounded: state.varPrefixFounded,
        varMatchingAfixo: state.varMatchingAfixo,
        varConector: state.varConector,
        varOriginalInput: state.varOriginalInput,
      },
      propsOfVerb: {
        hasTargetCanonical: state.hasTargetCanonical,
        hasTargetAbundance1: state.hasTargetAbundance1,
        hasTargetAbundance2: state.hasTargetAbundance2,
        termination: state.termination,
        termEntrie: state.termEntrie,
        types: state.types,
        note_plain: state.note_plain, 
        note_ref: state.note_ref,
      },
      loading: state.loading,
      suggestions: state.suggestions,
      showButton: state.showButton,
      isButtonDisabled: state.isButtonDisabled,
      showSuggestions: state.showSuggestions,
      showHome: state.showHome,
      showSobre: state.showSobre,
      showStatistic: state.showStatistic,
      showReviewButton: state.showReviewButton,
      goThrough: state.goThrough,
      enter: state.enter,
      focus: state.focus
    };
  
    console.log(data);
  }, dependencies); 

  return {
    state,
    setState,
    handleKeyDown,
  };
};