## EM DESENVOLVIMENTO

[conjugador-gules.vercel.app](https://conjugador-gules.vercel.app) 
é um conjugador de verbos da língua portuguesa para a web que 
estou escrevendo basicamente em _typescript_, a fim de conhecer novas palavras no processo 
e para ter alguma diversão (por que não?).
Ele está sendo criado com [nextjs](https://nextjs.org/) 
e [postgresql](https://www.postgresql.org/), dois recursos totalmente
gratuitos dentro da hospedagem do vercel, que usa o github como 
repositório da aplicação,
também grátis. neste projeto, a base de vocábulos é a lista de palavras do corretor 
ortográfico do libreoffice, que pode ser acessada
livremente [aqui](https://cgit.freedesktop.org/libreoffice/dictionaries/plain/pt_BR/pt_BR.dic)
— no projeto, ela foi salva em `pt-BR.txt` na pasta `/libreOfficeSource` do 
repositório da aplicação.
Essa base de vocábulos conta com mais de 312 mil entradas, dentre as quais
cerca de 19 mil são verbos terminadas em 'ar', 'er', 'ir' e 'por'.