import { Component, HostListener, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Tarefa } from '../../models';
import { ProjetosService } from '../../services/projetos';

@Component({
  selector: 'app-tarefa-card',
  imports: [DatePipe, RouterLink],
  templateUrl: './tarefa-card.html',
  styleUrl: './tarefa-card.css',
})
export class TarefaCard {
  private readonly projetosService = inject(ProjetosService, { optional: true });

  tarefa = input.required<Tarefa>();
  readonly expandido = signal(false);
  readonly nomeProjeto = signal<string | null>(null);

  readonly rotuloStatus: Record<Tarefa['status'], string> = {
    'a-fazer': 'A Fazer',
    'em-andamento': 'Em Andamento',
    'em-revisao': 'Em Revisão',
    'concluida': 'Concluído',
  };

  readonly rotuloPrioridade: Record<Tarefa['prioridade'], string> = {
    alta: 'Alta',
    media: 'Média',
    baixa: 'Baixa',
  };

  abrirDetalhes(): void {
    this.expandido.set(true);
    const idProjeto = this.tarefa().projetoId;
    if (this.projetosService && idProjeto) {
      this.projetosService.buscarProjeto(idProjeto).subscribe({
        next: (proj) => this.nomeProjeto.set(proj.nome),
        error: () => this.nomeProjeto.set(null),
      });
    }
  }

  fecharDetalhes(event?: Event): void {
    event?.stopPropagation();
    this.expandido.set(false);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.expandido()) {
      this.expandido.set(false);
    }
  }
}
