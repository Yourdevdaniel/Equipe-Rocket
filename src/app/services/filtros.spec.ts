import { TestBed } from '@angular/core/testing';
import { FiltrosService } from './filtros';
import { Tarefa } from '../models';

const tarefa = (id: string, titulo: string, status: Tarefa['status'], prioridade: Tarefa['prioridade']): Tarefa => ({
  id, titulo, status, prioridade, projetoId: '1', descricao: '', responsavel: 'Ana', prazo: '2026-10-27',
});

describe('FiltrosService', () => {
  let service: FiltrosService;
  const tarefas = [
    tarefa('1', 'Criar login', 'a-fazer', 'alta'),
    tarefa('2', 'Revisar LOGIN', 'em-revisao', 'baixa'),
    tarefa('3', 'Deploy', 'concluida', 'alta'),
  ];

  beforeEach(() => {
    service = TestBed.inject(FiltrosService);
  });

  it('sem filtros devolve tudo', () => {
    expect(service.filtrar(tarefas).length).toBe(3);
  });

  it('combina busca, status e prioridade', () => {
    service.busca.set('  login ');
    expect(service.filtrar(tarefas).map((t) => t.id)).toEqual(['1', '2']);
    service.prioridade.set('alta');
    expect(service.filtrar(tarefas).map((t) => t.id)).toEqual(['1']);
    service.status.set('em-revisao');
    expect(service.filtrar(tarefas)).toEqual([]);
    service.limpar();
    expect(service.filtrar(tarefas).length).toBe(3);
  });
});
