import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuadroKambam } from './quadro-kambam';

describe('QuadroKambam', () => {
  let component: QuadroKambam;
  let fixture: ComponentFixture<QuadroKambam>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuadroKambam],
    }).compileComponents();

    fixture = TestBed.createComponent(QuadroKambam);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
