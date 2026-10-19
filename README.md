<div align="center">

# Equipe Rocket

Gerenciador de tarefas feito em equipe para a disciplina de Desenvolvimento Frontend (2026.2).

![Angular](https://img.shields.io/badge/Angular-22-DD0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![json-server](https://img.shields.io/badge/json--server-1.x-555555)
![Node](https://img.shields.io/badge/Node.js-24%2B-5FA04E?logo=nodedotjs&logoColor=white)

</div>

## Integrantes

| Nome |
| --- |
| Daniel Bernardes Araújo |
| Matheus Martins Pagel |
| Eduardo Araujo dos Santos |

## Sobre o projeto

O app organiza tarefas por projeto e mostra o fluxo de trabalho da equipe: **a fazer**, **em andamento**, **em revisão** e **concluída**. 

A aplicação foi desenvolvida em **Angular (versão 22)** com **TypeScript** em modo estrito, utilizando componentes standalone, signals para gerenciamento de estado reativo, formulários reativos e roteamento dinâmico. 

Toda a identidade visual foi inspirada no universo da **Equipe Rocket**, com uma paleta harmoniosa em tons escuros (preto e grafite) combinados com o clássico vermelho escarlate, tipografia temática e logotipo oficial.

Os dados são consumidos em tempo real de uma API REST local servida pelo `json-server` a partir do arquivo `db.json`.

---

## Funcionalidades Implementadas

- **Centro de Comando & Painel de Projetos (`/projetos`)**: Listagem dinâmica de projetos cadastrados com badges de disciplina, ações rápidas e navegação integrada.
- **Página de Detalhes do Projeto (`/projetos/:id`)**: Exibição detalhada das informações do projeto e filtragem dinâmica de todas as tarefas pertencentes a ele.
- **Quadro Kanban com Slugs Dinâmicos (`/projetos/:id/:nome`)**: Visão de quadro tático para acompanhamento das tarefas por coluna com URLs amigáveis e formatadas em hífen (ex: `/projetos/1/gerenciador-de-tarefas`).
- **Lista Geral de Tarefas (`/tarefas` e `/tarefas/:id`)**: Visualização de todas as tarefas cadastradas na aplicação com filtragem por ID.
- **Cartão de Tarefa Reutilizável (`app-tarefa-card`)**: Componente padronizado com indicativo de status por cor, badge de prioridade, responsável com avatar temático, data formatada e botão de edição direta.
- **Edição de Tarefas (`/tarefas/:id/editar`)**: Tela com formulário reativo (`ReactiveFormsModule`) para alteração de título, descrição, responsável, prazo, status e prioridade, atualizando os dados via requisição `PATCH` na API.
- **Página Não Encontrada 404 (`/**`)**: Tratamento de rotas inexistentes com tela temática e botão de retorno seguro à base de operações.

---

## Como rodar

Você precisa do Node.js 24 ou superior (`node -v` mostra a versão).

```bash
git clone https://github.com/Yourdevdaniel/Equipe-Rocket.git
cd Equipe-Rocket
npm install
```

Use dois terminais abertos na raiz do projeto. No primeiro, suba o Angular:

```bash
npm start
```

No segundo, suba a API:

```bash
npx json-server db.json
```

O app abre em `http://localhost:4200` e a API em `http://localhost:3000`.

---

## Estrutura de Rotas do Frontend

| Rota | Componente | Descrição |
| --- | --- | --- |
| `/` | Redirecionamento | Redireciona para `/projetos` |
| `/projetos` | `ListaProjetos` | Painel principal com a lista de projetos da equipe |
| `/projetos/:id` | `DetalheProjeto` | Detalhes de um projeto específico e suas tarefas |
| `/projetos/:id/:nome` | `QuadroKambam` | Quadro Kanban do projeto com URL amigável (slug) |
| `/tarefas` | `ListaTarefas` | Listagem geral de tarefas cadastradas |
| `/tarefas/:id` | `ListaTarefas` | Visualização de tarefa(s) filtrada(s) por ID |
| `/tarefas/:id/editar` | `EditarTarefa` | Formulário para edição e atualização de uma tarefa |
| `/**` | `PaginaNaoEncontrada`| Página 404 personalizada temática |

---

## Contrato de dados

Todo mundo da equipe lê e grava os mesmos dados, então o formato de um projeto e de uma tarefa está fixado em arquivos que concordam entre si:

| Arquivo | Onde fica | Para que serve |
| --- | --- | --- |
| `db.json` | raiz do projeto | Banco de dados local. Cada chave (`projetos`, `tarefas`) vira uma rota da API. |
| `src/app/models.ts` | pasta `src/app/` | Tipagens TypeScript utilizadas nos componentes e serviços. |
| `src/tipos.ts` | pasta `src/` | Tipos do contrato base da disciplina. |

Alguns detalhes essenciais do contrato:
- O `id` é texto (`"1"`), porque o `json-server` gera ids como texto.
- `prazo` e `criadoEm` são strings no formato `AAAA-MM-DD`, já que JSON não possui tipo nativo de data.
- `status` aceita: `a-fazer`, `em-andamento`, `em-revisao` e `concluida`.
- `prioridade` aceita: `baixa`, `media` e `alta`.

---

## Endpoints da API

| Método | Endereço | Descrição |
| --- | --- | --- |
| `GET` | `http://localhost:3000/projetos` | Retorna todos os projetos cadastrados |
| `GET` | `http://localhost:3000/projetos/:id` | Retorna um projeto por ID |
| `GET` | `http://localhost:3000/projetos/:id?_embed=tarefas` | Retorna o projeto com suas tarefas embutidas |
| `GET` | `http://localhost:3000/tarefas` | Retorna todas as tarefas |
| `GET` | `http://localhost:3000/tarefas/:id` | Retorna uma tarefa por ID |
| `PATCH`| `http://localhost:3000/tarefas/:id` | Atualiza campos de uma tarefa existente |

O `json-server` grava diretamente no `db.json`. O arquivo `db.seed.json` guarda uma cópia segura dos dados originais. Para restaurar o estado inicial:

```bash
cp db.seed.json db.json
```

---

## Andamento do Projeto

### Marco 1 - Projeto no ar
- [x] 01. Criar o repositório da equipe
- [x] 02. Criar o projeto no framework da equipe
- [x] 03. Escrever o README
- [x] 04. Adicionar o contrato de dados
- [x] 05. Subir a API local
- [x] 06. Configurar o quadro no GitHub Projects

### Marco 2 - Listagem e rotas
- [x] 07. Criar o módulo de acesso à API (leitura)
- [x] 08. Criar o componente de cartão de tarefa
- [x] 09. Criar a tela de lista de tarefas
- [x] 10. Configurar o roteador
- [x] 11. Criar a tela de detalhe da tarefa
- [x] 12. Criar o layout base e a navegação
- [x] 13. Criar a tela de lista de projetos
- [x] 14. Criar a página do projeto
- [x] 15. Criar o slide de apresentação do Marco 2

### Marco 3 - Cadastro e edição
- [ ] 16. Ampliar o módulo da API (escrita)
- [x] 17. Criar o componente de formulário de tarefa
- [ ] 18. Criar a tela de nova tarefa
- [x] 19. Criar a tela de edição de tarefa
- [ ] 20. Validar o formulário
- [ ] 21. Tornar o formulário acessível
- [ ] 22. Criar cadastro e edição de projeto
- [ ] 23. Criar o slide de apresentação do Marco 3
