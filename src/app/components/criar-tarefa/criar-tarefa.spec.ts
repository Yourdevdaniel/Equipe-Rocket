import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CriarTarefa } from './criar-tarefa';

describe('CriarTarefa', () => {
  let component: CriarTarefa;
  let fixture: ComponentFixture<CriarTarefa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriarTarefa],
    }).compileComponents();

    fixture = TestBed.createComponent(CriarTarefa);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
