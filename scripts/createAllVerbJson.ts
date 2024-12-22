import fs from 'fs';
import path from 'path';
import pullLibreOfficeWords from './pullLibreOfficeWords';
import readTxtLines from './readTxtLines';
import { ni, nw } from '../src/lib/normalizeVerb';
import { filterNonVerbs } from './filterNonVerbs';

const srcDir = path.join(process.cwd(), 'src');
const libreOfficeSourceDir = path.join(process.cwd(), 'libreOfficeSource');
const listsDir = path.join(process.cwd(), 'lists');

async function addNewVerbs(words: string[]): Promise<string[]> {
  
  try {

    const newWordPath = path.join(listsDir, 'newVerbs.txt');
    const newWords = await readTxtLines(newWordPath);
    const normNewWords = newWords.map(verb => nw(verb)).filter(verb => verb !== '');
    const existingWordsSet = new Set(words.map(verb => nw(verb)));
    const filteredNewWords = normNewWords.filter(verb => !existingWordsSet.has(verb));
    const notAddedWords = normNewWords.filter(verb => existingWordsSet.has(verb));

    console.log('- verbos que NÃO serão adicionados:', notAddedWords);
    console.log(`- quantidade de novos verbos a serem adicionados: ${newWords.filter(Boolean).length}`);

    return [...words, ...filteredNewWords];
    
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.warn('Arquivo newVerbs.txt não encontrado.');
    } else {
      throw err;
    }
    return words;
  }
}

async function checkForDuplicates(): Promise<void> {
  try {
    const nonVerbsPath = path.join(listsDir, 'nonVerb.txt');
    const newVerbsPath = path.join(listsDir, 'newVerbs.txt');

    const nonVerbs = await readTxtLines(nonVerbsPath);
    const newVerbs = await readTxtLines(newVerbsPath);

    const normNonVerbs = new Set(nonVerbs.map(nw).filter(Boolean));
    const normNewVerbs = new Set(newVerbs.map(nw).filter(Boolean));

    const duplicates = Array.from(normNonVerbs).filter(verb => normNewVerbs.has(verb));

    if (duplicates.length > 0) {
      console.log('Palavras duplicadas entre nonVerb e newVerbs:', duplicates);
    } else {
      console.log('Nenhuma palavra duplicada encontrada entre nonVerb e newVerbs');
    }
  } catch (error) {
    console.error('Erro ao verificar duplicatas:', error);
  }
}

async function processVerbsFile(): Promise<void> {

  const filePath = path.join(libreOfficeSourceDir, 'pt_BR.txt');
  const outputFilePath = path.join(srcDir, 'json', 'allVerbs.json');
  
  try {

    if (!fs.existsSync(filePath)) {
      console.log('Arquivo não encontrado. Baixando...');
      await pullLibreOfficeWords('https://raw.githubusercontent.com/LibreOffice/dictionaries/refs/heads/master/pt_BR/pt_BR.dic', filePath);
    } else {
      console.log('Arquivo já existe.');
    }

    console.log('Iniciando o processamento...');

    const cleanedWords = await readTxtLines(filePath);
    
    console.log(`- quantidade de vocábulos encontrados: ${cleanedWords.length}`);
    console.log('Adicionando novos verbos à lista do libreOffice...');

    const updatedWords = await addNewVerbs(cleanedWords);
    
    console.log(`- quantidade de verbos efetivamente acrescidos: ${updatedWords.length-cleanedWords.length}`);
    console.log(`- nova quantidade de vocábulos após complementação: ${updatedWords.length}`);
    console.log("Fitrando os vacábulos terminados em 'ar', 'er', 'ir' e 'por'...");

    const exceptions = new Set(["dar", "ir", "ler", "pôr", "rer", "rir", "ser", "ter", "ver", "vir"]);
    const allVerbsSet = updatedWords.filter(word =>
      /(ar|er|ir|por|pôr)$/.test(word) &&
      !/'/.test(word) &&
      (word.length > 3 || exceptions.has(word))
    );

    let allVerbs = Array.from(allVerbsSet);

    const v1 = allVerbs.filter(Boolean).length

    console.log(`- quantidade de vocábulos terminados em 'ar', 'er', 'ir' e 'por': ${v1}`)

    console.log('Verificando duplicatas entre nonVerb.txt e newVerbs.txt...');
    await checkForDuplicates();

    console.log(`Filtrando vocábulos que não são verbos...`)
    
    allVerbs = await filterNonVerbs(allVerbs, 'nonVerb.txt');
    allVerbs = await filterNonVerbs(allVerbs, 'nonCompoundVerb.txt');
    allVerbs = await filterNonVerbs(allVerbs, 'nonDiacriticVerb.txt');

    allVerbs.sort((a, b) => a.localeCompare(b));

    const v2 = allVerbs.filter(Boolean).length

    console.log(`- quantidade de vocábulos retirados da lista: ${v1-v2}`)
    console.log(`- quantidade de verbos após retirada de não verbos: ${v2}`)

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
    const finalVerbs = uniqueVerbs.map(normVerb => allVerbs[normalizedVerbs.indexOf(normVerb)]);

    const J = finalVerbs.reduce((acc, verb) => {
      const normalized = String(ni(verb));
      acc[normalized] = acc[normalized] || [];
      acc[normalized].push(verb);
      return acc;
    }, {} as Record<string, string[]>);

    await fs.promises.writeFile(outputFilePath, JSON.stringify(J, null, 2));

    console.log(`Atualizando a quantidade de verbos...`);
    console.log(`- quantidade final de verbos: ${finalVerbs.length}`);

    const ar = Object.keys(J).filter(key => key.endsWith('ar')).length;
    console.log(`-- terminados em 'ar': ${ar}`);

    const er = Object.keys(J).filter(key => key.endsWith('er')).length;
    console.log(`-- terminados em 'er': ${er}`);

    const ir = Object.keys(J).filter(key => key.endsWith('ir')).length;
    console.log(`-- terminadps em 'ir': ${ir}`);

    const porCount = Object.keys(J).filter(key => key.endsWith('por') || key.endsWith('pôr')).length;
    console.log(`-- terminados em 'por': ${porCount}`);

  } catch (error) {
    console.error('Erro:', error);
  }
}

processVerbsFile();
