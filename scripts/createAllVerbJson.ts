import fs from 'fs';
import path from 'path';
import pullLibreOfficeWords from './pullLibreOfficeWords';
import readTxtLines from './readTxtLines';
import addNewVerbs from './addNewVerbs';
import { ni } from '../src/lib/normalizeVerb';
import { filterNonVerbs } from './filterNonVerbs';

const assetsDir = path.join(process.cwd(), 'assets');
const srcDir = path.join(process.cwd(), 'src');
const publicDir = path.join(process.cwd(), 'public');

async function processVerbsFile(): Promise<void> {

  const filePath = path.join(publicDir, 'words.txt');
  const outputFilePath = path.join(srcDir, 'json', 'allVerbs.json');

  try {
    if (!fs.existsSync(filePath)) {
      console.log('Arquivo não encontrado. Baixando...');
      await pullLibreOfficeWords('https://cgit.freedesktop.org/libreoffice/dictionaries/plain/pt_BR/pt_BR.dic', filePath);
    } else {
      console.log('Arquivo já existe.');
    }

    console.log('Lendo e filtrando verbos...');

    const cleanedWords = await readTxtLines(filePath);
    const updatedWords = await addNewVerbs(cleanedWords);

    const exceptions = new Set(["dar", "ir", "ler", "pôr", "rer", "rir", "ser", "ter", "ver", "vir"]);
    const verbs = updatedWords.filter(word =>
      /(ar|er|ir|por|pôr)$/.test(word) &&
      !/'/.test(word) &&
      (word.length > 3 || exceptions.has(word))
    );

    const irregularVerbsPath = path.join(assetsDir, 'irregVerbs.txt');
    const irregularVerbs = await readTxtLines(irregularVerbsPath);
    const allVerbsSet = new Set([...verbs, ...irregularVerbs]);

    let allVerbs = Array.from(allVerbsSet);

    console.log(`Quantidades de vocábulos terminados em 'ar', 'er, 'ir' e 'por': ${allVerbs.length}`)

    allVerbs = await filterNonVerbs(allVerbs, 'nonVerb.txt');
    allVerbs = await filterNonVerbs(allVerbs, 'nonCompoundVerb.txt');
    allVerbs = await filterNonVerbs(allVerbs, 'nonDiadriticVerb.txt');

    const J = allVerbs.reduce((acc, verb) => {
      const normalized = String(ni(verb));
      acc[normalized] = acc[normalized] || [];
      acc[normalized].push(verb);
      return acc;
    }, {} as Record<string, string[]>);

    await fs.promises.writeFile(outputFilePath, JSON.stringify(J, null, 2));

    console.log(`Quantidades de vocábulos terminados em 'ar', 'er, 'ir' e 'por' pós-filtragem: ${allVerbs.length}`)

    const ar = Object.keys(J).filter(key => key.endsWith('ar')).length;
    console.log(`- entradas terminadas em 'ar': ${ar}`);

    const er = Object.keys(J).filter(key => key.endsWith('er')).length;
    console.log(`- entradas terminadas em 'er': ${er}`);

    const ir = Object.keys(J).filter(key => key.endsWith('ir')).length;
    console.log(`- entradas terminadas em 'ir': ${ir}`);

    const porCount = Object.keys(J).filter(key => key.endsWith('por') || key.endsWith('pôr')).length;
    console.log(`- entradas terminadas em 'por': ${porCount}`);

    console.log(`Número de verbos irregulares: ${Object.keys(irregularVerbs).length}`);

  } catch (error) {

    console.error('Erro:', error);
    
  }
}

processVerbsFile();
