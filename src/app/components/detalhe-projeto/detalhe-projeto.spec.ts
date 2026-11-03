import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { DetalheProjeto } from './detalhe-projeto';

describe('DetalheProjeto', () => {
  let component: DetalheProjeto;
  let fixture: ComponentFixture<DetalheProjeto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalheProjeto],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalheProjeto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('DetalheProjeto com a API fora do ar', () => {
  let fixture: ComponentFixture<DetalheProjeto>;
  let http: HttpTestingController;
  const urlProjeto = 'http://localhost:3000/projetos/1?_embed=tarefas';
  const projetoSemTarefas = {
    id: '1', nome: 'Quadro', descricao: '', disciplina: 'Frontend', criadoEm: '2026-10-01', tarefas: [],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalheProjeto],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: '1' }) } } },
      ],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(DetalheProjeto);
    fixture.detectChanges();
  });

  it('falha ao buscar o projeto mostra o erro e recarrega ao tentar de novo', () => {
    http.expectOne(urlProjeto).error(new ProgressEvent('error'), { status: 0 });
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.status-msg.erro')?.textContent).toContain('json-server');

    const botao = Array.from(el.querySelectorAll('.status-msg.erro button'))
      .find((b) => b.textContent?.includes('Tentar novamente')) as HTMLButtonElement;
    botao.click();
    http.expectOne(urlProjeto).flush(projetoSemTarefas);
    http.expectOne('http://localhost:3000/tarefas').flush([]);
    fixture.detectChanges();

    expect(el.querySelector('.status-msg.erro')).toBeNull();
    expect(el.textContent).toContain('Quadro');
  });

  it('falha ao buscar as tarefas não vira "Nenhuma tarefa cadastrada"', () => {
    http.expectOne(urlProjeto).flush(projetoSemTarefas);
    http.expectOne('http://localhost:3000/tarefas').error(new ProgressEvent('error'), { status: 0 });
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.status-msg.erro')?.textContent).toContain('as tarefas do projeto');
    expect(el.textContent).not.toContain('Nenhuma tarefa cadastrada');
  });
});
