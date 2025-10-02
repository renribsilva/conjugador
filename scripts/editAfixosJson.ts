import fs from 'fs';
import path from 'path';
import { nw } from '../src/lib/ssr/normalizeVerb';

function editAfixosJson() {

  const caminhoTxt = path.join(process.cwd(), 'lists', 'afixos.txt');
  const caminhoJson = path.join(process.cwd(), 'public', 'json', 'afixos.json');

  const dados = fs.readFileSync(caminhoTxt, 'utf-8');

  const array = Array.from(new Set(
    dados
      .split('\n')
      .map(linha => nw(linha)) 
      .filter(Boolean)           
  ));

  const jsonData = JSON.stringify(array, null, 2);
  fs.writeFileSync(caminhoJson, jsonData, 'utf-8');
  console.log('Arquivo JSON criado com sucesso em:', caminhoJson);
  
}

editAfixosJson()
