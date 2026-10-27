import { computed, Injectable, signal } from '@angular/core';
import { Tarefa } from '../models';

// Estado único de busca e filtros. Como o serviço é root, a lista e o quadro leem os mesmos signals
// e os filtros continuam aplicados ao trocar de visão. Valor '' = sem filtro.
@Injectable({ providedIn: 'root' })
export class FiltrosService {
  readonly busca = signal('');
  readonly status = signal<Tarefa['status'] | ''>('');
  readonly prioridade = signal<Tarefa['prioridade'] | ''>('');

  readonly temFiltrosAtivos = computed(() =>
    Boolean(this.busca().trim() || this.status() || this.prioridade())
  );

  filtrar(tarefas: Tarefa[]): Tarefa[] {
    const termo = normalizarTexto(this.busca());
    const status = this.status();
    const prioridade = this.prioridade();

    return tarefas.filter((tarefa) => {
      const correspondeTitulo = !termo || normalizarTexto(tarefa.titulo).includes(termo);
      const correspondeStatus = !status || tarefa.status === status;
      const correspondePrioridade = !prioridade || tarefa.prioridade === prioridade;
      return correspondeTitulo && correspondeStatus && correspondePrioridade;
    });
  }

  limpar(): void {
    this.busca.set('');
    this.status.set('');
    this.prioridade.set('');
  }
}

// Ignora acentos, maiúsculas/minúsculas e espaços nas pontas.
function normalizarTexto(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}
