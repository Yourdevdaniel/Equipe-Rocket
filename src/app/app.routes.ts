import { Routes } from '@angular/router';
import {QuadroKambam} from './components/quadro-kambam/quadro-kambam';
import {ListaProjetos} from './components/lista-projetos/lista-projetos';

export const routes: Routes = [
  {
    path: 'kambam',
    component: QuadroKambam
  },

  {
    path: '',
    component: ListaProjetos
  }
];
