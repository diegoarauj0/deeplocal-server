# DeepLocal-server

![GitHub repo size](https://img.shields.io/github/repo-size/diegoarauj0/deeplocal-server?style=for-the-badge)
![GitHub License](https://img.shields.io/github/license/diegoarauj0/deeplocal-server?style=for-the-badge)
![GitHub package.json version](https://img.shields.io/github/package-json/v/diegoarauj0/deeplocal-server?style=for-the-badge)

![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

## 📚 Visão geral
Este projeto é uma REST API responsável pelo gerenciamento de links associados a usuários, permitindo criar, atualizar, listar e remover links de forma organizada.

Este projeto foi inspirado em plataformas como o Linktree, permitindo que usuários organizem e gerenciem múltiplos links em um único perfil.

## 🖥️ Tecnologias

- **🟨 NodeJS / 🌐 NestJS**  
Framework utilizado para criar a API REST. O motivo da escolha foi a facilidade de integração com outros pacotes como TypeORM, CORS e Swagger, além de reduzir a necessidade de criar muitos arquivos extras de configuração.

- **🍃MongoDB**  
Banco de dados não relacional. Foi escolhido pela flexibilidade de modificar collections sem a necessidade de criar migrations, o que facilita alterações na estrutura dos dados durante o desenvolvimento.

- **🟩 Supabase**
BaaS (Backend as a Service). Foi utilizado principalmente pelo sistema de storage, permitindo evitar a implementação de um sistema de upload manual. Isso elimina a necessidade de lidar com validações mais complexas, como verificação de magic bytes. Além disso, o uso de URLs assinadas reduz o consumo de banda do servidor durante uploads de backgrounds, avatares e ícones de links.

- **🟦 TypeScript**  
Linguagem utilizada no projeto. O TypeScript ajuda a manter o código mais organizado e seguro, adicionando tipagem estática e facilitando a manutenção do projeto.

## Pré-requisitos

- Node.js **v24** ou superior.
- MongoDB local ou hospedado (Atlas, MongoDB Cloud, etc.).
- Projeto Supabase configurado para storage.
- Variáveis de ambiente obrigatórias descritas abaixo.

## 🗂️ Storage Buckets (Supabase)

Para que o sistema de upload funcione corretamente, é necessário criar **3 buckets públicos** no Supabase Storage.

Esses buckets são usados para armazenar arquivos enviados pelos usuários, como avatares, backgrounds e ícones de links.

### Buckets necessários

| Bucket | Variável de ambiente | Uso |
|------|------|------|
| `avatars` | `AVATAR_BUCKET` | Armazena avatares dos usuários |
| `backgrounds` | `BACKGROUND_BUCKET` | Armazena backgrounds dos perfis |
| `icons` | `ICON_BUCKET` | Armazena ícones dos links |

### Configuração dos buckets

Ao criar os buckets no Supabase:

- O bucket **deve ser público**
- O **tamanho máximo do arquivo** pode ser configurado livremente
- O **MIME type permitido** pode ser configurado para aceitar imagens (image/*):

> ⚠️ **Aviso:** O MIME type configurado no Supabase não é a única validação aplicada.
>
> O backend define explicitamente quais **Content-Types** são permitidos ao gerar a URL assinada de upload.
>
> Essas regras estão definidas nas seguintes constantes:
>
> - `user.constant.ts` → `AVATAR_CONTENT_TYPE` e `BACKGROUND_CONTENT_TYPE`
> - `link.constant.ts` → `ICON_CONTENT_TYPE`
>
> Durante a geração da URL assinada, o servidor define o `Content-Type` esperado para o upload.  
> Se o cliente tentar enviar um arquivo com um `Content-Type` diferente do especificado, o upload será rejeitado pelo storage.
>
> Na prática, isso impede o envio de arquivos com tipos diferentes dos permitidos pela API.


## 🚀 Instalação rápida

```bash
git clone https://github.com/diegoarauj0/deeplocal-server.git
cd deeplocal-server
npm install
cp .env.example .env.development
# ajuste os valores obrigatórios antes de subir o servidor
```

## ✍ Environment Variables

O projeto utiliza variáveis de ambiente para configuração.  


⚠️ Existem dois arquivos de configuração de ambiente no projeto:

- `.env.development` — utilizado durante o desenvolvimento.
- `.env.production` — utilizado em ambiente de produção.

O arquivo `.env.example` contém valores de exemplo e alguns valores públicos que podem ser expostos sem problema.

Algumas variáveis possuem **valores padrão**, enquanto outras são **obrigatórias** para que o projeto seja iniciado.

| Variável                    | Obrigatória | Valor padrão          | Descrição                                                                 |
|-----------------------------|-------------|-----------------------|---------------------------------------------------------------------------|
| `SUPABASE_URL`              | ✅ Sim      | —                     | URL pública do projeto no Supabase (Ex.: `https://xyz.supabase.co`).     |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ Sim      | —                     | Chave com permissões elevadas usada para gerar URLs e atualizar metadados(Secret keys). |
| `MONGODB`                   | ❌ Não      | definido em `.env.example` | String de conexão com o MongoDB.                                          |
| `REFRESH_EXPIRES_IN`        | ❌ Não      | definido em `.env.example` | Tempo (ex.: `5d`) que o refresh token permanece válido.                   |
| `ACCESS_EXPIRES_IN`         | ❌ Não      | definido em `.env.example` | Tempo (ex.: `15m`) que o access token permanece válido.                   |
| `SECRET`                    | ❌ Não      | definido em `.env.example` | Segredo usado para assinar JWTs.                                          |
| `PORT`                      | ❌ Não      | definido em `.env.example` | Porta na qual o servidor escuta (padrão `3000`).                          |
| `ICON_BUCKET`               | ❌ Não      | definido em `.env.example` | Nome do bucket do Supabase para ícones.                                   |
| `AVATAR_BUCKET`             | ❌ Não      | definido em `.env.example` | Bucket para avatares, usado em outros fluxos se implementados.            |
| `ORIGIN`                    | ❌ Não      | —                     | Origem permitida para o CORS.                                            |

> ⚠️ Caso `SUPABASE_URL` ou `SUPABASE_SERVICE_ROLE_KEY` não sejam definidos, o servidor não será inicializado.
 

## 🚀 Iniciar com o NodeJS em modo de produção

```bash
npm i
npm run build
npm run prod #o servidor vai usar o .env.production
```

### 🚀 Iniciar com o NodeJS em modo de desenvolvimento

```bash
npm i
npm run dev #o servidor vai usar o .env.development
```

## 🐳 Docker

### Desenvolvimento

```bash
docker compose up
```

### Produção
1. Construa a imagem:
```bash
docker build -t deeplocal-server .
```
2. Execute-a:
```bash
docker run -p 3000:3000 deeplocal-server
```

## 🕮 Documentação (Swagger)

Com o servidor rodando em `http://localhost:3000`, abra `http://localhost:3000/docs` (ou ajuste a porta definida em `.env`). Lá estão todas as rotas de `auth`, `links`, `users` e `upload` com exemplos de payloads e respostas.

Nessa rota é possível acessar a documentação das rotas da API gerada automaticamente pelo Swagger, permitindo visualizar os endpoints disponíveis e testar as requisições diretamente pelo navegador.

## 📝 Licença

Esse projeto está sob licença MIT. Veja o arquivo [LICENÇA](LICENSE.md) para mais detalhes.
