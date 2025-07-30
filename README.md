# Conjugador-gules

**Conjugador-gules** é uma ferramenta para conjugação de verbos da língua portuguesa brasileira. O projeto foi desenvolvido principalmente em **Typescript** e utiliza *[Nextjs](https://nextjs.org/)* e *[Postgresql](https://www.postgresql.org/)* — ambos recursos gratuitos na hospedagem da 
*[Vercel](https://vercel.com)*.

A base de dados de vocábulos é oriunda do do projeto VERO do LibreOffice
(lista de palavras do corretor ortográfico), que pode ser acessada livremente através do [link aqui](https://cgit.freedesktop.org/libreoffice/dictionaries/plain/pt_BR/pt_BR.dic). No repositório do projeto, essa lista de vocábulos foi salva em `pt-BR.dic`, na pasta `libreOfficeSource`. A base contém mais de 312 mil palavras, das quais cerca de 19 mil são verbos terminados em **-ar, -er, -ir e -por**.

## Primeiros passos

Para começar o desenvolvimento do projeto, siga os seguintes passos:

1. Clone o repositório:

```
git clone https://github.com/renribsilva/conjugador
```

2. Instale as dependências:

```
sudo npm i
```

## Adicionando ou filtrando palavras da lista do libreOffice

1. Adicionar verbos

    Para adicionar novos verbos, deve-se acrescentar o novo vocábulo no arquivo `lists/newVerbs.txt` e para filtrar, no arquivo `lists/nonVerb.txt`. Em seguida, os scripts `scripts/editAllVerbsJson.ts`, `scripts/editRulesByTermJson.ts` e `scripts/ModelsJson.ts` devem ser executados, nesta ordem. Como resultado, os arquivos json em `src/json/` usados pela aplicação serão atualizados.

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