import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { CriarTarefa } from './criar-tarefa';

describe('CriarTarefa', () => {
  let component: CriarTarefa;
  let fixture: ComponentFixture<CriarTarefa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriarTarefa],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CriarTarefa);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir o estado de carregando enquanto busca a lista de projetos', () => {
    component.carregando.set(true);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const msgCarregando = el.querySelector('.estado-carregando');
    expect(msgCarregando).toBeTruthy();
    expect(msgCarregando?.textContent).toContain('Carregando projetos disponíveis');
  });

  it('falha ao salvar explica a causa, mantém o formulário preenchido e libera o botão para tentar de novo', async () => {
    const http = TestBed.inject(HttpTestingController);
    http.match(() => true).forEach((r) => r.flush([]));
    component.formTarefa.patchValue({
      projetoId: '1', titulo: 'Escrever relatório', responsavel: 'Ana', prazo: '2026-11-10',
    });

    component.salvarTarefa();
    http.expectOne((r) => r.method === 'GET' && r.url.endsWith('/tarefas')).flush([]); // calcula o próximo id
    const post = http.expectOne((r) => r.method === 'POST');
    post.error(new ProgressEvent('error'), { status: 0 });
    fixture.detectChanges();

    expect(component.enviando()).toBe(false);
    expect(component.formTarefa.value.titulo).toBe('Escrever relatório');
    expect(component.erro()).toContain('Não foi possível salvar a tarefa.');
    expect(component.erro()).toContain('O que você digitou continua na tela');
    const alerta = (fixture.nativeElement as HTMLElement).querySelector('[role="alert"]');
    expect(alerta?.textContent).toContain('Não foi possível salvar a tarefa.');
  });
});
