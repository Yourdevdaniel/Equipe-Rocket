import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { QuadroKambam } from './quadro-kambam';
import { FiltrosService } from '../../services/filtros';
import { Tarefa } from '../../models';

describe('QuadroKambam', () => {
  let component: QuadroKambam;
  let fixture: ComponentFixture<QuadroKambam>;
  let filtrosService: FiltrosService;

  const tarefasMock: Tarefa[] = [
    {
      id: '1',
      projetoId: '1',
      titulo: 'Configurar roteamento',
      descricao: '',
      status: 'a-fazer',
      prioridade: 'alta',
      responsavel: 'Daniel',
      prazo: '2026-10-30',
    },
    {
      id: '2',
      projetoId: '1',
      titulo: 'Criar componentes',
      descricao: '',
      status: 'em-andamento',
      prioridade: 'media',
      responsavel: 'Eduardo',
      prazo: '2026-10-31',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuadroKambam],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(QuadroKambam);
    component = fixture.componentInstance;
    filtrosService = TestBed.inject(FiltrosService);
    filtrosService.limpar();
    await fixture.whenStable();
  });

  afterEach(() => {
    filtrosService.limpar();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve sincronizar filtros e atualizar colunas do quadro', () => {
    component.tarefas.set(tarefasMock);

    expect(component.tarefasAFazer().length).toBe(1);
    expect(component.tarefasEmAndamento().length).toBe(1);

    component.filtroPrioridade.set('alta');
    expect(component.tarefasAFazer().length).toBe(1);
    expect(component.tarefasEmAndamento().length).toBe(0);

    component.limparFiltros();
    expect(component.tarefasAFazer().length).toBe(1);
    expect(component.tarefasEmAndamento().length).toBe(1);
  });
});
