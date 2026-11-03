import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ListaProjetos } from './lista-projetos';

describe('ListaProjetos', () => {
  let component: ListaProjetos;
  let fixture: ComponentFixture<ListaProjetos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaProjetos],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaProjetos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir o estado de carregando enquanto os projetos não chegam', () => {
    component.carregando.set(true);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const msgCarregando = el.querySelector('.estado-carregando');
    expect(msgCarregando).toBeTruthy();
    expect(msgCarregando?.textContent).toContain('Carregando projetos');
  });
});
