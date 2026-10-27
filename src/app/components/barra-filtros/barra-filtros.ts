import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FiltrosService } from '../../services/filtros';
import { Tarefa } from '../../models';

@Component({
  selector: 'app-barra-filtros',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './barra-filtros.html',
  styleUrl: './barra-filtros.css',
})
export class BarraFiltros {
  readonly filtros = inject(FiltrosService);

  definirStatus(valor: string): void {
    this.filtros.status.set(valor as Tarefa['status'] | 'todos');
  }

  definirPrioridade(valor: string): void {
    this.filtros.prioridade.set(valor as Tarefa['prioridade'] | 'todas');
  }
}
