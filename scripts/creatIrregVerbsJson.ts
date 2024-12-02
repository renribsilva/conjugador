import fs from 'fs';
import path from 'path';
import { nw } from '../src/lib/normalizeVerb';

function createIrregVerbsJson() {
  
  const caminhoTxt = path.join(process.cwd(), 'lists', 'irregVerbs.txt');
  const caminhoJson = path.join(process.cwd(), 'src', 'json', 'irregVerbs.json');

  try {
    
    const dados = fs.readFileSync(caminhoTxt, 'utf-8');
    const linhas = dados.split('\n').map(linha => nw(linha)).filter(Boolean);
    const jsonData = JSON.stringify(linhas, null, 2);
    
    fs.writeFileSync(caminhoJson, jsonData, 'utf-8');

    console.log('Arquivo JSON criado com sucesso em:', caminhoJson);

  } catch (erro) {

    console.error('Erro ao processar o arquivo:', erro);
    
  }
}

createIrregVerbsJson()