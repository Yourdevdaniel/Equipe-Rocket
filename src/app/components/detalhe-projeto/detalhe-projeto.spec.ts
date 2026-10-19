import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { DetalheProjeto } from './detalhe-projeto';

describe('DetalheProjeto', () => {
  let component: DetalheProjeto;
  let fixture: ComponentFixture<DetalheProjeto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalheProjeto],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalheProjeto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
