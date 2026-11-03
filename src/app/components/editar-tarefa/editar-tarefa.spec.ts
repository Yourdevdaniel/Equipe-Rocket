import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { EditarTarefa } from './editar-tarefa';

describe('EditarTarefa', () => {
  let component: EditarTarefa;
  let fixture: ComponentFixture<EditarTarefa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarTarefa],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditarTarefa);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir o estado de carregando enquanto os dados não chegam', () => {
    component.carregando.set(true);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const msgCarregando = el.querySelector('.estado-carregando');
    expect(msgCarregando).toBeTruthy();
    expect(msgCarregando?.textContent).toContain('Carregando dados da tarefa');
  });
});

describe('EditarTarefa com a API fora do ar', () => {
  it('falha ao carregar a tarefa avisa a causa em vez de abrir um formulário vazio sem explicação', async () => {
    await TestBed.configureTestingModule({
      imports: [EditarTarefa],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: '7' }) } } },
      ],
    }).compileComponents();

    const http = TestBed.inject(HttpTestingController);
    const fixture = TestBed.createComponent(EditarTarefa);
    fixture.detectChanges();
    http.expectOne('http://localhost:3000/projetos').flush([]);
    http.expectOne('http://localhost:3000/tarefas/7').error(new ProgressEvent('error'), { status: 0 });
    fixture.detectChanges();

    const aviso = (fixture.nativeElement as HTMLElement).querySelector('.mensagem-erro');
    expect(aviso?.textContent).toContain('Não foi possível carregar a tarefa');
    expect(aviso?.textContent).toContain('json-server');
  });
});

describe('EditarTarefa durante carregamento', () => {
  it('mantém o indicador até carregar a tarefa e a lista de projetos', async () => {
    await TestBed.configureTestingModule({
      imports: [EditarTarefa],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: '7' }) } } },
      ],
    }).compileComponents();

    const http = TestBed.inject(HttpTestingController);
    const fixture = TestBed.createComponent(EditarTarefa);
    fixture.detectChanges();

    const projetos = http.expectOne('http://localhost:3000/projetos');
    const tarefa = http.expectOne('http://localhost:3000/tarefas/7');
    tarefa.flush({ id: '7', titulo: 'Tarefa de teste', projetoId: '2' });
    fixture.detectChanges();

    expect(fixture.componentInstance.carregando()).toBe(true);
    expect((fixture.nativeElement as HTMLElement).querySelector('.estado-carregando')).toBeTruthy();

    projetos.flush([{ id: '2', nome: 'Projeto de teste' }]);
    fixture.detectChanges();

    expect(fixture.componentInstance.carregando()).toBe(false);
    expect((fixture.nativeElement as HTMLElement).querySelector('.estado-carregando')).toBeNull();
    http.verify();
  });
});
