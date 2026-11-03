import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProjetosService } from '../../services/projetos';
import { ProjetoComTarefas, Tarefa } from '../../models';
import { TarefaCard } from '../tarefa-card/tarefa-card';
import { gerarSlug } from '../../utils/slug';
import { EstadoVazio } from '../estado-vazio/estado-vazio';
import { mensagemDeErro } from '../../utils/erro-api';

@Component({
  selector: 'app-detalhe-projeto',
  standalone: true,
  imports: [TarefaCard, RouterLink, DatePipe, EstadoVazio],
  templateUrl: './detalhe-projeto.html',
  styleUrl: './detalhe-projeto.css',
})
export class DetalheProjeto implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly projetosService = inject(ProjetosService);

  readonly gerarSlug = gerarSlug;
  readonly idParam = signal<string | null>(null);
  readonly projeto = signal<ProjetoComTarefas | null>(null);
  readonly tarefas = signal<Tarefa[]>([]);
  readonly carregando = signal(true);
  readonly naoEncontrado = signal(false);
  readonly erro = signal<string | null>(null);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.idParam.set(id);
      if (id) {
        this.carregarProjeto(id);
      } else {
        this.naoEncontrado.set(true);
        this.carregando.set(false);
      }
    });
  }

  carregarProjeto(id: string): void {
    this.carregando.set(true);
    this.erro.set(null);
    this.naoEncontrado.set(false);

    this.projetosService.buscarProjeto(id).subscribe({
      next: (dadosProjeto) => {
        if (!dadosProjeto || !dadosProjeto.id) {
          this.projeto.set(null);
          this.naoEncontrado.set(true);
          this.carregando.set(false);
          return;
        }

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
            // Sem isto a falha viraria "Este projeto ainda não tem tarefas", que é mentira:
            // as tarefas existem, só não deu para buscá-las.
            error: (err: unknown) => {
              console.error('Erro ao buscar tarefas do projeto:', err);
              this.erro.set(mensagemDeErro(err, 'as tarefas do projeto'));
              this.carregando.set(false);
            },
          });
        }
      },
      error: (err: unknown) => {
        if (err instanceof HttpErrorResponse && err.status === 404) {
          this.projeto.set(null);
          this.naoEncontrado.set(true);
        } else {
          console.error('Erro ao buscar projeto:', err);
          this.erro.set(mensagemDeErro(err, 'os dados do projeto'));
        }
        this.carregando.set(false);
      },
    });
  }

  substituirTarefa(tarefaSalva: Tarefa): void {
    this.tarefas.update((lista) => lista.map((t) => (t.id === tarefaSalva.id ? tarefaSalva : t)));
  }
}
