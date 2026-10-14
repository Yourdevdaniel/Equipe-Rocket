import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ListaProjetos } from './lista-projetos';

describe('ListaProjetos', () => {
  let component: ListaProjetos;
  let fixture: ComponentFixture<ListaProjetos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaProjetos],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaProjetos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
