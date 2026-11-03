import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProjetosService } from '../../services/projetos';
import { Projeto } from '../../models';
import { mensagemDeErro } from '../../utils/erro-api';
import { gerarSlug } from '../../utils/slug';

@Component({
  imports: [RouterLink],
  standalone: true,
  selector: 'app-lista-projetos',
  styleUrl: './lista-projetos.css',
  templateUrl: './lista-projetos.html',
})
export class ListaProjetos implements OnInit {
  private readonly projetosService = inject(ProjetosService);

  readonly gerarSlug = gerarSlug;
  readonly projetos = signal<Projeto[]>([]);
  readonly carregando = signal(true);
  readonly erro = signal<string | null>(null);

  ngOnInit(): void {
    this.carregarProjetos();
  }

  carregarProjetos(): void {
    this.carregando.set(true);
    this.erro.set(null);

    this.projetosService.listarProjetos().subscribe({
      next: (dados) => {
        this.projetos.set(dados);
        this.carregando.set(false);
      },
      error: (err: unknown) => {
        console.error('Erro ao carregar projetos:', err);
        this.erro.set(mensagemDeErro(err, 'os projetos'));
        this.carregando.set(false);
      },
    });
  }
}
