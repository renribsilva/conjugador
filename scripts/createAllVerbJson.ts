import fs from 'fs';
import path from 'path';
import pullLibreOfficeWords from './pullLibreOfficeWords';
import readTxtLines from './readTxtLines';
import { ni, nw } from '../src/lib/normalizeVerb';
import { filterNonVerbs } from './filterNonVerbs';
import { VerbEntry } from '../src/types';
import { getPropsOfVerb } from '../src/lib/getPropsOfVerb';

const srcDir = path.join(process.cwd(), 'src');
const libreOfficeSourceDir = path.join(process.cwd(), 'libreOfficeSource');
const listsDir = path.join(process.cwd(), 'lists');
const newVerbsPath = path.join(listsDir, 'newVerbs.txt');
const ptBRPath = path.join(libreOfficeSourceDir, 'pt_BR.txt');
const outputPath = path.join(srcDir, 'json', 'allVerbs.json');
const nonVerbsPath = path.join(listsDir, 'nonVerb.txt');

async function processVerbsFile(): Promise<void> {
  
  try {
    
    const addNewVerbs = async (words: string[]): Promise<string[]> => {

      const newWords = await readTxtLines(newVerbsPath);
      const normNewWords = new Set(newWords.filter(Boolean).map(nw));
      const existingWordsSet = new Set(words.filter(Boolean).map(nw));
      const filteredNewWords = Array.from(normNewWords).filter(verb => !existingWordsSet.has(verb));
      const notAddedWords = Array.from(normNewWords).filter(verb => existingWordsSet.has(verb));
    
      console.log('- verbos que NÃO serão adicionados:', notAddedWords);
      console.log(`- quantidade de novos verbos a serem adicionados: ${filteredNewWords.length}`);
    
      return [...words, ...filteredNewWords];

    };

    const checkForDuplicates = async (): Promise<void> => {

      const nonVerbs = await readTxtLines(nonVerbsPath);
      const newVerbs = await readTxtLines(newVerbsPath);
      const normNonVerbs = new Set(nonVerbs.filter(Boolean).map(nw).filter(Boolean));
      const normNewVerbs = new Set(newVerbs.filter(Boolean).map(nw).filter(Boolean));
      const duplicates = Array.from(normNonVerbs).filter(verb => normNewVerbs.has(verb));

      if (duplicates.length > 0) {
        console.log('Palavras duplicadas entre nonVerb e newVerbs:', duplicates);
      } else {
        console.log('Nenhuma palavra duplicada encontrada entre nonVerb e newVerbs');
      }
    };

    if (!fs.existsSync(ptBRPath)) {
      console.log('Arquivo não encontrado. Baixando...');
      await pullLibreOfficeWords('https://raw.githubusercontent.com/LibreOffice/dictionaries/refs/heads/master/pt_BR/pt_BR.dic', ptBRPath);
    } else {
      console.log('Arquivo já existe.');
    }

    console.log('Iniciando o processamento...');
    const cleanedWords = await readTxtLines(ptBRPath);
    console.log(`- quantidade total de vocábulos: ${cleanedWords.length}`);

    console.log("Adicionando novos verbos à lista do libreOffice...")
    const updatedWords = await addNewVerbs(cleanedWords);
    console.log(`- quantidade atualizada de vocábulos: ${updatedWords.length}`);

    console.log("Iniciando o processo de filtragem...")
    const exceptions = new Set(["dar", "ir", "ler", "pôr", "rer", "rir", "ser", "ter", "ver", "vir"]);
    let allVerbsSet = updatedWords.filter(word =>
      /(ar|er|ir|por|pôr)$/.test(word) &&
      !/'/.test(word) &&
      (word.length > 3 || exceptions.has(word))
    );
    let allVerbs = Array.from(allVerbsSet);
    const v1 = allVerbs.filter(Boolean).length;

    console.log(`- quantidade de vocábulos terminados em 'ar', 'er', 'ir' e 'por': ${v1}`);

    await checkForDuplicates();

    console.log("Iniciando a remoção de não verbos...")

    allVerbs = await filterNonVerbs(allVerbs, 'nonVerb.txt');
    allVerbs = await filterNonVerbs(allVerbs, 'nonCompoundVerb.txt');
    allVerbs = await filterNonVerbs(allVerbs, 'nonDiacriticVerb.txt');
    allVerbs.sort((a, b) => a.localeCompare(b));

    const v2 = allVerbs.filter(Boolean).length;
    console.log(`- quantidade de vocábulos retirados da lista: ${v1 - v2}`);
    console.log(`- quantidade de verbos após retirada de não verbos: ${v2}`);

    const duplicateVerbs = Array.from(
      allVerbs.reduce((duplicates, verb) => {
        if (!duplicates.has(verb) && allVerbs.indexOf(verb) !== allVerbs.lastIndexOf(verb)) {
          duplicates.add(verb);
        }
        return duplicates;
      }, new Set<string>())
    );

    if (duplicateVerbs.length > 0) {
      console.log('Verificando duplicidade de verbos...');
      console.log('- verbos duplicados encontrados:', duplicateVerbs);
    } else {
      console.log('Nenhum verbo duplicado encontrado.');
    }

    console.log('Removendo verbos duplicados...');

    const normalizedVerbs = allVerbs.map(verb => String(nw(verb)));
    const uniqueVerbs = Array.from(new Set(normalizedVerbs));
    const finalVerbs = uniqueVerbs.map(normVerb => allVerbs[normalizedVerbs.indexOf(normVerb)]);

    let currentVerbs: Record<string, VerbEntry> = {};
    if (fs.existsSync(outputPath)) {
      const rawData = await fs.promises.readFile(outputPath, 'utf8');
      currentVerbs = JSON.parse(rawData);
    }

    console.log("Iniciando a edição de allVerbs.json...")

    const processVerbsAsync = async (finalVerbs: string[], currentVerbs: object) => {
      const acc = { ...currentVerbs };
      const totalVerbs = finalVerbs.length;
      let processedVerbs = 0;
      const concurrencyLimit = 100;
      const startTime = Date.now();
      const processedCache = new Set<string>(); // Cache para evitar repetições
    
      const processVerbAsync = async (verb: string) => {

        if (processedCache.has(verb)) return;
        processedCache.add(verb);
    
        const normalized = ni(verb);

        if (!acc[normalized]) {
          acc[normalized] = { verb: [], model: [], ending: [] };
        }
    
        if (!acc[normalized].verb.includes(verb)) {
          acc[normalized].verb.push(verb);
        }

        try {
          for (const normalized in acc) {
            const verbPropsArray = await getPropsOfVerb(normalized, true, normalized);
            if (verbPropsArray.length > 0) {
              const matchedTermination = verbPropsArray[0]?.termination;
              if (matchedTermination && normalized.endsWith(matchedTermination)) {
                if (!acc[normalized].ending.includes(matchedTermination)) {
                  acc[normalized].ending.push(matchedTermination);
                }
              }
            }
          }
        } catch (error) {
          console.error(`Erro ao processar verbo:`, error);
        }
    
        processedVerbs++;
        if (processedVerbs % 10 === 0) {
          const percentage = (processedVerbs / totalVerbs) * 100;
          const elapsedTime = Date.now() - startTime;
          const remainingTime = (elapsedTime / processedVerbs) * (totalVerbs - processedVerbs);
    
          const formattedTime = formatRemainingTime(remainingTime);
          process.stdout.write(
            `Processando... ${Math.round(percentage)}% concluído | Tempo restante: ${formattedTime}\r`
          );
        }
      };
    
      const processInBatches = async (
        verbs: string[],
        concurrencyLimit: number,
        processor: (verb: string) => Promise<void>
      ) => {
        const activePromises: Promise<void>[] = [];
    
        for (const verb of verbs) {
          activePromises.push(
            processor(verb).finally(() => {
              activePromises.splice(activePromises.indexOf(Promise.resolve()), 1);
            })
          );
          if (activePromises.length >= concurrencyLimit) {
            await Promise.allSettled(activePromises);
          }
        }
    
        await Promise.allSettled(activePromises);
      };
    
      const formatRemainingTime = (remainingTime: number) => {
        const remainingSeconds = Math.round(remainingTime / 1000);
        const remainingMinutes = Math.floor(remainingSeconds / 60);
        const remainingHours = Math.floor(remainingMinutes / 60);
        return `${remainingHours}h ${remainingMinutes % 60}m ${remainingSeconds % 60}s`;
      };
    
      await processInBatches(Array.from(new Set(finalVerbs)), concurrencyLimit, processVerbAsync);
      return acc;
    };         

    const J = await processVerbsAsync(finalVerbs, currentVerbs);

    const removedVerbs = Object.keys(currentVerbs).filter(
      (normalized) => !finalVerbs.some((verb) => ni(verb) === normalized)
    );
    removedVerbs.forEach((normalized) => {
      delete J[normalized];
    });

    // Inserir novas propriedades
    // Object.keys(J).forEach(normalized => {
    //   if (!J[normalized].ending) {
    //     J[normalized].ending = [];
    //   }
    // });

    const sortedJ = Object.keys(J)
      .sort()
      .reduce((acc, key) => {
        acc[key] = J[key];
        return acc;
      }, {});

    console.log("Reescrevendo o arquivo allVerbs.json...")

    await fs.promises.writeFile(outputPath, JSON.stringify(sortedJ, null, 2).replace(/\[\n\s+("(.*?)"|\d+)\n\s+\]/g, '[$1]'));

    const ar = Object.keys(J).filter(key => key.endsWith('ar')).length;
    const er = Object.keys(J).filter(key => key.endsWith('er')).length;
    const ir = Object.keys(J).filter(key => key.endsWith('ir')).length;
    const porCount = Object.keys(J).filter(key => key.endsWith('por') || key.endsWith('pôr')).length;

    console.log(`\n- quantidade final de verbos: ${finalVerbs.length}`);
    console.log(`-- terminados em 'ar': ${ar}`);
    console.log(`-- terminados em 'er': ${er}`);
    console.log(`-- terminados em 'ir': ${ir}`);
    console.log(`-- terminados em 'por': ${porCount}`);
  } catch (error) {
    console.error('Erro ao processar verbos:', error);
  }
}

processVerbsFile();
