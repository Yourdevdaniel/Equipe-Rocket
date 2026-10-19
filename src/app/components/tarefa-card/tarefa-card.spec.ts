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
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
