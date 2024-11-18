import fs from 'fs';
import path from 'path';
import { nw } from '../src/lib/normalizeVerb';

function createAfixosJson() {
  const caminhoTxt = path.join(process.cwd(), 'public', 'afixos.txt');
  const caminhoJson = path.join(process.cwd(), 'src', 'json', 'afixos.json');

  try {
    // Lê o arquivo de texto
    const dados = fs.readFileSync(caminhoTxt, 'utf-8');

    // Divide o conteúdo em linhas, normaliza, remove linhas vazias e elimina duplicados
    const linhas = Array.from(new Set(
      dados.split('\n')
           .map(linha => nw(linha))   // Normaliza as linhas
           .filter(Boolean)            // Remove linhas vazias
    ));

    // Converte as linhas em um array JSON
    const jsonData = JSON.stringify(linhas, null, 2);

    // Escreve o arquivo JSON
    fs.writeFileSync(caminhoJson, jsonData, 'utf-8');

    console.log('Arquivo JSON criado com sucesso em:', caminhoJson);
  } catch (erro) {
    console.error('Erro ao processar o arquivo:', erro);
  }
}

createAfixosJson();
