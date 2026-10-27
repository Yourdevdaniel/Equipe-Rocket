import { Injectable, signal } from '@angular/core';
import { Tarefa } from '../models';

// Estado único de busca e filtros. Como o serviço é root, a lista e o quadro leem os mesmos signals
// e os filtros continuam aplicados ao trocar de visão.
@Injectable({ providedIn: 'root' })
export class FiltrosService {
  readonly busca = signal('');
  readonly status = signal<Tarefa['status'] | 'todos'>('todos');
  readonly prioridade = signal<Tarefa['prioridade'] | 'todas'>('todas');

  filtrar(tarefas: Tarefa[]): Tarefa[] {
    const termo = this.busca().trim().toLowerCase();
    const status = this.status();
    const prioridade = this.prioridade();
    return tarefas.filter(
      (t) =>
        t.titulo.toLowerCase().includes(termo) &&
        (status === 'todos' || t.status === status) &&
        (prioridade === 'todas' || t.prioridade === prioridade),
    );
  }

  limpar(): void {
    this.busca.set('');
    this.status.set('todos');
    this.prioridade.set('todas');
  }
}
