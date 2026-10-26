import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProjetosService } from '../../services/projetos';
import { Tarefa } from '../../models';
import { TarefaCard } from '../tarefa-card/tarefa-card';

@Component({
  selector: 'app-lista-tarefas',
  standalone: true,
  imports: [TarefaCard, RouterLink],
  templateUrl: './lista-tarefas.html',
  styleUrl: './lista-tarefas.css',
})
export class ListaTarefas implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly projetosService = inject(ProjetosService);

  readonly tarefas = signal<Tarefa[]>([]);
  readonly carregando = signal(true);
  readonly erro = signal<string | null>(null);
  readonly idParam = signal<string | null>(null);
  readonly termoBusca = signal('');
  readonly filtroStatus = signal<Tarefa['status'] | ''>('');
  readonly filtroPrioridade = signal<Tarefa['prioridade'] | ''>('');

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

  readonly temFiltrosAtivos = computed(() =>
    Boolean(this.termoBusca().trim() || this.filtroStatus() || this.filtroPrioridade())
  );

  readonly tarefasFiltradas = computed(() => {
    const termo = this.normalizarTexto(this.termoBusca());
    const status = this.filtroStatus();
    const prioridade = this.filtroPrioridade();

    return this.tarefas().filter((tarefa) => {
      const correspondeTitulo = !termo || this.normalizarTexto(tarefa.titulo).includes(termo);
      const correspondeStatus = !status || tarefa.status === status;
      const correspondePrioridade = !prioridade || tarefa.prioridade === prioridade;
      return correspondeTitulo && correspondeStatus && correspondePrioridade;
    });
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.idParam.set(id);
    this.carregarTarefas(id);
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
    this.termoBusca.set('');
    this.filtroStatus.set('');
    this.filtroPrioridade.set('');
  }

  private normalizarTexto(texto: string): string {
    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  carregarTarefas(id?: string | null): void {
    this.carregando.set(true);
    this.erro.set(null);

    if (id) {
      this.projetosService.buscarTarefa(id).subscribe({
        next: (tarefa) => {
          this.tarefas.set(tarefa ? [tarefa] : []);
          this.carregando.set(false);
        },
        error: () => {
          // Caso o id informado na URL seja um projetoId, busca as tarefas correspondentes
          this.projetosService.listarTarefas().subscribe({
            next: (dados) => {
              const porProjeto = dados.filter((t) => t.projetoId === id);
              this.tarefas.set(porProjeto.length > 0 ? porProjeto : dados);
              this.carregando.set(false);
            },
            error: (err) => {
              console.error('Erro ao carregar tarefas:', err);
              this.erro.set('Não foi possível carregar as tarefas da API.');
              this.carregando.set(false);
            },
          });
        },
      });
    } else {
      this.projetosService.listarTarefas().subscribe({
        next: (dados) => {
          this.tarefas.set(dados);
          this.carregando.set(false);
        },
        error: (err) => {
          console.error('Erro ao carregar tarefas:', err);
          this.erro.set('Não foi possível carregar as tarefas da API.');
          this.carregando.set(false);
        },
      });
    }
  }
}
