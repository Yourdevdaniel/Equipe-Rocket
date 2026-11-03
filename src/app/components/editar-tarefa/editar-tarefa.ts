import { Component, inject, signal, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProjetosService } from '../../services/projetos';
import { Projeto, Tarefa } from '../../models';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { focarPrimeiroInvalido } from '../../utils/form';
import { mensagemDeErro } from '../../utils/erro-api';

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
  readonly carregando = signal(true);
  readonly naoEncontrado = signal(false);
  readonly salvando = signal(false);
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
    const id = this.route.snapshot.paramMap.get('id');
    this.idParam.set(id);
    this.carregando.set(true);
    this.naoEncontrado.set(false);

    let projetosFinalizados = false;
    let tarefaFinalizada = !id;
    const atualizarCarregamento = () => this.carregando.set(!(projetosFinalizados && tarefaFinalizada));

    this.projetosService.listarProjetos().subscribe({
      next: (listaProjetos) => {
        this.projetos.set(listaProjetos);
        projetosFinalizados = true;
        atualizarCarregamento();
      },
      error: (err: unknown) => {
        this.erro.set(mensagemDeErro(err, 'a lista de projetos'));
        projetosFinalizados = true;
        atualizarCarregamento();
      },
    });

    if (!id) {
      return;
    }

    this.projetosService.buscarTarefa(id).subscribe({
      next: (tarefaQueChegou) => {
        if (!tarefaQueChegou || !tarefaQueChegou.id) {
          this.naoEncontrado.set(true);
        } else {
          this.tarefa.set(tarefaQueChegou);
          this.form.patchValue(tarefaQueChegou);
        }
        tarefaFinalizada = true;
        atualizarCarregamento();
      },
      error: (err: unknown) => {
        if (err instanceof HttpErrorResponse && err.status === 404) {
          this.naoEncontrado.set(true);
        } else {
          this.erro.set(mensagemDeErro(err, 'a tarefa'));
        }
        tarefaFinalizada = true;
        atualizarCarregamento();
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
    this.salvando.set(true);

    const alteracoes = this.form.getRawValue();

    this.projetosService.editarTarefa(id, alteracoes).subscribe({
      next: (tarefaAlterada) => {
        this.tarefa.set(tarefaAlterada);
        this.salvando.set(false);
        this.estaSalvo.set(true);
      },
      error: () => {
        this.salvando.set(false);
        this.erro.set('Erro ao salvar no servidor. Tente novamente.');
      },
    });
  }
}
