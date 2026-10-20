import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjetosService } from '../../services/projetos';
import { focarPrimeiroInvalido } from '../../utils/form';

@Component({
  imports: [RouterLink, ReactiveFormsModule],
  selector: 'app-editar-projeto',
  styleUrl: './editar-projeto.css',
  templateUrl: './editar-projeto.html',
})
export class EditarProjeto implements OnInit {
  private route = inject(ActivatedRoute);
  private readonly projetosService = inject(ProjetosService);

  readonly idParam = signal<string | null>(null);
  readonly estaSalvo = signal(false);
  readonly erro = signal<string | null>(null);

  readonly form = new FormGroup({
    nome: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    disciplina: new FormControl('', { nonNullable: true, validators: Validators.required }),
    descricao: new FormControl('', { nonNullable: true }),
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.idParam.set(id);
    if (!id) {
      return;
    }

    this.projetosService.buscarProjeto(id).subscribe({
      next: (projeto) => this.form.patchValue(projeto),
      error: () => this.erro.set('Não foi possível carregar os dados do projeto.'),
    });
  }

  campoInvalido(nomeCampo: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[nomeCampo];
    return control.invalid && (control.touched || control.dirty);
  }

  salvar(): void {
    const id = this.idParam();
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

    this.projetosService.editarProjeto(id, this.form.getRawValue()).subscribe({
      next: () => this.estaSalvo.set(true),
      error: () => this.erro.set('Erro ao salvar no servidor. Tente novamente.'),
    });
  }
}
