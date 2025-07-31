# Conjugador-gules

**Conjugador-gules** é uma ferramenta para conjugação de verbos da língua portuguesa brasileira. O projeto foi desenvolvido principalmente em **Typescript** e utiliza [Nextjs](https://nextjs.org/) e [Postgresql](https://www.postgresql.org/) — ambos recursos gratuitos na hospedagem da 
[Vercel](https://vercel.com).

A base de dados de vocábulos é oriunda do projeto VERO do LibreOffice
(lista de palavras do corretor ortográfico), que pode ser acessada livremente através deste [link aqui](https://cgit.freedesktop.org/libreoffice/dictionaries/plain/pt_BR/pt_BR.dic). No repositório do projeto, essa lista de vocábulos foi salva em `pt-BR.dic`, na pasta `libreOfficeSource`. A base contém mais de 312 mil palavras, das quais cerca de 19 mil são verbos terminados em **-ar, -er, -ir e -por**.

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

## Adicionar ou filtrar palavras da lista do libreOffice

É possível adicionar novos verbos ao conjugador ou filtrar palavras contantes da lista de vocábulos do projeto VERO a fim de otimizar a base de verbos deste conjugador.

1. Adicionar verbos

    Para adicionar novos verbos, deve-se acrescentar o novo vocábulo no arquivo `lists/newVerbs.txt` 
2. Filtrar palavras da lista do libreOffice

    Para filtrar verbos da lista do libreOffice, deve-se inserir o vocábulo desejado no arquivo `lists/nonVerb.txt`. 
    
3. Atualizando arquivos Json

    Em seguida, os scripts `scripts/editAllVerbsJson.ts`, `scripts/editRulesByTermJson.ts` e `scripts/ModelsJson.ts` devem ser executados, nesta ordem. Isso pode levar algumas algumas horas.

## Integrar com o Postgres

Essa aplicação utiliza o serviço gratuito [Postgres da Vercel](https://vercel.com/docs/postgres) (optou-se pelo provedor Neon). Nele, apenas duas tabelas são necessárias: uma para armazenar a conjugação e outra para armazenar as sugestões de novos verbos.

```
List of relations
Schema	Name        	Type	Owner
public 	json 	        table 	default
public 	requisitions 	table 	default
```

A primeira deve ser nomeada `json`, com uma única coluna nomeada de `conjugations`.
 
 ```
 Table "public.json"
Column	        Type
conjugations 	jsonb
 ```
 
A segunda deve ser nomeada `requisitions`, com duas colunas: `type` e `data`. 

```
Table "public.requisitions"
Column	    Type
type 	    text 			
data 	    jsonb 			
```

A primeira coluna de `requisitions`, `type`, deve ter duas linhas: uma chamada de `new_verbs` e outra chamada de `review_conj`.

```
#	type
1	new_verbs
2	review_conj
```

Feito isso, todas as chaves criadas em _Environments_ do projeto Vercel devem ser copiadas em um arquivo `.env` na raiz da aplicação (pode-se usar a dependência da [Vercel CLI](https://vercel.com/docs/cli/env) para fazer isso automaticamente)

```
# Created by Vercel CLI
POSTGRES_DATABASE=
POSTGRES_HOST=
POSTGRES_PASSWORD=
POSTGRES_PRISMA_URL=
POSTGRES_URL=
POSTGRES_URL_NON_POOLING=
POSTGRES_URL_NO_SSL=
POSTGRES_USER=
```

O uso de estrutura e nomes distintos implica necessariamente na moficação das APIs contidas em `src/pages/api`. 

## Rodar a aplicação localmente

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