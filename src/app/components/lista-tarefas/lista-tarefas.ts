import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProjetosService } from '../../services/projetos';
import { FiltrosService } from '../../services/filtros';
import { Tarefa } from '../../models';
import { TarefaCard } from '../tarefa-card/tarefa-card';
import { EstadoVazio } from '../estado-vazio/estado-vazio';
import { mensagemDeErro } from '../../utils/erro-api';

@Component({
  selector: 'app-lista-tarefas',
  standalone: true,
  imports: [TarefaCard, RouterLink, EstadoVazio],
  templateUrl: './lista-tarefas.html',
  styleUrl: './lista-tarefas.css',
})
export class ListaTarefas implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly projetosService = inject(ProjetosService);
  private readonly filtros = inject(FiltrosService);

  readonly tarefas = signal<Tarefa[]>([]);
  readonly carregando = signal(true);
  readonly erro = signal<string | null>(null);
  readonly naoEncontrado = signal(false);
  readonly idParam = signal<string | null>(null);
  // Busca e filtros vêm do FiltrosService, compartilhado com o quadro.
  readonly termoBusca = this.filtros.busca;
  readonly filtroStatus = this.filtros.status;
  readonly filtroPrioridade = this.filtros.prioridade;

  readonly opcoesStatus: { value: Tarefa['status']; label: string }[] = [
    { value: 'a-fazer', label: 'A Fazer' },
    { value: 'em-andamento', label: 'Em Andamento' },
    { value: 'em-revisao', label: 'Em Revisão' },
    { value: 'concluida', label: 'Concluída' },
  ];

  readonly opcoesPrioridade: { value: Tarefa['prioridade']; label: string }[] = [
    { value: 'alta', label: 'Alta' },
    { value: 'media', label: 'Média' },
    { value: 'baixa', label: 'Baixa' },
  ];

  readonly temFiltrosAtivos = this.filtros.temFiltrosAtivos;

  readonly tarefasFiltradas = computed(() => this.filtros.filtrar(this.tarefas()));

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.idParam.set(id);
      this.carregarTarefas(id);
    });
  }

  atualizarBusca(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    this.termoBusca.set(input.value);
  }

  atualizarFiltroStatus(evento: Event): void {
    const select = evento.target as HTMLSelectElement;
    this.filtroStatus.set(select.value as Tarefa['status'] | '');
  }

  atualizarFiltroPrioridade(evento: Event): void {
    const select = evento.target as HTMLSelectElement;
    this.filtroPrioridade.set(select.value as Tarefa['prioridade'] | '');
  }

  limparBusca(): void {
    this.termoBusca.set('');
  }

  limparFiltros(): void {
    this.filtros.limpar();
  }

  substituirTarefa(tarefaSalva: Tarefa): void {
    this.tarefas.update((lista) => lista.map((t) => (t.id === tarefaSalva.id ? tarefaSalva : t)));
  }

  carregarTarefas(id?: string | null): void {
    this.carregando.set(true);
    this.erro.set(null);
    this.naoEncontrado.set(false);

    if (id) {
      this.projetosService.buscarTarefa(id).subscribe({
        next: (tarefa) => {
          if (tarefa && tarefa.id) {
            this.tarefas.set([tarefa]);
            this.naoEncontrado.set(false);
          } else {
            this.tarefas.set([]);
            this.naoEncontrado.set(true);
          }
          this.carregando.set(false);
        },
        error: (err: unknown) => {
          if (err instanceof HttpErrorResponse && err.status === 404) {
            this.tarefas.set([]);
            this.naoEncontrado.set(true);
          } else {
            console.error('Erro ao carregar tarefa:', err);
            this.erro.set(mensagemDeErro(err, 'a tarefa'));
          }
          this.carregando.set(false);
        },
      });
    } else {
      this.projetosService.listarTarefas().subscribe({
        next: (dados) => {
          this.tarefas.set(dados);
          this.carregando.set(false);
        },
        error: (err: unknown) => {
          console.error('Erro ao carregar tarefas:', err);
          this.erro.set(mensagemDeErro(err, 'as tarefas'));
          this.carregando.set(false);
        },
      });
    }
  }
}
