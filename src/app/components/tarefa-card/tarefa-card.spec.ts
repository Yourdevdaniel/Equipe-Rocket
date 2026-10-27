import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TarefaCard } from './tarefa-card';

describe('TarefaCard', () => {
  let component: TarefaCard;
  let fixture: ComponentFixture<TarefaCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarefaCard],
      providers: [provideRouter([])],
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
});
