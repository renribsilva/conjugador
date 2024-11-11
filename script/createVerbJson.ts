import fs from 'fs';
import path from 'path';
import { ni, nw } from '../src/lib/normalizeVerb';
import pullLibreOfficeWords from './pullLibreOfficeWords';
import readTxtLines from './readTxtLines';

const assetsDir = path.join(process.cwd(), 'assets');
const srcDir = path.join(process.cwd(), 'src');
const publicDir = path.join(process.cwd(), 'public');

// Definição do tipo 'Verbos' como um mapeamento de strings para arrays de strings
type Verbos = Record<string, string[]>;

// Função para ler verbos e adicionar os do arquivo 'newVerbs.txt'
async function addNewVerbs(words: string[]): Promise<string[]> {
  try {
    const newWordPath = path.join(assetsDir, 'newVerbs.txt');
    const additionalWords = await readTxtLines(newWordPath);
    return [...words, ...additionalWords];
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.warn('Arquivo newVerbs.txt não encontrado.');
    } else {
      throw err;
    }
    return words;
  }
}

// Função para ler verbos irregulares e encontrar os ausentes no JSON
async function findMissingIrregularVerbs(): Promise<string[]> {
  const irregularVerbsPath = path.join(assetsDir, 'irregVerbs.txt');
  const irregularVerbs = await readTxtLines(irregularVerbsPath);
  const verbsJson = await readJsonFile(path.join(srcDir, 'json', 'allVerbs.json'));
  return irregularVerbs.filter(verb => !Object.keys(verbsJson).includes(verb));
}

// Função para ler e parsear JSON de verbos
async function readJsonFile(filePath: string): Promise<Verbos> {
  const data = await fs.promises.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

// Função para obter verbos normalizados a partir de um vocabulário
async function getVerbsFromVocabulary(filePath: string): Promise<Verbos> {
  const cleanedWords = await readTxtLines(filePath);
  const updatedWords = await addNewVerbs(cleanedWords);
  const irregularVerbs = await findMissingIrregularVerbs();

  const exceptions = new Set(["dar", "ir", "ler", "pôr", "rir", "ser", "ter", "ver", "vir"]);

  const verbs = [...updatedWords, ...irregularVerbs].filter(word =>
    /(ar|er|ir|por|pôr)$/.test(word) &&
    !/-/.test(word) &&
    (word.length > 3 || exceptions.has(word))
  );

  // Normaliza os verbos e agrupa no objeto
  return verbs.reduce((acc, verb) => {
    const normalized = ni(verb);
    acc[normalized] = acc[normalized] || [];
    acc[normalized].push(verb);
    return acc;
  }, {} as Verbos);
}

// Função principal para processar e salvar verbos
async function main() {
  const filePath = path.join(publicDir, 'palavras.txt');
  const outputFilePath = path.join(srcDir, 'json', 'allVerbs.json');

  try {
    // Verifica se o arquivo já existe, caso contrário, faz o download
    if (!fs.existsSync(filePath)) {
      console.log('Arquivo não encontrado. Baixando...');
      await pullLibreOfficeWords('https://cgit.freedesktop.org/libreoffice/dictionaries/plain/pt_BR/pt_BR.dic', filePath);
    } else {
      console.log('Arquivo já existe.');
    }

    console.log('Lendo e filtrando verbos...');
    const verbs = await getVerbsFromVocabulary(filePath);
    const irregularVerbsCount = (await readTxtLines(path.join(assetsDir, 'verbosIrregulares.txt'))).length;

    await fs.promises.writeFile(outputFilePath, JSON.stringify(verbs, null, 2));
    console.log(`Total de verbos encontrados: ${Object.keys(verbs).length}`);
    console.log(`Total de verbos irregulares: ${irregularVerbsCount}`);
    console.log('Processamento concluído!');
  } catch (error) {
    console.error('Erro:', error);
  }
}

// Executa a função principal
main();
