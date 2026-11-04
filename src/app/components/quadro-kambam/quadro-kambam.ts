import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProjetosService } from '../../services/projetos';
import { FiltrosService } from '../../services/filtros';
import { HistoricoDeNavegacao } from '../../services/historico-de-navegacao';
import { Projeto, Tarefa } from '../../models';
import { TarefaCard } from '../tarefa-card/tarefa-card';
import { EstadoVazio } from '../estado-vazio/estado-vazio';
import { mensagemDeErro } from '../../utils/erro-api';

@Component({
  imports: [TarefaCard, RouterLink, EstadoVazio],
  standalone: true,
  selector: 'app-quadro-kambam',
  styleUrl: './quadro-kambam.css',
  templateUrl: './quadro-kambam.html',
})
export class QuadroKambam implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly projetosService = inject(ProjetosService);
  private readonly filtros = inject(FiltrosService);
  private readonly historicoDeNavegacao = inject(HistoricoDeNavegacao);

  readonly projetoId = signal<string | null>(null);
  readonly projeto = signal<Projeto | null>(null);

  readonly tarefas = signal<Tarefa[]>([]);
  readonly carregando = signal(true);
  readonly naoEncontrado = signal(false);
  readonly erro = signal<string | null>(null);

  // Busca e filtros vêm do FiltrosService, compartilhado com a lista.
  readonly termoBusca = this.filtros.busca;
  readonly filtroStatus = this.filtros.status;
  readonly filtroPrioridade = this.filtros.prioridade;
  readonly temFiltrosAtivos = this.filtros.temFiltrosAtivos;

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

  ngOnInit(): void {
    // Captura o parâmetro da URL assim que o componente carrega
    const id = this.route.snapshot.paramMap.get('id');
    this.projetoId.set(id);

    // Carrega as tarefas filtrando por esse ID
    this.carregarTarefas(id);
  }

  // Lista geral de tarefas filtradas pelo campo de pesquisa e filtros
  readonly tarefasFiltradas = computed(() => this.filtros.filtrar(this.tarefas()));

  // Computados individuais para alimentar cada coluna do Kanban
  readonly tarefasAFazer = computed(() =>
    this.tarefasFiltradas().filter((t) => t.status === 'a-fazer')
  );

  readonly tarefasEmAndamento = computed(() =>
    this.tarefasFiltradas().filter((t) => t.status === 'em-andamento')
  );

  readonly tarefasEmRevisao = computed(() =>
    this.tarefasFiltradas().filter((t) => t.status === 'em-revisao')
  );

  readonly tarefasConcluidas = computed(() =>
    this.tarefasFiltradas().filter((t) => t.status === 'concluida')
  );

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

  removerTarefaDaLista(idTarefa: string): void {
    this.tarefas.update((l) => l.filter((t) => t.id !== idTarefa));
  }

  carregarTarefas(idProjeto?: string | null): void {
    this.carregando.set(true);
    this.erro.set(null);
    this.naoEncontrado.set(false);

    if (idProjeto) {
      this.projetosService.buscarProjeto(idProjeto).subscribe({
        next: (projeto) => {
          if (!projeto || !projeto.id) {
            this.projeto.set(null);
            this.tarefas.set([]);
            this.naoEncontrado.set(true);
            this.carregando.set(false);
            return;
          }
          this.projeto.set(projeto);
          if (projeto.tarefas && projeto.tarefas.length > 0) {
            this.tarefas.set(projeto.tarefas);
            this.carregando.set(false);
          } else {
            this.projetosService.listarTarefas().subscribe({
              next: (dados) => {
                this.tarefas.set(dados.filter((t) => String(t.projetoId) === String(idProjeto)));
                this.carregando.set(false);
              },
              error: (err: unknown) => {
                console.error('Erro ao carregar tarefas do projeto:', err);
                this.erro.set(mensagemDeErro(err, 'as tarefas do projeto'));
                this.carregando.set(false);
              },
            });
          }
        },
        error: (err: unknown) => {
          if (err instanceof HttpErrorResponse && err.status === 404) {
            this.projeto.set(null);
            this.tarefas.set([]);
            this.naoEncontrado.set(true);
          } else {
            console.error('Erro ao carregar quadro Kanban:', err);
            this.erro.set(mensagemDeErro(err, 'as tarefas do quadro'));
          }
          this.carregando.set(false);
        },
      });
    } else {
      this.projeto.set(null);
      this.projetosService.listarTarefas().subscribe({
        next: (dados) => {
          this.tarefas.set(dados);
          this.carregando.set(false);
        },
        error: (err: unknown) => {
          console.error('Erro ao carregar quadro Kanban:', err);
          this.erro.set(mensagemDeErro(err, 'as tarefas do quadro'));
          this.carregando.set(false);
        },
      });
    }
  }

  voltar(): void {
    this.historicoDeNavegacao.voltar('/projetos');
  }
}
