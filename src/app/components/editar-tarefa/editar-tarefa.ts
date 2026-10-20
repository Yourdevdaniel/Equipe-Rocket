import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProjetosService } from '../../services/projetos';
import { Projeto, Tarefa } from '../../models';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  imports: [RouterLink, ReactiveFormsModule],
  selector: 'app-editar-tarefa',
  styleUrl: './editar-tarefa.css',
  templateUrl: './editar-tarefa.html',
})
export class EditarTarefa implements OnInit {
  private route = inject(ActivatedRoute);
  private readonly projetosService = inject(ProjetosService);

  readonly tarefa = signal<Tarefa | null>(null);
  readonly projetos = signal<Projeto[]>([]);
  readonly idParam = signal<string | null>(null);
  readonly estaSalvo = signal(false);

  readonly form = new FormGroup({
    titulo: new FormControl('', { nonNullable: true }),
    descricao: new FormControl('', { nonNullable: true }),
    projetoId: new FormControl('', { nonNullable: true }),
    responsavel: new FormControl('', { nonNullable: true }),
    prazo: new FormControl('', { nonNullable: true }),
    status: new FormControl<Tarefa['status']>('a-fazer', { nonNullable: true }),
    prioridade: new FormControl<Tarefa['prioridade']>('media', { nonNullable: true }),
  });

  ngOnInit(): void {
    this.projetosService.listarProjetos().subscribe({
      next: (listaProjetos) => {
        this.projetos.set(listaProjetos);
      },
    });

    const id = this.route.snapshot.paramMap.get('id');
    this.idParam.set(id);
    if (!id) {
      return;
    }

    this.projetosService.buscarTarefa(id).subscribe({
      next: (tarefaQueChegou) => {
        this.tarefa.set(tarefaQueChegou);
        this.form.patchValue(tarefaQueChegou);
      },
    });
  }

  salvar(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }

    const alteracoes = this.form.getRawValue();

    this.projetosService.editarTarefa(id, alteracoes).subscribe({
      next: (tarefaAlterada) => {
        this.tarefa.set(tarefaAlterada);
        this.estaSalvo.set(true);
      },
    });
  }
}
