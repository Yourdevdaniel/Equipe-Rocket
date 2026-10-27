import { Component, HostListener, inject, input, output, signal } from '@angular/core';
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
  // Avisa o pai com a tarefa salva, para ele trocar na lista (no quadro, o cartão muda de coluna).
  readonly statusAlterado = output<Tarefa>();
  readonly expandido = signal(false);
  readonly nomeProjeto = signal<string | null>(null);
  readonly salvandoStatus = signal(false);
  readonly erroStatus = signal(false);

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

  readonly opcoesStatus = Object.keys(this.rotuloStatus) as Tarefa['status'][];

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

  mudarStatus(select: HTMLSelectElement): void {
    const status = select.value as Tarefa['status'];
    if (!this.projetosService || status === this.tarefa().status) return;

    this.salvandoStatus.set(true);
    this.erroStatus.set(false);
    this.projetosService.editarTarefa(this.tarefa().id, { status }).subscribe({
      next: (tarefaSalva) => {
        this.salvandoStatus.set(false);
        this.statusAlterado.emit(tarefaSalva);
      },
      error: (err) => {
        console.error('Erro ao alterar status:', err);
        // Volta o seletor para o status que continua gravado na API.
        select.value = this.tarefa().status;
        this.salvandoStatus.set(false);
        this.erroStatus.set(true);
      },
    });
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
