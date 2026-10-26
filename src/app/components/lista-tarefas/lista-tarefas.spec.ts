import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ListaTarefas } from './lista-tarefas';
import { Tarefa } from '../../models';

describe('ListaTarefas', () => {
  let component: ListaTarefas;
  let fixture: ComponentFixture<ListaTarefas>;

  const tarefasMock: Tarefa[] = [
    {
      id: '1',
      projetoId: '1',
      titulo: 'Configurar roteamento Angular',
      descricao: 'Criar rotas principais',
      status: 'concluida',
      prioridade: 'alta',
      responsavel: 'Daniel',
      prazo: '2026-10-20',
    },
    {
      id: '2',
      projetoId: '1',
      titulo: 'Implementar validação de formulário',
      descricao: 'Validar campos obrigatórios',
      status: 'em-andamento',
      prioridade: 'media',
      responsavel: 'Eduardo',
      prazo: '2026-10-25',
    },
    {
      id: '3',
      projetoId: '1',
      titulo: 'Configurar testes de formulário',
      descricao: 'Testes unitários',
      status: 'em-andamento',
      prioridade: 'alta',
      responsavel: 'Matheus',
      prazo: '2026-10-27',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaTarefas],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaTarefas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve filtrar tarefas pelo título ignorando maiúsculas/minúsculas e acentos', () => {
    component.tarefas.set(tarefasMock);

    expect(component.tarefasFiltradas().length).toBe(3);

    component.termoBusca.set('roteamento');
    expect(component.tarefasFiltradas().length).toBe(1);
    expect(component.tarefasFiltradas()[0].id).toBe('1');

    component.termoBusca.set('VALIDACAO');
    expect(component.tarefasFiltradas().length).toBe(1);
    expect(component.tarefasFiltradas()[0].id).toBe('2');

    component.limparBusca();
    expect(component.tarefasFiltradas().length).toBe(3);
  });

  it('deve combinar busca por título com filtros de status e prioridade', () => {
    component.tarefas.set(tarefasMock);

    component.filtroStatus.set('em-andamento');
    expect(component.tarefasFiltradas().length).toBe(2);

    component.filtroPrioridade.set('alta');
    expect(component.tarefasFiltradas().length).toBe(1);
    expect(component.tarefasFiltradas()[0].id).toBe('3');

    component.termoBusca.set('roteamento');
    expect(component.tarefasFiltradas().length).toBe(0);

    component.limparFiltros();
    expect(component.temFiltrosAtivos()).toBe(false);
    expect(component.tarefasFiltradas().length).toBe(3);
  });
});
