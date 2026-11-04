import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { TarefaCard } from './tarefa-card';

describe('TarefaCard', () => {
  let component: TarefaCard;
  let fixture: ComponentFixture<TarefaCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarefaCard],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(TarefaCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('tarefa', {
      id: '1', projetoId: '1', titulo: 'Teste', descricao: '', status: 'a-fazer',
      prioridade: 'media', responsavel: 'Ana', prazo: '2026-10-27',
    });
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('falha ao excluir mantém o diálogo aberto com a causa e permite tentar de novo sem duplicar o pedido', () => {
    const http = TestBed.inject(HttpTestingController);
    const excluidas: string[] = [];
    component.tarefaExcluida.subscribe((id) => excluidas.push(id));
    component.abrirConfirmacaoExclusao();

    component.confirmarExclusaoTarefa();
    component.confirmarExclusaoTarefa(); // duplo clique enquanto o pedido está em andamento
    expect(component.excluindo()).toBe(true);
    const primeira = http.expectOne((r) => r.method === 'DELETE');
    primeira.error(new ProgressEvent('error'), { status: 0 });

    expect(component.excluindo()).toBe(false);
    expect(component.confirmarExclusao()).toBe(true);
    expect(component.erroExcluir()).toContain('Não foi possível excluir a tarefa.');
    expect(excluidas).toEqual([]);

    component.confirmarExclusaoTarefa();
    http.expectOne((r) => r.method === 'DELETE').flush({});
    expect(excluidas).toEqual(['1']);
    expect(component.erroExcluir()).toBeNull();
  });

  it('cancelar a exclusão limpa o aviso de falha anterior', () => {
    component.erroExcluir.set('falhou');
    component.cancelarExclusao();

    expect(component.erroExcluir()).toBeNull();
  });

  it('abre os detalhes pelo teclado: o título é um botão e o diálogo recebe o foco', async () => {
    const el = fixture.nativeElement as HTMLElement;
    el.querySelector<HTMLButtonElement>('h3 button')!.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const dialogo = el.querySelector('[role="dialog"]');
    expect(dialogo).toBeTruthy();
    expect(dialogo!.getAttribute('aria-labelledby')).toBe('titulo-detalhes');
    expect(document.activeElement?.className).toContain('btn-fechar');
  });
});
