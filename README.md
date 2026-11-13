# Digital Store

Projeto final do curso (Geração Tech / Digital College).

## Autor

- [João Victor Rocha Costa](https://github.com/joota2500)

## Links

- Site publicado (Vercel, Front-end): https://projeto-digital-store-shopee.vercel.app/
- Repositório deste projeto (Front + Back): https://github.com/joota2500/projeto-digital-store-final
- Repositório da entrega do Front-end (sem banco): https://github.com/joota2500/projeto-digital-store

Este repositório é a versão completa: o Front-end que já foi entregue e o Back-end com banco de dados. O outro repositório (projeto-digital-store) permanece sem banco, como foi enviado no projeto de Front-end.

---

## Front-end

### Tecnologias

- React 19 + Vite
- React Router
- Tailwind CSS v4
- Lucide React (ícones)

### Como rodar

```bash
npm install
npm run dev
```

Abra http://localhost:5173

### Páginas

- `/` - Home
- `/products` ou `/produtos` - Listagem de produtos (aceita `?filter=` e `?category=`)
- `/product/:id` - Visualização do produto
- `/categorias` - Categorias da loja; ao clicar, abre a listagem já filtrada
- `/login`, `/cadastro` e `/meus-pedidos` - Página em construção (sem back-end neste projeto)

### API do Front-end (arquivo estático)

Por enquanto o Front-end ainda consome um JSON estático, sem banco:

- Endereço: `/api/products.json` (arquivo em `public/api/products.json`)

A aplicação consome essa API com `fetch` no serviço `src/services/api.js`, pelas funções `getProducts()` e `getProductById(id)`. As páginas Home, Listagem e Produto usam `useEffect` e `useState` para buscar os dados, mostrar "Carregando..." e exibir uma mensagem se a busca falhar.

As funções auxiliares (formatação de preço, opções dos filtros e nomes das categorias) continuam em `src/data/products.js`.

A API do Back-end (abaixo) já está pronta e documentada no Swagger. A ligação do Front-end com essa API pode ser feita depois, sem perder o que já foi entregue.

### Observações

- A busca, os filtros e a ordenação da listagem funcionam no front-end
- Imagens oficiais do projeto em `public/` e ícones em `src/assets/`

---

## Back-end

API REST na pasta `backend/`, com Express, Sequelize, MySQL e JWT, seguindo o repositório oficial [digitalcollegebr/projeto-backend](https://github.com/digitalcollegebr/projeto-backend).

### Tecnologias

- Node.js + Express.js
- Sequelize + MySQL
- JWT (jsonwebtoken) e bcrypt
- Dotenv e Nodemon
- Swagger UI (`/api-docs`)
- Jest + Supertest

### 1. Instalar o MySQL

No Ubuntu / Linux Mint:

```bash
sudo apt update
sudo apt install mysql-server
```

Depois abra o MySQL (`sudo mysql`) e rode:

```sql
CREATE DATABASE digital_store;
CREATE DATABASE digital_store_test;
CREATE USER 'digital_store'@'localhost' IDENTIFIED BY 'a_senha_que_voce_escolher';
GRANT ALL PRIVILEGES ON digital_store.* TO 'digital_store'@'localhost';
GRANT ALL PRIVILEGES ON digital_store_test.* TO 'digital_store'@'localhost';
FLUSH PRIVILEGES;
```

Escolha a senha que quiser e anote ela. Ela só fica no arquivo `backend/.env`, que não vai para o GitHub.

### 2. Configurar o arquivo .env

Na pasta `backend/` já existe um arquivo `.env` (e também um `.env.example` para copiar se precisar). Abra o `.env` e troque só a senha:

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

Coloque em `DB_PASS` a mesma senha que você usou no `CREATE USER`. O `JWT_SECRET` já vem preenchido.

### 3. Instalar, criar as tabelas e popular o banco

```bash
cd backend
npm install
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

O seed cria:

- um usuário admin: **admin@digitalstore.com** / senha **123@123**
- as 4 categorias da loja (Casual, Esporte e lazer, Corrida e Utilitário)
- os 15 produtos do Front-end, com imagens, tamanhos e cores

### 4. Rodar a API

```bash
npm run dev
```

- API: http://localhost:3001
- Documentação (Swagger): http://localhost:3001/api-docs

Para testar as rotas protegidas no Swagger, faça login em `POST /v1/user/token` com o admin, copie o token e clique em **Authorize**.

### Endpoints

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

Busca de categorias: `limit`, `page`, `fields`, `use_in_menu`.

Busca de produtos: `limit`, `page`, `fields`, `match`, `category_ids`, `price-range` e `option[id]`.

`limit=-1` devolve todos os itens (o padrão é 12).

### Testes

```bash
cd backend
npm test
```

Os testes usam o banco `digital_store_test` e rodam as migrations e os seeds sozinhos.

### Decisões sobre o enunciado oficial

O repositório oficial tem alguns trechos que se contradizem. Segui estas escolhas:

- **Token ausente ou inválido responde 401**, e não 400. A seção 05 do enunciado cita 400, mas as próprias rotas de PUT e DELETE já listam 401, que é o status HTTP correto quando falta autenticação.
- **POST /v1/user** e **POST /v1/user/token** são públicos. Se pedissem token, ninguém conseguiria se cadastrar nem fazer login.
- O campo **radius** aceita número ou texto (`"4px"`) e é salvo como inteiro (`4`), porque o exemplo oficial manda `"4px"` e a coluna no banco é INTEGER.
- As opções aceitam **value** ou **values**, porque o exemplo oficial usa os dois nomes.
- O **e-mail é único**. A senha é salva com **bcrypt** e **nunca é devolvida** nas respostas.
- No cadastro, **confirmPassword** precisa ser igual a **password**.
- Imagens enviadas em **base64** são gravadas na pasta `uploads/` e servidas em `/uploads`. As imagens que já existem no Front-end ficam em `/media`.
- Ao apagar um produto, as imagens, as opções e as ligações com categorias também são removidas (**cascade**).

### Estrutura da pasta backend

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
