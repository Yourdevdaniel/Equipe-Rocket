import { Routes } from '@angular/router';
import {QuadroKambam} from './components/quadro-kambam/quadro-kambam';
import {ListaProjetos} from './components/lista-projetos/lista-projetos';

export const routes: Routes = [
  { path: '', redirectTo: 'projetos', pathMatch: 'full' },
  { path: 'projetos', component: ListaProjetos },
  { path: 'projetos/:id', component: QuadroKambam },
  { path: '**', redirectTo: 'projetos' },
];
