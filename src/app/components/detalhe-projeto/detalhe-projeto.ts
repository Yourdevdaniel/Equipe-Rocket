import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProjetosService } from '../../services/projetos';
import { ProjetoComTarefas, Tarefa } from '../../models';
import { TarefaCard } from '../tarefa-card/tarefa-card';

@Component({
  selector: 'app-detalhe-projeto',
  standalone: true,
  imports: [TarefaCard, RouterLink, DatePipe],
  templateUrl: './detalhe-projeto.html',
  styleUrl: './detalhe-projeto.css',
})
export class DetalheProjeto implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly projetosService = inject(ProjetosService);

  readonly projeto = signal<ProjetoComTarefas | null>(null);
  readonly tarefas = signal<Tarefa[]>([]);
  readonly carregando = signal(true);
  readonly erro = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.carregarProjeto(id);
    } else {
      this.erro.set('ID do projeto não informado.');
      this.carregando.set(false);
    }
  }

  carregarProjeto(id: string): void {
    this.carregando.set(true);
    this.erro.set(null);

    this.projetosService.buscarProjeto(id).subscribe({
      next: (dadosProjeto) => {
        this.projeto.set(dadosProjeto);

        if (dadosProjeto.tarefas && dadosProjeto.tarefas.length > 0) {
          this.tarefas.set(dadosProjeto.tarefas);
          this.carregando.set(false);
        } else {
          // Fallback: filtra no frontend caso o json-server não embuta ids em texto
          this.projetosService.listarTarefas().subscribe({
            next: (todasTarefas) => {
              this.tarefas.set(todasTarefas.filter((t) => String(t.projetoId) === String(id)));
              this.carregando.set(false);
            },
            error: () => {
              this.tarefas.set([]);
              this.carregando.set(false);
            },
          });
        }
      },
      error: (err) => {
        console.error('Erro ao buscar projeto:', err);
        this.erro.set('Não foi possível carregar os dados do projeto.');
        this.carregando.set(false);
      },
    });
  }
}
