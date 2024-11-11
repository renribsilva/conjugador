import fs from 'fs';
import path from 'path';
import { ni } from '../src/lib/normalizeVerb';
import pullLibreOfficeWords from './pullLibreOfficeWords';
import readTxtLines from './readTxtLines';
import addNewVerbs from './addNewVerbs';

const assetsDir = path.join(process.cwd(), 'assets');
const srcDir = path.join(process.cwd(), 'src');
const publicDir = path.join(process.cwd(), 'public');

async function createVerbsObject(filePath: string): Promise<Record<string, string[]>> {
  const cleanedWords = await readTxtLines(filePath);
  const updatedWords = await addNewVerbs(cleanedWords);

  // Definir exceções (verbos que não precisam passar pela lógica de filtragem)
  const exceptions = new Set(["dar", "ir", "ler", "pôr", "rir", "ser", "ter", "ver", "vir"]);

  const verbs = updatedWords.filter(word =>
    /(ar|er|ir|por|pôr)$/.test(word) &&  // Verifica a terminação
    !/-/.test(word) &&                  // Ignora palavras com hífen
    (word.length > 3 || exceptions.has(word)) // Inclui palavras com 3 letras ou mais, exceto as exceções
  );

  let verbsObject = verbs.reduce((acc, verb) => {
    const normalized = ni(verb);
    acc[normalized] = acc[normalized] || [];
    acc[normalized].push(verb);
    return acc;
  }, {} as Record<string, string[]>);

  // console.log('Objeto de verbos inicial:', verbsObject);

  verbsObject = await addIrregVerbsToObject(verbsObject);
  // console.log('Objeto após adicionar verbos irregulares:', verbsObject);

  verbsObject = await removeNonVerbsFromObject(verbsObject);
  // console.log('Objeto após remover palavras não verbais:', verbsObject);

  return verbsObject;
}

async function removeNonVerbsFromObject(verbs: Record<string, string[]>): Promise<Record<string, string[]>> {
  const nonVerbsPath = path.join(assetsDir, 'nonVerb.txt');
  const nonVerbs = await readTxtLines(nonVerbsPath);

  const nonVerbsSet = new Set(nonVerbs.map(verb => ni(verb)));

  for (const key of Object.keys(verbs)) {
    if (nonVerbsSet.has(key)) {
      delete verbs[key];
    }
  }

  // console.log('Non-verbs removidos:', nonVerbsSet);
  return verbs;
}

async function addIrregVerbsToObject(verbs: Record<string, string[]>): Promise<Record<string, string[]>> {
  const missingIrregularVerbs = await findMissingIrregularVerbs(verbs);

  missingIrregularVerbs.forEach(verb => {
    const normalized = ni(verb);
    if (!verbs[normalized]) {
      verbs[normalized] = [];
    }
    verbs[normalized].push(verb);
  });

  // console.log(verbs)
  return verbs;
}

async function findMissingIrregularVerbs(verbs: Record<string, string[]>): Promise<string[]> {
  const irregularVerbsPath = path.join(assetsDir, 'irregVerbs.txt');
  const irregularVerbs = await readTxtLines(irregularVerbsPath);

  // console.log('Verbos irregulares lidos:', irregularVerbs);

  const missingVerbs = irregularVerbs.filter(verb => {
    return !verbs[verb];
  });

  // console.log('Verbos irregulares ausentes:', missingVerbs);
  return missingVerbs;
}

async function createVerbJson() {
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
    const verbs = await createVerbsObject(filePath);

    console.log('Salvando verbos no arquivo JSON...');
    await fs.promises.writeFile(outputFilePath, JSON.stringify(verbs, null, 2));

    const irregularVerbsCount = (await readTxtLines(path.join(assetsDir, 'irregVerbs.txt'))).length;
    console.log(`Total de verbos encontrados: ${Object.keys(verbs).length}`);
    console.log(`Total de verbos irregulares: ${irregularVerbsCount}`);
    console.log('Processamento concluído!');
  } catch (error) {
    console.error('Erro:', error);
  }
}

createVerbJson();
