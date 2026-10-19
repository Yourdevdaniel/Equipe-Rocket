import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarTarefa } from './editar-tarefa';

describe('EditarTarefa', () => {
  let component: EditarTarefa;
  let fixture: ComponentFixture<EditarTarefa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarTarefa],
    }).compileComponents();

    fixture = TestBed.createComponent(EditarTarefa);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
