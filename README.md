<div align="center">

# Equipe Rocket 🚀

Gerenciador de tarefas e projetos desenvolvido em equipe para a disciplina de **Desenvolvimento Frontend (2026.2)**.

![Angular](https://img.shields.io/badge/Angular-22-DD0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![json-server](https://img.shields.io/badge/json--server-1.x-555555)
![Node](https://img.shields.io/badge/Node.js-24%2B-5FA04E?logo=nodedotjs&logoColor=white)

</div>

## Integrantes da Equipe

| Nome |
| --- |
| Daniel Bernardes Araújo |
| Matheus Martins Pagel |
| Eduardo Araujo dos Santos |

---

## Sobre o Projeto

O sistema organiza tarefas por projeto e acompanha o fluxo de trabalho da equipe em quatro estágios: **A Fazer**, **Em Andamento**, **Em Revisão** e **Concluída**.

A aplicação foi construída com **Angular 22** e **TypeScript** em modo estrito, explorando os recursos mais modernos do ecossistema:
- **Componentes Standalone** (sem `NgModules` legados);
- **Angular Signals** (`signal`, `computed`) para gerenciamento de estado granular e reatividade de alta performance;
- **Reactive Forms tipados** com validação síncrona e acessibilidade nativa (`aria-invalid`, `aria-describedby`, foco automático);
- **Injeção de Dependências nativa** via serviços Singleton para compartilhamento de estado entre rotas;
- **Comunicação HTTP via RxJS Observables** integrada ao `json-server` com suporte a IDs numéricos sequenciais.

Toda a identidade visual foi inspirada no universo da **Equipe Rocket**, com tema escuro (preto e grafite), acentos em vermelho escarlate, tipografia temática (*Cinzel* e *Inter*) e CSS puro baseado em Design Tokens.

---

## Funcionalidades Implementadas

### 🎯 Gestão de Projetos (Marcos 1 a 3)
- **Painel de Projetos (`/projetos`)**: Listagem dinâmica de projetos com badges de disciplina, metadados e atalhos rápidos.
- **Página de Detalhes do Projeto (`/projetos/:id`)**: Dados completos do projeto com listagem filtrada de suas tarefas vinculadas.
- **Novo Projeto (`/projetos/novo`)**: Formulário reativo para cadastro de projetos com gravação na API e ID sequencial.
- **Edição de Projeto (`/projetos/:id/editar`)**: Atualização dos dados do projeto via requisição `PATCH`.

### 📋 Gestão de Tarefas (Marcos 2 e 3)
- **Lista de Tarefas (`/tarefas` e `/tarefas/:id`)**: Listagem geral de tarefas cadastradas na aplicação e suporte a filtro por ID na URL.
- **Nova Tarefa (`/tarefas/nova`)**: Formulário reativo com validações obrigatórias (título mínimo 3 caracteres, responsável, prazo), seletor dinâmico de projetos vindo da API e prevenção de cliques duplos com Signals (`carregando`, `enviando`, `erro`).
- **Edição de Tarefas (`/tarefas/:id/editar`)**: Carga automática dos dados via `buscarTarefa(id)` e preenchimento reativo com `patchValue`, salvando apenas os campos alterados via `PATCH`.
- **Card Expandido / Modal Centralizado**: Ao clicar em qualquer cartão, a tarefa é exibida em destaque centralizado na tela com overlay escuro, revelando o projeto vinculado, dados completos, atalho rápido de edição (lápis) e fechamento por botão "X" ou tecla `Esc`.

### 🔍 Busca, Filtros e Visão de Quadro (Marco 4)
- **Busca por Título Tolerante (Issue #24)**: Campo de busca que normaliza o texto, ignorando diferenças entre maiúsculas/minúsculas e acentuação (ex: digitar *"analise"* encontra *"Análise"*).
- **Filtros por Status e Prioridade (Issue #25)**: Seletores independentes que se combinam entre si e com a busca por título, incluindo contador de resultados em tempo real e botão de limpeza rápida.
- **Estado Centralizado (`FiltrosService` - Issue #26)**: Serviço singleton (`providedIn: 'root'`) que mantém a busca e os filtros intactos ao navegar entre telas.
- **Quadro Kanban (`/projetos/:id/:nome` - Issue #27)**: Visão de quadro tático com colunas divididas por status (*A Fazer*, *Em Andamento*, *Em Revisão* e *Concluída*), alimentadas reativamente por Signals `computed()`.
- **Alternância Fluida entre Lista e Quadro (Issue #28)**: Navegação bidirecional preservando os mesmos filtros aplicados.
- **Mudança de Status pelo Cartão (Issue #29)**: Seletor de status embutido no cartão de tarefa (`app-tarefa-card`) que dispara `PATCH /tarefas/:id`. O cartão emite `output<Tarefa>()`, o componente pai atualiza a lista e o cartão se move de coluna no Kanban automaticamente, com reversão visual caso a API retorne erro.

### 🛡️ Usabilidade e Infraestrutura
- **Página 404 Customizada (`/**`)**: Tela temática com navegação segura de retorno.
- **IDs Numéricos Sequenciais**: Middleware `fix-json-server.mjs` associado à lógica `proximoId()` no serviço, garantindo IDs sequenciais (`"1"`, `"2"`, `"3"...`) em vez de identificadores aleatórios.

---

## Como Rodar o Projeto

### Pré-requisitos
- **Node.js 24 ou superior** (`node -v` para conferir a versão).
- **npm** (incluso no Node.js).

### Passo a Passo

1. Clone o repositório e entre na pasta:
```bash
git clone https://github.com/Yourdevdaniel/Equipe-Rocket.git
cd Equipe-Rocket
```

2. Instale as dependências:
```bash
npm install
```

3. Em um terminal, inicie a API local (`json-server`):
```bash
npm run api
```
> A API estará disponível em `http://localhost:3000`.

4. Em um segundo terminal, inicie o servidor de desenvolvimento do Angular:
```bash
npm start
```
> A aplicação estará acessível em `http://localhost:4200`.

### Scripts Úteis

| Comando | Descrição |
| --- | --- |
| `npm start` | Inicia o servidor Angular de desenvolvimento (`ng serve`) |
| `npm run api` | Executa o script de correção de IDs e sobe o `json-server` na porta 3000 |
| `npm test` | Roda a suíte de testes unitários com Vitest |
| `npm run build` | Gera o build de produção otimizado na pasta `dist/` |

Para restaurar o banco de dados local para os dados iniciais de exemplo da disciplina:
```bash
cp db.seed.json db.json
```

---

## Estrutura de Rotas do Frontend

| Rota | Componente | Descrição |
| --- | --- | --- |
| `/` | *Redirecionamento* | Redireciona para `/projetos` |
| `/projetos` | `ListaProjetos` | Painel de controle com todos os projetos |
| `/projetos/novo` | `CriarProjeto` | Formulário para cadastro de novos projetos |
| `/projetos/:id` | `DetalheProjeto` | Detalhes do projeto e tarefas relacionadas |
| `/projetos/:id/editar` | `EditarProjeto` | Edição dos dados de um projeto |
| `/projetos/:id/:nome` | `QuadroKambam` | Quadro Kanban do projeto com URL amigável (slug) |
| `/tarefas` | `ListaTarefas` | Lista geral de tarefas com busca e filtros |
| `/tarefas/nova` | `CriarTarefa` | Formulário para cadastro de nova tarefa |
| `/tarefas/:id` | `ListaTarefas` | Lista com foco na tarefa informada por ID |
| `/tarefas/:id/editar` | `EditarTarefa` | Edição completa dos campos de uma tarefa |
| `/**` | `PaginaNaoEncontrada` | Página 404 personalizada da Equipe Rocket |

---

## Contrato de Dados

O modelo de dados segue estritamente o contrato da disciplina:

| Arquivo | Localização | Finalidade |
| --- | --- | --- |
| `db.json` | Raiz do projeto | Banco de dados local consumido pelo `json-server`. |
| `src/app/models.ts` | `src/app/` | Interfaces TypeScript (`Projeto`, `Tarefa`, `ProjetoComTarefas`). |
| `src/tipos.ts` | `src/` | Tipagens originais da disciplina. |

### Regras do Contrato:
- **`id`**: String sequencial (`"1"`, `"2"`, `"3"...`).
- **`prazo` e `criadoEm`**: Strings no formato ISO `AAAA-MM-DD`.
- **`status`**: `'a-fazer'` \| `'em-andamento'` \| `'em-revisao'` \| `'concluida'`.
- **`prioridade`**: `'baixa'` \| `'media'` \| `'alta'`.

---

## Endpoints da API

| Método | Endpoint | Descrição |
| --- | --- | --- |
| `GET` | `/projetos` | Lista todos os projetos |
| `GET` | `/projetos/:id` | Obtém detalhes de um projeto específico |
| `GET` | `/projetos/:id?_embed=tarefas` | Obtém o projeto com a coleção de tarefas associadas |
| `POST` | `/projetos` | Cria um novo projeto com ID sequencial |
| `PATCH`| `/projetos/:id` | Atualiza campos de um projeto |
| `GET` | `/tarefas` | Lista todas as tarefas |
| `GET` | `/tarefas/:id` | Obtém os dados de uma tarefa |
| `POST` | `/tarefas` | Cria uma nova tarefa vinculada a um projeto |
| `PATCH`| `/tarefas/:id` | Atualiza campos de uma tarefa (ex: status ou edição completa) |

---

## Andamento dos Marcos

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
- [x] 16. Ampliar o módulo da API (escrita)
- [x] 17. Criar o componente de formulário de tarefa
- [x] 18. Criar a tela de nova tarefa
- [x] 19. Criar a tela de edição de tarefa
- [x] 20. Validar o formulário
- [x] 21. Tornar o formulário acessível
- [x] 22. Criar cadastro e edição de projeto
- [x] 23. Criar o slide de apresentação do Marco 3

### Marco 4 - Busca, filtros e quadro
- [x] 24. Implementar a busca por título
- [x] 25. Implementar os filtros por status e prioridade
- [x] 26. Centralizar o estado de busca e filtros
- [x] 27. Criar a visão de quadro
- [x] 28. Alternar entre lista e quadro
- [x] 29. Mudar o status pelo cartão
- [x] 30. Criar o slide de apresentação do Marco 4

### Marco 5 - Exclusão, erros e estados da tela *(Próximo)*
- [ ] 31. Excluir tarefa com confirmação
- [ ] 32. Mostrar o estado de carregando
- [ ] 33. Mostrar o estado de erro
- [ ] 34. Mostrar o estado vazio
- [ ] 35. Tratar tarefa ou projeto inexistente
- [ ] 36. Tratar falha ao salvar e ao excluir
- [ ] 37. Auditar acessibilidade e responsividade
- [ ] 38. Criar o slide de apresentação do Marco 5
