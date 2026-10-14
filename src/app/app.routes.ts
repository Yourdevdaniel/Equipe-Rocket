import { Routes } from '@angular/router';
import { QuadroKambam } from './components/quadro-kambam/quadro-kambam';
import { ListaProjetos } from './components/lista-projetos/lista-projetos';
import { ListaTarefas } from './components/lista-tarefas/lista-tarefas';
import { PaginaNaoEncontrada } from './components/pagina-nao-encontrada/pagina-nao-encontrada';

export const routes: Routes = [
  { path: '', redirectTo: 'projetos', pathMatch: 'full' },
  { path: 'tarefas/:id', component: ListaTarefas },
  { path: 'tarefas', component: ListaTarefas },
  { path: 'projetos', component: ListaProjetos },
  { path: 'projetos/:id', component: QuadroKambam },
  { path: '**', component: PaginaNaoEncontrada },
];
