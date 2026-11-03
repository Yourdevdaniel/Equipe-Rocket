import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { EditarTarefa } from './editar-tarefa';

describe('EditarTarefa', () => {
  let component: EditarTarefa;
  let fixture: ComponentFixture<EditarTarefa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarTarefa],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditarTarefa);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir o estado de carregando enquanto os dados não chegam', () => {
    component.carregando.set(true);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const msgCarregando = el.querySelector('.estado-carregando');
    expect(msgCarregando).toBeTruthy();
    expect(msgCarregando?.textContent).toContain('Carregando dados da tarefa');
  });
});
