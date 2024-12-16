import fs from 'fs';
import path from 'path';
import pullLibreOfficeWords from './pullLibreOfficeWords';
import readTxtLines from './readTxtLines';
import { ni, nw } from '../src/lib/normalizeVerb';
import { filterNonVerbs } from './filterNonVerbs';
import addNewVerbs from './addNewVerbs';

const srcDir = path.join(process.cwd(), 'src');
const libreOfficeSourceDir = path.join(process.cwd(), 'libreOfficeSource');

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

    console.log('Lendo e filtrando verbos...');

    const cleanedWords = await readTxtLines(filePath);
    const updatedWords = await addNewVerbs(cleanedWords);

    const exceptions = new Set(["dar", "ir", "ler", "pôr", "rer", "rir", "ser", "ter", "ver", "vir"]);
    const allVerbsSet = updatedWords.filter(word =>
      /(ar|er|ir|por|pôr)$/.test(word) &&
      !/'/.test(word) &&
      (word.length > 3 || exceptions.has(word))
    );

    let allVerbs = Array.from(allVerbsSet);
    
    allVerbs = await filterNonVerbs(allVerbs, 'nonVerb.txt');
    allVerbs = await filterNonVerbs(allVerbs, 'nonCompoundVerb.txt');
    allVerbs = await filterNonVerbs(allVerbs, 'nonDiacriticVerb.txt');

    allVerbs.sort((a, b) => a.localeCompare(b));

    const duplicateVerbs: string[] = [];
    allVerbs.forEach((verb, index) => {
      if (allVerbs.indexOf(verb) !== index && !duplicateVerbs.includes(verb)) {
        duplicateVerbs.push(verb);
      }
    });

    if (duplicateVerbs.length > 0) {
      console.log('Verbos duplicados encontrados:', duplicateVerbs);
    } else {
      console.log('Nenhum verbo duplicado encontrado.');
    }

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

    console.log(`Quantidades de vocábulos terminados em 'ar', 'er', 'ir' e 'por' pós-filtragem: ${finalVerbs.length}`);

    const ar = Object.keys(J).filter(key => key.endsWith('ar')).length;
    console.log(`- entradas terminadas em 'ar': ${ar}`);

    const er = Object.keys(J).filter(key => key.endsWith('er')).length;
    console.log(`- entradas terminadas em 'er': ${er}`);

    const ir = Object.keys(J).filter(key => key.endsWith('ir')).length;
    console.log(`- entradas terminadas em 'ir': ${ir}`);

    const porCount = Object.keys(J).filter(key => key.endsWith('por') || key.endsWith('pôr')).length;
    console.log(`- entradas terminadas em 'por': ${porCount}`);

  } catch (error) {
    console.error('Erro:', error);
  }
}

processVerbsFile();
