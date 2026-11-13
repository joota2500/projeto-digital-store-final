# Digital Store

Olá, eu sou o [João Victor Rocha Costa](https://github.com/joota2500). Este é o meu projeto final do curso Geração Tech, da Digital College: uma loja de tênis online, com o site em React e uma API em Node.js ligada a um banco MySQL.

Eu entreguei o Front-end primeiro, num repositório só com o site. Depois copiei tudo para este repositório e construí o Back-end em cima, sem mexer na entrega original. Aqui o site busca os produtos no banco, dá para criar conta, entrar, montar um carrinho e acompanhar os pedidos.

## Links

- Site publicado (Vercel, só o Front-end): https://projeto-digital-store-shopee.vercel.app/
- Este repositório (Front + Back): https://github.com/joota2500/projeto-digital-store-final
- Entrega do Front-end (sem banco): https://github.com/joota2500/projeto-digital-store
- Enunciado oficial do Back-end: https://github.com/digitalcollegebr/projeto-backend

O site na Vercel continua no ar mesmo sem a API. Quando o back-end não responde, a loja usa um JSON estático com os produtos. Carrinho, login e pedidos só funcionam de verdade com a API ligada no computador.

## O que tem no projeto

No site dá para:

- ver a Home, a listagem com busca e filtros, as categorias e a página de cada produto
- criar uma conta e entrar (o token JWT fica salvo no navegador)
- adicionar um tênis ao carrinho, escolhendo tamanho e cor
- finalizar a compra em 3 etapas (carrinho, entrega e pagamento), com Pix, cartão ou boleto — é uma simulação, para o curso
- acompanhar os pedidos em **Meus Pedidos**, com status, itens e a opção de cancelar enquanto o pedido ainda não foi enviado

Na API estão os CRUDs de usuários, categorias e produtos, o login com JWT, as rotas de pedidos e a documentação no Swagger.

## Tecnologias

**Front-end** (na raiz do projeto): React 19, Vite, React Router, Tailwind CSS v4 e Lucide React.

**Back-end** (pasta `backend/`): Node.js, Express, Sequelize, MySQL, JWT, bcrypt, Swagger, Jest e Supertest.

O código do back-end está organizado em MVC (rotas, controllers, services e models), com comentários em português.

## Como rodar

Você precisa do Node.js e do MySQL. No Ubuntu / Linux Mint, o MySQL instala assim:

```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl enable --now mysql
```

Depois abra o MySQL com `sudo mysql` e rode o seguinte, trocando `a_senha_que_voce_escolher` por uma senha sua:

```sql
CREATE DATABASE digital_store;
CREATE DATABASE digital_store_test;
CREATE USER 'digital_store'@'localhost' IDENTIFIED BY 'a_senha_que_voce_escolher';
GRANT ALL PRIVILEGES ON digital_store.* TO 'digital_store'@'localhost';
GRANT ALL PRIVILEGES ON digital_store_test.* TO 'digital_store'@'localhost';
FLUSH PRIVILEGES;
```

A senha fica só no arquivo `backend/.env`, que não vai para o GitHub. Na pasta `backend/` já existe um `.env.example` para copiar, se precisar. Abra o `.env` e preencha assim:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=digital_store
DB_PASS=TROCAR_PELA_SENHA
DB_NAME=digital_store
DB_NAME_TEST=digital_store_test
JWT_SECRET=...
PORT=3001
```

Coloque em `DB_PASS` a mesma senha do `CREATE USER`. O `JWT_SECRET` já vem preenchido.

Com o MySQL no ar e o `.env` pronto, crie as tabelas e coloque os dados de exemplo:

```bash
cd backend
npm install
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

O seed cria:

- um usuário de demonstração: **admin@digitalstore.com** / senha **123@123**
- as 4 categorias da loja (Casual, Esporte e lazer, Corrida e Utilitário)
- os 15 produtos do Front-end, com imagens, tamanhos e cores

Para ligar o site e a API juntos, volte para a raiz do projeto e rode:

```bash
./iniciar.sh
```

ou, se preferir:

```bash
npm run start:all
```

Isso sobe a API em http://localhost:3001 e o site em http://localhost:5173 no mesmo terminal. A documentação das rotas fica em http://localhost:3001/api-docs. Para parar os dois, aperte Ctrl+C.

Se quiser rodar em terminais separados:

```bash
# terminal 1, a API
cd backend
npm run dev

# terminal 2, o site (na raiz do projeto)
npm install
npm run dev
```

O endereço da API no front pode ser trocado no arquivo `.env` da raiz (veja o `.env.example`). O padrão é `http://localhost:3001`.

Para testar as rotas protegidas no Swagger, faça login em `POST /v1/user/token` com o admin, copie o token e clique em **Authorize**.

## Páginas do site

- `/` — Home
- `/products` ou `/produtos` — listagem (aceita `?filter=` e `?category=`)
- `/product/:id` — página do produto; o botão Comprar adiciona ao carrinho
- `/categorias` — categorias da loja
- `/carrinho` — itens do carrinho e resumo do pedido
- `/carrinho/entrega` — endereço de entrega (pede login)
- `/carrinho/pagamento` — forma de pagamento e finalização da compra
- `/meus-pedidos` — lista dos pedidos de quem está logado
- `/meus-pedidos/:id` — detalhes de um pedido, com opção de cancelar
- `/login` e `/cadastro` — entrar ou criar conta

A busca, os filtros e a ordenação da listagem rodam no próprio Front-end. As imagens oficiais do projeto estão em `public/` e os ícones em `src/assets/`.

O Front-end busca produtos e categorias na API (`GET /v1/product/search` e `GET /v1/category/search`), no arquivo `src/services/api.js`. A resposta oficial (price, price_with_discount, category_ids, images e options) é convertida para o formato que as páginas já usavam. Se a API estiver desligada, ele cai no JSON `/api/products.json`.

## Endpoints da API

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/v1/user/:id` | não | Buscar usuário |
| POST | `/v1/user` | não | Cadastrar usuário |
| POST | `/v1/user/token` | não | Login (gera o JWT) |
| PUT | `/v1/user/:id` | sim | Atualizar usuário |
| DELETE | `/v1/user/:id` | sim | Deletar usuário |
| GET | `/v1/category/search` | não | Listar categorias |
| GET | `/v1/category/:id` | não | Buscar categoria |
| POST | `/v1/category` | sim | Cadastrar categoria |
| PUT | `/v1/category/:id` | sim | Atualizar categoria |
| DELETE | `/v1/category/:id` | sim | Deletar categoria |
| GET | `/v1/product/search` | não | Listar produtos |
| GET | `/v1/product/:id` | não | Buscar produto |
| POST | `/v1/product` | sim | Cadastrar produto |
| PUT | `/v1/product/:id` | sim | Atualizar produto |
| DELETE | `/v1/product/:id` | sim | Deletar produto |
| POST | `/v1/order` | sim | Criar pedido a partir do carrinho |
| GET | `/v1/order` | sim | Listar os pedidos de quem está logado |
| GET | `/v1/order/:id` | sim | Buscar um pedido (só o dono) |
| PUT | `/v1/order/:id/cancel` | sim | Cancelar um pedido pendente ou pago |

Busca de categorias: `limit`, `page`, `fields`, `use_in_menu`.

Busca de produtos: `limit`, `page`, `fields`, `match`, `category_ids`, `price-range` e `option[id]`.

`limit=-1` devolve todos os itens (o padrão é 12).

Nos pedidos, o total é calculado com o preço que está no banco (usa o desconto quando houver). O estoque é conferido e reduzido na hora da compra, e devolvido se o pedido for cancelado. Frete grátis a partir de R$ 200; abaixo disso, R$ 19,90. Pix e cartão entram com status pago (pagamento simulado); boleto fica pendente.

## Testes

```bash
cd backend
npm test
```

Os testes usam o banco `digital_store_test` e rodam as migrations e os seeds sozinhos. Eles cobrem os CRUDs, o login e as rotas de pedidos.

## Decisões sobre o enunciado oficial

O repositório oficial tem alguns trechos que se contradizem. Eu segui estas escolhas:

- **Token ausente ou inválido responde 401**, e não 400. A seção 05 do enunciado cita 400, mas as próprias rotas de PUT e DELETE já listam 401, que é o status HTTP correto quando falta autenticação.
- **POST /v1/user** e **POST /v1/user/token** são públicos. Se pedissem token, ninguém conseguiria se cadastrar nem fazer login.
- O campo **radius** aceita número ou texto (`"4px"`) e é salvo como inteiro (`4`), porque o exemplo oficial manda `"4px"` e a coluna no banco é INTEGER.
- As opções aceitam **value** ou **values**, porque o exemplo oficial usa os dois nomes.
- O **e-mail é único**. A senha é salva com **bcrypt** e **nunca é devolvida** nas respostas.
- No cadastro, **confirmPassword** precisa ser igual a **password**.
- Imagens enviadas em **base64** são gravadas na pasta `uploads/` e servidas em `/uploads`. As imagens que já existem no Front-end ficam em `/media`.
- Ao apagar um produto, as imagens, as opções e as ligações com categorias também são removidas (**cascade**). Os itens de pedidos antigos guardam o nome e a imagem do produto, para o histórico não sumir.

O carrinho e a página de Meus Pedidos não eram exigidos no enunciado. Eu incluí mesmo assim, para a loja ficar completa: o botão Comprar deixa de ser só um aviso e o pedido vai de verdade para o banco.

## O que eu aprendi (e o que ainda quero fazer)

Foi a primeira vez que eu montei sozinho uma API com banco, migrations, autenticação e testes, e liguei ela num site que já existia. A parte que mais me ensinou foi organizar o back-end em camadas e fazer o front conversar com a API sem quebrar a versão publicada na Vercel.

Se eu continuar o projeto, o próximo passo seria colocar a API e o banco no ar (por exemplo no Render, com um MySQL online), para o site na Vercel também mostrar os pedidos de verdade. Fora isso, dá para evoluir o pagamento, o estoque na tela do produto e um painel para mudar o status do pedido (pago, enviado, entregue).

## Estrutura da pasta backend

```
backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── docs/
│   ├── app.js
│   └── server.js
├── migrations/
├── seeders/
├── tests/
├── uploads/
├── .env.example
└── package.json
```
