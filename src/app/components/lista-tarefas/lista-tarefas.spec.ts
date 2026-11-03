import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { ListaTarefas } from './lista-tarefas';
import { FiltrosService } from '../../services/filtros';
import { Tarefa } from '../../models';
import { HttpTestingController } from '@angular/common/http/testing';

describe('ListaTarefas', () => {
  let component: ListaTarefas;
  let fixture: ComponentFixture<ListaTarefas>;
  let filtrosService: FiltrosService;

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

    filtrosService = TestBed.inject(FiltrosService);
    filtrosService.limpar();

    fixture = TestBed.createComponent(ListaTarefas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => {
    filtrosService.limpar();
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

  it('deve manter o valor visual dos seletores ao criar o componente com filtros já ativos', async () => {
    filtrosService.status.set('em-andamento');
    filtrosService.prioridade.set('alta');

    const novaFixture = TestBed.createComponent(ListaTarefas);
    novaFixture.detectChanges();
    await novaFixture.whenStable();

    const el = novaFixture.nativeElement as HTMLElement;
    const selectStatus = el.querySelector('#filtro-status') as HTMLSelectElement;
    const selectPrioridade = el.querySelector('#filtro-prioridade') as HTMLSelectElement;

    expect(selectStatus.value).toBe('em-andamento');
    expect(selectPrioridade.value).toBe('alta');
  });

  it('erro 500 da API mostra a causa e o botão de tentar de novo', () => {
    const http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    http.expectOne('http://localhost:3000/tarefas').flush(null, { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.status-msg.erro')?.textContent).toContain('erro interno (500)');

    (el.querySelector('.status-msg.erro button') as HTMLButtonElement).click();
    http.expectOne('http://localhost:3000/tarefas').flush([]);
    fixture.detectChanges();

    expect(el.querySelector('.status-msg.erro')).toBeNull();
  });

  describe('estado vazio', () => {
    let http: HttpTestingController;
    let el: HTMLElement;

    beforeEach(() => {
      http = TestBed.inject(HttpTestingController);
      el = fixture.nativeElement;
      fixture.detectChanges();
    });

    it('sem nenhuma tarefa cadastrada convida a criar a primeira', () => {
      http.expectOne('http://localhost:3000/tarefas').flush([]);
      fixture.detectChanges();

      const aviso = el.querySelector('app-estado-vazio');
      expect(aviso?.textContent).toContain('Nenhuma tarefa cadastrada ainda');
      expect(aviso?.querySelector('a')?.getAttribute('href')).toBe('/tarefas/nova');
      expect(el.querySelector('app-tarefa-card')).toBeNull();
    });

    it('busca ou filtro sem resultado avisa e o botão limpa os filtros', () => {
      http.expectOne('http://localhost:3000/tarefas').flush(tarefasMock);
      component.termoBusca.set('zzz-nao-existe');
      fixture.detectChanges();

      const aviso = el.querySelector('app-estado-vazio');
      expect(aviso?.textContent).toContain('Nenhuma tarefa encontrada');
      expect(aviso?.textContent).toContain('filtros selecionados');
      expect(el.querySelector('app-tarefa-card')).toBeNull();

      (aviso!.querySelector('button') as HTMLButtonElement).click();
      fixture.detectChanges();

      expect(el.querySelector('app-estado-vazio')).toBeNull();
      expect(el.querySelectorAll('app-tarefa-card').length).toBe(3);
    });
  });
});

describe('ListaTarefas de um projeto sem tarefas', () => {
  it('mostra o estado vazio do projeto em vez de listar as tarefas dos outros', async () => {
    await TestBed.configureTestingModule({
      imports: [ListaTarefas],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: '9' }) } } },
      ],
    }).compileComponents();

    const http = TestBed.inject(HttpTestingController);
    const fixture = TestBed.createComponent(ListaTarefas);
    fixture.detectChanges();
    // O id da URL é tentado primeiro como tarefa; sem tarefa 9, vira filtro por projeto.
    http.expectOne('http://localhost:3000/tarefas/9').flush(null, { status: 404, statusText: 'Not Found' });
    http.expectOne('http://localhost:3000/tarefas').flush([
      { id: '1', projetoId: '1', titulo: 'De outro projeto', descricao: '', status: 'a-fazer', prioridade: 'alta', responsavel: 'A', prazo: '2026-11-01' },
    ]);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('app-estado-vazio')?.textContent).toContain('Este projeto ainda não tem tarefas');
    expect(el.querySelector('app-tarefa-card')).toBeNull();
  });
});
