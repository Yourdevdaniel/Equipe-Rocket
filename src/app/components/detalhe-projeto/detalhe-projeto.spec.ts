import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { DetalheProjeto } from './detalhe-projeto';

describe('DetalheProjeto', () => {
  let component: DetalheProjeto;
  let fixture: ComponentFixture<DetalheProjeto>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalheProjeto],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(DetalheProjeto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir "não encontrado" e encerrar o carregamento ao buscar projeto inexistente (/projetos/999)', () => {
    component.idParam.set('999');
    component.carregarProjeto('999');

    const req = httpMock.expectOne('http://localhost:3000/projetos/999?_embed=tarefas');
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });

    fixture.detectChanges();

    expect(component.carregando()).toBe(false);
    expect(component.naoEncontrado()).toBe(true);

    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('não encontrado');
  });
});
