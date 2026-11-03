import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ListaProjetos } from './lista-projetos';
import { HttpTestingController } from '@angular/common/http/testing';

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

  it('mostra o erro com "Tentar novamente" quando a API está fora e recarrega ao clicar', () => {
    const http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    http.expectOne('http://localhost:3000/projetos').error(new ProgressEvent('error'), { status: 0 });
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const caixa = el.querySelector('.status-msg.erro');
    expect(caixa?.textContent).toContain('json-server');
    expect(el.textContent).not.toContain('Nenhum projeto cadastrado.');

    (caixa!.querySelector('button') as HTMLButtonElement).click();
    http.expectOne('http://localhost:3000/projetos').flush([]);
    fixture.detectChanges();

    expect(el.querySelector('.status-msg.erro')).toBeNull();
    expect(el.textContent).toContain('Nenhum projeto cadastrado.');
  });
});
