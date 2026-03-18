# Desafio-Tecnico-Backend-Developer
Este projeto simula a integração entre um armazém (WMS) e um ERP, garantindo a sincronização de estoque entre um banco local e um ambiente que representa o Protheus.

## Tecnologias utilizadas
    Node.js
    Express
    SQLite
    Axios
    JWT

## Baixando dependencias do Projeto
    npm install

## Baixando SQLITE
    npm install express axios sqlite3
    Acesse https://www.sqlite.org/download.html
    Faça o download de Sqlite Tools
    Extraia os arquivos do download para C:\sqlite
    Abra o PowerShell dentro da pasta do projeto
    Execute C:\sqlite\sqlite3.exe inventory.db e insira a query SQL no terminal para verificar o banco do "CRM"
    Execute C:\sqlite\sqlite3.exe protheus.db e insira a query SQL no terminal para verificar o banco do "Protheus"
    
    Com a extensão do VSCode "Database Client" é possivel conectar ao banco e visualizar de forma visual
    Instale a extensão, clique em adicionar conexão, selecione o SQLite e selecione o inventory.db e repita o processo para conectar ao protheus.db  

## Estrutura do Projeto

    Service Layer
    src/
     ├── middlewere/
     | └──authMiddleware.js
     ├── database/ 
     │ ├── db.js
     │ └── protheusDb.js 
     ├── routes/
     | ├── auth.js
     │ ├── inventory.js 
     │ └── protheusMock.js
     ├── services/ 
     │ ├── inventoryService.js 
     │ └── protheusService.js 
     ├── utils/ 
     │ └── retry.js 
     └── server.js

## Rodando o Projeto
    node src/server.js

## Autenticação
    Faça uma requisição POST no Postman ou insominia para:
        POST http://localhost:3000/login

    Com o Body:
        { "username": "admin", "password": "123" }

    Obs.: Foi criado o usuário e senha "admin" e o login possui autenticação com o banco então não altere o body 

    A resposta da requisição será o token que devera ser utilizado nas demais requisições.

## Endpoinsts
    Obs.: Para todas as requisições devem ser incluidas o token de autenticação no header "Authorization: TOKEN"
    
    PATCH http://localhost:3000/v1/inventory/sync

        Body:{
                "warehouse_id": "WH-01",
                "movements": [
                    {"sku": "PEC-550", "change": -5, "reason": "sale"},
                    {"sku": "PEC-210", "change": 10, "reason": "restock"}
                ]
            }

    Sincronisa o estoque do "CRM" com o do Protheus

    GET http://localhost:3000/v1/products/low-stock

        Body:

    Busca todos os produtos com o estoque abaixo do minimo estabelecido

    GET http://localhost:3000/v1/products/ 
        
        Body:

    Busca todos os produtos e saldo em estoque

## Logica para consulta de low-stock
    Criei um indice is_low_stock que é atualizado sempre que ocorre uma movimentação no produto
    Esse indice evita o full table scan já que a busca é feita pelo indice que funciona como uma arvore chamada B-tree, ao invés de comparar dados da tabela ela pontera direto no ramo definido o que evita varrer todo o banco vazendo validações. 
