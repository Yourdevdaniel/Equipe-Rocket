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

O app organiza tarefas por projeto e mostra em que pé cada uma está: a fazer, em andamento, em revisão ou concluída. O frontend é em Angular com TypeScript, e os dados ficam numa API local servida pelo `json-server` a partir do `db.json`.

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

## Contrato de dados

Todo mundo da equipe lê e grava os mesmos dados, então o formato de um projeto e de uma tarefa está fixado em dois arquivos que precisam concordar entre si:

| Arquivo | Onde fica | Para que serve |
| --- | --- | --- |
| `db.json` | raiz do projeto | Os dados. Cada chave (`projetos`, `tarefas`) vira uma rota da API. |
| `src/tipos.ts` | pasta `src/` | Os tipos. O editor acusa erro em qualquer dado fora do formato. |

O contrato é o mesmo para a turma inteira. Não renomeie campos nem acrescente valores de status; mudanças passam pela professora.

Alguns detalhes que parecem estranhos são de propósito:

- O `id` é texto (`"1"`), porque o `json-server` gera ids como texto.
- `prazo` e `criadoEm` são texto no formato `AAAA-MM-DD`, já que JSON não tem tipo data.
- `status` aceita `a-fazer`, `em-andamento`, `em-revisao` e `concluida`. `prioridade` aceita `baixa`, `media` e `alta`. Nenhum dos dois leva acento ou espaço.

Para usar os tipos num componente, importe sem a extensão `.ts`:

```ts
// src/app/app.ts
import type { Tarefa } from '../tipos'
```

## Endpoints da API

| Endereço | Retorna |
| --- | --- |
| `http://localhost:3000/tarefas` | as 5 tarefas |
| `http://localhost:3000/projetos` | os 2 projetos |
| `http://localhost:3000/projetos/1?_embed=tarefas` | o projeto 1 com as 4 tarefas dele |
| `http://localhost:3000/tarefas?status=a-fazer` | as 2 tarefas a fazer |

O `json-server` grava no `db.json`: cada `POST`, `PATCH` ou `DELETE` altera o arquivo. O `db.seed.json` guarda a cópia original. Para voltar ao começo:

```bash
cp db.seed.json db.json
```

Se a porta 3000 já estiver ocupada, suba a API em outra porta com `npx json-server db.json --port 3001`.

## Andamento do Marco 1

- [x] `db.json` na raiz e `db.seed.json` com a cópia intacta
- [x] `src/tipos.ts` com os tipos do contrato
- [x] `json-server` instalado como dependência de desenvolvimento
- [ ] Teste do contrato (erro `TS2322` no editor)
- [ ] Envio ao GitHub
