# conjugador-gules

**Conjugador-gules**
é um conjugador de verbos da língua portuguesa brasileira. Ele foi escrito essencialmente em 
_typescript_, uma linguagem de programação. Ele foi estruturado com [nextjs](https://nextjs.org/) 
e [postgresql](https://www.postgresql.org/), dois recursos totalmente
gratuitos dentro da hospedagem do vercel, tabém grátis. Neste projeto, a base de vocábulos é a lista de palavras do corretor ortográfico do libreOffice, que pode ser acessada
livremente [aqui](https://cgit.freedesktop.org/libreoffice/dictionaries/plain/pt_BR/pt_BR.dic)
— no projeto, ela foi salva em `pt-BR.dic` na pasta `/libreOfficeSource` do 
repositório da aplicação. Essa base de vocábulos conta com mais de 312 mil entradas, dentre as quais cerca de 19 mil são verbos terminadas em 'ar', 'er', 'ir' e 'por'.

## primeiros passos

No ambiente de desenvolvimento integrado, tal como o VSCode, instale as dependências chamando

```
sudo npm i
```

## adicionando ou filtrando palavras da lista do libreOffice

Para adicionar novos verbos, deve-se acrescentar o novo vocábulo no arquivo `lists/newVerbs.txt`
e para filtrar, no arquivo `lists/nonVerb.txt`. Em seguida, os scripts `scripts/editAllVerbsJson.ts`, `scripts/editRulesByTermJson.ts` e `scripts/ModelsJson.ts` devem ser executados, nesta ordem.
Como resultado, os arquivos json em `src/json/` usados pela aplicação serão atualizados.

## rodar a aplicação localmente

Pode-se rodar a aplicação localmente chamando no terminal, por exemplo, 

```
sudo npm run dev
```

Em seguida, pode-se verificar o local no qual a aplicação foi compilada, a exemplo do código a abaixo:

```
▲ Next.js 14.2.16
  - Local:        http://localhost:3000
  - Environments: .env
```

Feito isso, pode-se acesar a aplicação pelo endereço mostrado.