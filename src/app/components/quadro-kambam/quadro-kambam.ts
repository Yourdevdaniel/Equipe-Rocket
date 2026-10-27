import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProjetosService } from '../../services/projetos';
import { FiltrosService } from '../../services/filtros';
import { Tarefa } from '../../models';
import { TarefaCard } from '../tarefa-card/tarefa-card';



@Component({
  imports: [TarefaCard, RouterLink],
  standalone: true,
  selector: 'app-quadro-kambam',
  styleUrl:'./quadro-kambam.css',
  templateUrl: './quadro-kambam.html'
})

export class QuadroKambam implements OnInit{
  private readonly route = inject(ActivatedRoute);
  private readonly projetosService = inject(ProjetosService);
  private readonly filtros = inject(FiltrosService);

  readonly projetoId = signal<string | null>(null);

  readonly tarefas = signal<Tarefa[]>([]);
  readonly carregando = signal(true);
  readonly erro = signal<string | null>(null);
  // Busca e filtros vêm do FiltrosService, compartilhado com a lista.
  readonly termoBusca = this.filtros.busca;
  readonly temFiltrosAtivos = this.filtros.temFiltrosAtivos;

  ngOnInit(): void {
      // 4. Captura o parâmetro da URL assim que o componente carrega
      const id = this.route.snapshot.paramMap.get('id');
      this.projetoId.set(id);

      // 5. Carrega as tarefas filtrando por esse ID
      this.carregarTarefas(id);
    }

  // Lista geral de tarefas filtradas pelo campo de pesquisa
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

  limparFiltros(): void {
    this.filtros.limpar();
  }

  substituirTarefa(tarefaSalva: Tarefa): void {
    this.tarefas.update((lista) => lista.map((t) => (t.id === tarefaSalva.id ? tarefaSalva : t)));
  }

 carregarTarefas(idProjeto?: string | null): void {
    this.carregando.set(true);
    this.erro.set(null);

    this.projetosService.listarTarefas().subscribe({
      next: (dados) => {
        // Filtra para manter no Kanban apenas as tarefas vinculadas a este projeto
        const tarefasDoProjeto = idProjeto
          ? dados.filter((t) => t.projetoId === idProjeto)
          : dados;

        this.tarefas.set(tarefasDoProjeto);
        this.carregando.set(false);
      },
      error: (err: unknown) => {
        console.error('Erro ao carregar quadro Kanban:', err);
        this.erro.set('Não foi possível carregar as tarefas do projeto.');
        this.carregando.set(false);
      },
    });
  }


}
