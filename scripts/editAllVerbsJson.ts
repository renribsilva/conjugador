import fs from 'fs';
import path from 'path';
import { ni, nw } from '../src/lib/normalizeVerb';
import { VerbEntry } from '../src/types';
import readTxtLines from './utils/readTxtLines';
import { filterNonVerbs } from './utils/filterNonVerbs';
import { pullLibreOfficeWords } from './utils/pullLibreOfficeWords';
import { conjugateVerb } from '../src/lib/conjugateVerb';
import irregJson from "../public/json/rulesByTerm.json"
import allVerbsJson from "../public/json/allVerbs.json"
import modelsJson from "../public/json/models.json"
import groupedModelsJson from "../public/json/groupedModels.json"


const publicDir = path.join(process.cwd(), 'public');
const libreOfficeSourceDir = path.join(process.cwd(), 'libreOfficeSource');
const listsDir = path.join(process.cwd(), 'lists');
const ptBRPath = path.join(libreOfficeSourceDir, 'pt_BR.dic');
const allVerbsPath = path.join(publicDir, 'json', 'allVerbs.json');
const nonVerbsPath = path.join(listsDir, 'nonVerb.txt');
const newVerbsPath = path.join(listsDir, 'newVerbs.txt');



// USE CUSTOMVERBS PARA EXECUTAR O SCRIPT DE FORMA SELETIVA
const useCustomVerbs = false;
const batchObject=["amar"]

async function ediAllVerbsJson() {

  if (!irregJson || !allVerbsJson || !modelsJson || !groupedModelsJson) return

  try {

    console.log('Verificando existência de allVerbs.json...');

    if (!fs.existsSync(ptBRPath)) {
      console.log('- arquivo não encontrado. Baixando...');
      await pullLibreOfficeWords('https://raw.githubusercontent.com/LibreOffice/dictionaries/refs/heads/master/pt_BR/pt_BR.dic', ptBRPath);
    } else {
      console.log('- allVerbs.json já existe.');
    }

    console.log('Iniciando o processamento...');

    const ptBRWords = await readTxtLines(ptBRPath);
    
    console.log(`- quantidade de vocábulos encontrados: ${ptBRWords.length}`);
    console.log('Adicionando novos verbos à lista do libreOffice...');

    const newWords = await readTxtLines(newVerbsPath);
    const normNewWords = newWords.map(verb => nw(verb)).filter(verb => verb !== '');
    const existingWordsSet = new Set(ptBRWords.map(verb => nw(verb)));
    const filteredNewWords = normNewWords.filter(verb => !existingWordsSet.has(verb));
    const notAddedWords = normNewWords.filter(verb => existingWordsSet.has(verb));

    console.log('- verbos que NÃO serão adicionados:', notAddedWords);
    console.log(`- quantidade de novos verbos a serem adicionados: ${filteredNewWords.filter(Boolean).length}`);
    
    const updatedWords = [...ptBRWords, ...filteredNewWords];

    console.log(`- quantidade de verbos efetivamente acrescidos: ${updatedWords.length - ptBRWords.length}`);
    console.log(`- nova quantidade de vocábulos após complementação: ${updatedWords.length}`);

    console.log("Filtrando os vocábulos terminados em 'ar', 'er', 'ir' e 'por'...");
    const exceptions = new Set(["dar", "ir", "ler", "pôr", "rer", "rir", "ser", "ter", "ver", "vir"]);
    const allVerbsSet = updatedWords.filter(word =>
      /(ar|er|ir|por|pôr)$/.test(word) &&
      !/'/.test(word) &&
      (word.length > 3 || exceptions.has(word))
    );

    let allVerbs = Array.from(allVerbsSet);
    const v1 = allVerbs.filter(Boolean).length;

    console.log(`- quantidade de vocábulos terminados em 'ar', 'er', 'ir' e 'por': ${v1}`);

    console.log('Verificando duplicatas entre nonVerb.txt e newVerbs.txt...');

    const nonVerbs = await readTxtLines(nonVerbsPath);
    const normNonVerbs = new Set(nonVerbs.map(nw).filter(Boolean));
    const normNewVerbs = new Set(newWords.map(nw).filter(Boolean));
    const duplicates = Array.from(normNonVerbs).filter(verb => normNewVerbs.has(verb));

    if (duplicates.length > 0) {
      console.log('- palavras duplicadas entre nonVerb e newVerbs:', duplicates);
    } else {
      console.log('- nenhuma palavra duplicada encontrada entre nonVerb e newVerbs');
    }

    console.log("Iniciando a remoção de não verbos da lista...")

    allVerbs = await filterNonVerbs(allVerbs, 'nonVerb.txt');
    allVerbs = await filterNonVerbs(allVerbs, 'nonCompoundVerb.txt');
    allVerbs = await filterNonVerbs(allVerbs, 'nonDiacriticVerb.txt');

    allVerbs.sort((a, b) => a.localeCompare(b));

    const v2 = allVerbs.filter(Boolean).length;

    console.log(`- quantidade de vocábulos retirados da lista: ${v1 - v2}`);
    console.log(`- quantidade de verbos após retirada de não verbos: ${v2}`);

    const duplicateVerbs: string[] = [];
    allVerbs.forEach((verb, index) => {
      if (allVerbs.indexOf(verb) !== index && !duplicateVerbs.includes(verb)) {
        duplicateVerbs.push(verb);
      }
    });

    if (duplicateVerbs.length > 0) {
      console.log('Verificando duplicidade de verbos...');
      console.log('- verbos duplicados encontrados:', duplicateVerbs);
    } else {
      console.log('Nenhum verbo duplicado encontrado.');
    }

    console.log('Removendo verbos duplicados...');

    const normalizedVerbs = allVerbs.map(verb => String(nw(verb)));
    const uniqueVerbs = Array.from(new Set(normalizedVerbs));
    const finalVerbs = uniqueVerbs
      .map(normVerb => allVerbs[normalizedVerbs.indexOf(normVerb)])
      // .filter(verb => /crer$/.test(verb));

    console.log(`- quantidade de verbos após remoção de duplicados: ${finalVerbs.length}`)

    let currentVerbs: Record<string, VerbEntry> = {};

    if (fs.existsSync(allVerbsPath)) {
      const rawData = await fs.promises.readFile(allVerbsPath, 'utf8');
      currentVerbs = JSON.parse(rawData);
    }

    console.log("Aplicando as alterações em allVerbs.json...");

    const processVerbsAsync = async (finalVerbs: string[], currentVerbs: object) => {

      const acc = { ...currentVerbs };
      const BATCH_SIZE = 10;
      const startTime = Date.now(); 
      const cache = new Map(); 
    
      const processBatch = async (batch: string[], startIndex: number) => {
        
        if (useCustomVerbs) {
          batch = batchObject;
        }
        
        const batchPromises = batch.map(async (verb) => {
      
          const normalized = ni(verb);
      
          if (!acc[normalized]) {
            acc[normalized] = { 
              verb: [], 
              model: [], 
              ending: [],  
              only_reflexive: [false],
              multiple_conj: [false]
            };
          }
      
          if (!acc[normalized].verb.includes(verb)) {
            acc[normalized].verb.push(verb);
          }
      
          const go = true
      
          if (go) {
        
            try {
              const input = normalized;
              let verbPropsArray = cache.get(input);
              if (!verbPropsArray) {
                verbPropsArray = (await conjugateVerb(
                  input, 
                  irregJson, 
                  allVerbsJson
                )).propOfVerb
                cache.set(input, verbPropsArray);
              }
        
              if (verbPropsArray.length > 0) {
                const matchedTermination = verbPropsArray[0]?.termination;
        
                if (matchedTermination && input.endsWith(matchedTermination)) {
                  acc[input].ending = [matchedTermination];
                }
                
              }
            } catch (error) {
              console.error(`Erro ao processar o verbo ${verb}:`, error);
            }
          }
        });
      
        await Promise.all(batchPromises);
      
        const progress = Math.floor(((startIndex + batch.length) / finalVerbs.length) * 100);
        const elapsedTime = Date.now() - startTime;
        const remainingTime = ((elapsedTime / (startIndex + batch.length)) * (finalVerbs.length - (startIndex + batch.length))) / 1000;
        const hours = Math.floor(remainingTime / 3600); // Horas
        const minutes = Math.floor((remainingTime % 3600) / 60); // Minutos
      
        process.stdout.write(`- progresso: ${progress}% | Tempo restante estimado: ${hours}h ${minutes}min\r`);
      };      

      for (let i = 0; i < finalVerbs.length; i += BATCH_SIZE) {
        const batch = finalVerbs.slice(i, i + BATCH_SIZE);
        await processBatch(batch, i);      
      }

      return acc;

    };         

    const J = await processVerbsAsync(finalVerbs, currentVerbs);

    // remove entradas que não fazem parte de finalVerbs
    const removedVerbs = Object.keys(currentVerbs).filter(
      (normalized) => !finalVerbs.some((verb) => ni(verb) === normalized)
    );

    removedVerbs.forEach((normalized) => {
      delete J[normalized];
    });

    const sortedJ = Object.keys(J)
      .sort()
      .reduce((acc, key) => {
        acc[key] = J[key];
        return acc;
      }, {});

      await fs.promises.writeFile(
        allVerbsPath,
        JSON.stringify(sortedJ, null, 2)
          .replace(/\[\s*([\s\S]*?)\s*\]/g, (match, p1) => 
            `[${p1.replace(/\s*,\s*/g, ',').replace(/\n\s*/g, '')}]`)
      );

    console.log(`Atualizando a quantidade de verbos...`);
    console.log(`- quantidade final de verbos: ${finalVerbs.length}`);

    const ar = Object.keys(J).filter(key => key.endsWith('ar')).length;
    console.log(`-- terminados em 'ar': ${ar}`);

    const er = Object.keys(J).filter(key => key.endsWith('er')).length;
    console.log(`-- terminados em 'er': ${er}`);

    const ir = Object.keys(J).filter(key => key.endsWith('ir')).length;
    console.log(`-- terminados em 'ir': ${ir}`);

    const porCount = Object.keys(J).filter(key => key.endsWith('por') || key.endsWith('pôr')).length;
    console.log(`-- terminados em 'por': ${porCount}`);
  } catch (error) {
    console.error('Erro:', error);
  }
}

ediAllVerbsJson();

   