import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjetosService } from '../../services/projetos';
import { focarPrimeiroInvalido } from '../../utils/form';

@Component({
  selector: 'app-criar-projeto',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './criar-projeto.html',
  styleUrl: './criar-projeto.css',
})
export class CriarProjeto {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly projetosService = inject(ProjetosService);

  readonly enviando = signal(false);
  readonly erro = signal<string | null>(null);

  readonly formProjeto = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    disciplina: ['', Validators.required],
    descricao: [''],
  });

  campoInvalido(nomeCampo: keyof typeof this.formProjeto.controls): boolean {
    const control = this.formProjeto.controls[nomeCampo];
    return control.invalid && (control.touched || control.dirty);
  }

  salvarProjeto(): void {
    if (this.formProjeto.invalid) {
      this.formProjeto.markAllAsTouched();
      this.erro.set('Há campos com erro. Corrija-os e tente novamente.');
      focarPrimeiroInvalido(this.formProjeto);
      return;
    }

    this.enviando.set(true);
    this.erro.set(null);

    const payload = {
      ...this.formProjeto.getRawValue(),
      criadoEm: new Date().toISOString().slice(0, 10),
    };

    this.projetosService.criarProjetoComIdSequencial(payload).subscribe({
      next: () => {
        this.enviando.set(false);
        this.router.navigate(['/projetos']);
      },
      error: (err: unknown) => {
        console.error('Erro ao salvar projeto:', err);
        this.erro.set('Erro ao salvar no servidor. Tente novamente.');
        this.enviando.set(false);
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/projetos']);
  }
}
