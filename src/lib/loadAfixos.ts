import fs from 'fs';
import path from 'path';

// Caminho para o arquivo de afixos, usando process.cwd() para referenciar o diretório de trabalho atual
const afixosFilePath = path.resolve(process.cwd(), 'public/afixos.txt');

// Função para carregar afixos de um arquivo de texto
export default function loadAfixos() {
  try {
    // Lê o arquivo de forma síncrona
    const data = fs.readFileSync(afixosFilePath, 'utf-8');

    // Divide as linhas do arquivo e remove espaços em branco, criando um array de afixos
    const afixos = data.split('\n').map(line => line.trim()).filter(line => line !== '');
    return afixos;
  } catch (err) {
    console.error('Erro ao ler o arquivo de afixos:', err);
    return [];
  }
}

// Carregar os afixos do arquivo
// const afixos = loadAfixos();
// console.log(afixos)
