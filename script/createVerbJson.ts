import fs from 'fs';
import https from 'https';
import path from 'path';
import { ni } from '../src/lib/normalizeVerb';
import { addNewVerbs } from './addNewVerbs';
import { findMissingIrregularVerbs } from './addNewVerbs'; // Importando a função

// Função para baixar a lista de palavras do LibreOffice
async function downloadFile(url: string, dest: string): Promise<void> {
  const file = fs.createWriteStream(dest);
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close((err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }).on('error', (error) => {
      fs.unlink(dest, () => reject(error));
    });
  });
}

// Função para ler um palavras.txt e retornar seu conteúdo como um array de palavras
async function readFileLines(filePath: string): Promise<string[]> {
  const data = await fs.promises.readFile(filePath, 'utf-8');
  return data.split('\n').map((word) => word.replace(/\/.*/, '').trim());
}

// Função para obter o comprimento de verbosIrregulares.txt
async function getIrregularVerbsLength(filePath: string): Promise<number> {
  const irregularVerbs = await readFileLines(filePath);
  return irregularVerbs.length;
}

// Função para filtrar verbos contidos em palavras.txt e normalizá-los
async function getVerbsFromVocabulary(filePath: string): Promise<Record<string, string[]>> {
  const cleanedWords = await readFileLines(filePath);
  const updatedWords = await addNewVerbs(cleanedWords);

  // Puxando verbos irregulares para serem acrescidos
  const irregularVerbs = await findMissingIrregularVerbs();

  // Filtrar palavras que terminam em "ar", "er", "ir", "por", e que não contenham hífen
  const exceptions = ["dar", "ir", "ler", "pôr", "rir", "ser", "ter", "ver", "vir"];
  const verbs = updatedWords.concat(irregularVerbs).filter((word) => 
    /(ar|er|ir|por|pôr)$/.test(word) && // Verifica a terminação
    !/-/.test(word) && // Ignora palavras que contêm hífen
    (word.length > 3 || exceptions.includes(word)) // Verifica o comprimento ou exceções
  );

  // Criar um objeto onde cada verbo normalizado é a chave e seu valor é um array com o verbo original
  const normalizedVerbs: Record<string, string[]> = {};
  verbs.forEach((verb) => {
    const normalized = ni(verb); // Aplica a normalização
    normalizedVerbs[normalized] = normalizedVerbs[normalized] || []; // Cria o array se não existir
    normalizedVerbs[normalized].push(verb); // Adiciona o verbo original ao array
  });

  return normalizedVerbs;
}

// Função principal para baixar, processar e salvar os verbos em verbos.json
async function main() {
  const url = 'https://cgit.freedesktop.org/libreoffice/dictionaries/plain/pt_BR/pt_BR.dic';
  const filePath = path.join(process.cwd(), 'public', 'palavras.txt');
  const irregularVerbsPath = path.join(process.cwd(), 'public', 'verbosIrregulares.txt'); // Caminho do arquivo verbosIrregulares
  const outputFilePath = path.join(process.cwd(), 'src', 'json', 'verbos.json');

  try {
    // Verificar se o arquivo já existe
    if (!fs.existsSync(filePath)) {
      console.log('Arquivo não encontrado. Baixando o arquivo...');
      await downloadFile(url, filePath);
      console.log('Arquivo baixado com sucesso.');
    } else {
      console.log('Arquivo já existe. Pulando o download.');
    }

    console.log('Lendo e filtrando verbos...');
    const verbs = await getVerbsFromVocabulary(filePath);
    
    // Obter o comprimento dos verbos irregulares
    const irregularVerbsCount = await getIrregularVerbsLength(irregularVerbsPath);

    // Salvar os verbos normalizados no arquivo JSON
    await fs.promises.writeFile(outputFilePath, JSON.stringify(verbs, null, 2));

    const totalVerbs = Object.keys(verbs).length;
    
    console.log(`Total de verbos encontrados: ${totalVerbs}`);
    console.log(`Total de verbos irregulares: ${irregularVerbsCount}`);
    console.log('Está tudo pronto!');

  } catch (error) {
    console.error('Erro:', error);
  }
}

// Executa a função principal
main();
