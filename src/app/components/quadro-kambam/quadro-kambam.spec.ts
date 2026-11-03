import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { QuadroKambam } from './quadro-kambam';
import { FiltrosService } from '../../services/filtros';
import { Tarefa } from '../../models';
import { HttpTestingController } from '@angular/common/http/testing';

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

  it('API fora do ar mostra o aviso com "Tentar novamente" e o botão recarrega o quadro', () => {
    const http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    http.expectOne('http://localhost:3000/tarefas').error(new ProgressEvent('error'), { status: 0 });
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const caixa = el.querySelector('.feedback-msg.error');
    expect(caixa?.textContent).toContain('json-server');
    expect(el.querySelector('.kanban-board')).toBeNull();

    (caixa!.querySelector('button') as HTMLButtonElement).click();
    http.expectOne('http://localhost:3000/tarefas').flush(tarefasMock);
    fixture.detectChanges();

    expect(el.querySelector('.feedback-msg.error')).toBeNull();
    expect(el.querySelector('.kanban-board')).not.toBeNull();
  });

  describe('estado vazio', () => {
    let http: HttpTestingController;
    let el: HTMLElement;

    beforeEach(() => {
      http = TestBed.inject(HttpTestingController);
      el = fixture.nativeElement;
      fixture.detectChanges();
    });

    it('quadro sem tarefas mostra um aviso único no lugar das colunas vazias', () => {
      http.expectOne('http://localhost:3000/tarefas').flush([]);
      fixture.detectChanges();

      expect(el.querySelector('app-estado-vazio')?.textContent).toContain('Nenhuma tarefa cadastrada ainda');
      expect(el.querySelector('.kanban-board')).toBeNull();
    });

    it('busca sem resultado avisa e o botão traz o quadro de volta', () => {
      http.expectOne('http://localhost:3000/tarefas').flush(tarefasMock);
      filtrosService.busca.set('zzz-nao-existe');
      fixture.detectChanges();

      const aviso = el.querySelector('app-estado-vazio');
      expect(aviso?.textContent).toContain('filtros selecionados');
      expect(el.querySelector('.kanban-board')).toBeNull();

      (aviso!.querySelector('button') as HTMLButtonElement).click();
      fixture.detectChanges();

      expect(el.querySelector('app-estado-vazio')).toBeNull();
      expect(el.querySelector('.kanban-board')).not.toBeNull();
    });
  });
});
