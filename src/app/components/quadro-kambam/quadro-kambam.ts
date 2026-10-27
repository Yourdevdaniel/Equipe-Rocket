import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProjetosService } from '../../services/projetos';
import { FiltrosService } from '../../services/filtros';
import { Tarefa } from '../../models';
import { TarefaCard } from '../tarefa-card/tarefa-card';
import { BarraFiltros } from '../barra-filtros/barra-filtros';

@Component({
  imports: [RouterLink, TarefaCard, BarraFiltros],
  standalone: true,
  selector: 'app-quadro-kambam',
  styleUrl:'./quadro-kambam.css',
  templateUrl: './quadro-kambam.html'
})

export class QuadroKambam implements OnInit {
  private route = inject(ActivatedRoute);
  private projetosService = inject(ProjetosService);
  private filtros = inject(FiltrosService);

  // Em /projetos/:id/:nome o quadro mostra só o projeto; em /quadro mostra todas as tarefas.
  id = this.route.snapshot.paramMap.get('id');
  nome = this.route.snapshot.paramMap.get('nome');

  readonly colunas: { status: Tarefa['status']; titulo: string; classe: string }[] = [
    { status: 'a-fazer', titulo: 'A Fazer', classe: 'status-todo' },
    { status: 'em-andamento', titulo: 'Em Andamento', classe: 'status-in-progress' },
    { status: 'em-revisao', titulo: 'Em Revisão', classe: 'status-review' },
    { status: 'concluida', titulo: 'Concluído', classe: 'status-done' },
  ];

  readonly tarefas = signal<Tarefa[]>([]);
  readonly carregando = signal(true);
  readonly erro = signal<string | null>(null);

  readonly tarefasPorStatus = computed(() => {
    const visiveis = this.filtros.filtrar(this.tarefas());
    return Object.fromEntries(
      this.colunas.map((c) => [c.status, visiveis.filter((t) => t.status === c.status)]),
    ) as Record<Tarefa['status'], Tarefa[]>;
  });

  ngOnInit(): void {
    this.carregarTarefas();
  }

  carregarTarefas(): void {
    this.carregando.set(true);
    this.erro.set(null);
    this.projetosService.listarTarefas().subscribe({
      next: (dados) => {
        this.tarefas.set(this.id ? dados.filter((t) => String(t.projetoId) === String(this.id)) : dados);
        this.carregando.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar tarefas:', err);
        this.erro.set('Não foi possível carregar as tarefas da API.');
        this.carregando.set(false);
      },
    });
  }

  substituirTarefa(tarefaSalva: Tarefa): void {
    this.tarefas.update((lista) => lista.map((t) => (t.id === tarefaSalva.id ? tarefaSalva : t)));
  }
}
