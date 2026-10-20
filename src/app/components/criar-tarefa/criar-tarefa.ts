import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjetosService } from '../../services/projetos';
import { Projeto, Tarefa } from '../../models'; // Importação ajustada para ../../models

@Component({
  selector: 'app-criar-tarefa',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './criar-tarefa.html',
  styleUrl: './criar-tarefa.css',
})
export class CriarTarefa implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly projetosService = inject(ProjetosService);

  readonly projetos = signal<Projeto[]>([]);
  readonly carregando = signal(true);
  readonly enviando = signal(false);
  readonly erro = signal<string | null>(null);

  readonly listaStatus = [
    { value: 'a-fazer', label: 'A Fazer' },
    { value: 'em-andamento', label: 'Em Andamento' },
    { value: 'em-revisao', label: 'Em Revisão' },
    { value: 'concluida', label: 'Concluída' },
  ];

  readonly listaPrioridades = [
    { value: 'alta', label: 'Alta' },
    { value: 'media', label: 'Média' },
    { value: 'baixa', label: 'Baixa' },
  ];

  formTarefa!: FormGroup;

  ngOnInit(): void {
    this.carregarProjetos();
    this.inicializarFormulario();
  }

  private inicializarFormulario(): void {
    this.formTarefa = this.fb.group({
      projetoId: ['', Validators.required],
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      descricao: [''],
      status: ['a-fazer', Validators.required],
      prioridade: ['media', Validators.required],
      responsavel: ['', Validators.required],
      prazo: ['', Validators.required],
    });
  }

  carregarProjetos(): void {
    this.carregando.set(true);
    this.projetosService.listarProjetos().subscribe({
      next: (dados: Projeto[]) => {
        this.projetos.set(dados);
        this.carregando.set(false);
      },
      error: (err: unknown) => {
        console.error('Erro ao carregar projetos:', err);
        this.erro.set('Erro ao carregar a lista de projetos.');
        this.carregando.set(false);
      },
    });
  }

  campoInvalido(nomeCampo: string): boolean {
    const control = this.formTarefa.get(nomeCampo);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  salvarTarefa(): void {
    if (this.formTarefa.invalid) {
      this.formTarefa.markAllAsTouched();
      return;
    }

    this.enviando.set(true);
    this.erro.set(null);

    const payload = this.formTarefa.value;

    this.projetosService.criarTarefaComIdSequencial(payload).subscribe({
      next: () => {
        this.enviando.set(false);
        this.router.navigate(['/tarefas']);
      },
      error: (err: unknown) => {
        console.error('Erro ao salvar tarefa:', err);
        this.erro.set('Erro ao salvar no servidor. Tente novamente.');
        this.enviando.set(false);
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/tarefas']);
  }
}
