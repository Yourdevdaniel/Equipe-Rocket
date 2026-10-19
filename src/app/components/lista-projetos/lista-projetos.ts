import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProjetosService } from '../../services/projetos';
import { Projeto } from '../../models';
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

  ngOnInit(): void {
    this.projetosService.listarProjetos().subscribe({
      next: (dados) => this.projetos.set(dados),
      error: (err) => console.error('Erro ao carregar projetos:', err),
    });
  }
}
