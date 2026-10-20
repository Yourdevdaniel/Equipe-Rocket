import { Routes } from '@angular/router';
import { QuadroKambam } from './components/quadro-kambam/quadro-kambam';
import { ListaProjetos } from './components/lista-projetos/lista-projetos';
import { ListaTarefas } from './components/lista-tarefas/lista-tarefas';
import { PaginaNaoEncontrada } from './components/pagina-nao-encontrada/pagina-nao-encontrada';
import { EditarTarefa } from './components/editar-tarefa/editar-tarefa';
import { DetalheProjeto } from './components/detalhe-projeto/detalhe-projeto';
import { CriarTarefa } from './components/criar-tarefa/criar-tarefa';
import { CriarProjeto } from './components/criar-projeto/criar-projeto';
import { EditarProjeto } from './components/editar-projeto/editar-projeto';

export const routes: Routes = [
  { path: '', redirectTo: 'projetos', pathMatch: 'full' },
  { path: 'tarefas/nova', component: CriarTarefa },
  { path: 'tarefas/:id', component: ListaTarefas },
  { path: 'tarefas', component: ListaTarefas },
  { path: 'projetos', component: ListaProjetos },
  // As rotas fixas ("novo", "editar") vêm antes das que têm parâmetro: o roteador usa a primeira que casar.
  { path: 'projetos/novo', component: CriarProjeto },
  { path: 'projetos/:id', component: DetalheProjeto },
  { path: 'projetos/:id/editar', component: EditarProjeto },
  { path: 'projetos/:id/:nome', component: QuadroKambam },
  { path: 'tarefas/:id/editar', component: EditarTarefa },
  { path: '**', component: PaginaNaoEncontrada },
];
