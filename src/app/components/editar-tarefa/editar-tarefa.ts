import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProjetosService } from '../../services/projetos';
import { Projeto, Tarefa } from '../../models';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { focarPrimeiroInvalido } from '../../utils/form';

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
  readonly erro = signal<string | null>(null);

  readonly form = new FormGroup({
    titulo: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    descricao: new FormControl('', { nonNullable: true }),
    projetoId: new FormControl('', { nonNullable: true, validators: Validators.required }),
    responsavel: new FormControl('', { nonNullable: true, validators: Validators.required }),
    prazo: new FormControl('', { nonNullable: true, validators: Validators.required }),
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

  campoInvalido(nomeCampo: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[nomeCampo];
    return control.invalid && (control.touched || control.dirty);
  }

  salvar(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }

    this.estaSalvo.set(false);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.erro.set('Há campos com erro. Corrija-os e tente novamente.');
      focarPrimeiroInvalido(this.form);
      return;
    }
    this.erro.set(null);

    const alteracoes = this.form.getRawValue();

    this.projetosService.editarTarefa(id, alteracoes).subscribe({
      next: (tarefaAlterada) => {
        this.tarefa.set(tarefaAlterada);
        this.estaSalvo.set(true);
      },
      error: () => {
        this.erro.set('Erro ao salvar no servidor. Tente novamente.');
      },
    });
  }
}
