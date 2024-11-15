## EM DESENVOLVIMENTO

_[conjugador-gules.vercel.app](https://conjugador-gules.vercel.app)_ 
é um conjugador de verbos da língua portuguesa para a web que 
estou escrevendo basicamente em _typescript_, a fim de conhecer novas palavras no processo 
e para ter alguma diversão (por que não?).
Ele está sendo criado com [nextjs](https://nextjs.org/) 
e [postgresql](https://www.postgresql.org/), dois recursos totalmente
gratuitos dentro da hospedagem do [vercel](https://vercel.com), que usa o github como 
[repositório da aplicação](https://github.com/renribsilva/conjugador),
também grátis. neste projeto, a base de vocábulos é a lista de palavras do corretor 
ortográfico do [libreoffice](https://pt-br.libreoffice.org/), que pode ser acessada
livremente [aqui](https://cgit.freedesktop.org/libreoffice/dictionaries/plain/pt_BR/pt_BR.dic)
— no projeto, ela foi salva em `palavras.txt` na pasta `/public` do 
[repositório da aplicação](https://github.com/renribsilva/conjugador).
Essa base de vocábulos conta com mais de 312 mil entradas, dentre as quais
cerca de 18 mil são palavras terminadas em 'ar', 'er', 'ir' e 'or'. Destes, até o momento, 316 são consideradas irregulares e receberão regras de conjugação próprias, o que deverá levar algum tempo.