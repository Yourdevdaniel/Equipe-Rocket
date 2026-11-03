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
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(EditarTarefa);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('EditarTarefa com a API fora do ar', () => {
  it('falha ao carregar a tarefa avisa o motivo em vez de abrir um formulário vazio sem explicação', async () => {
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
