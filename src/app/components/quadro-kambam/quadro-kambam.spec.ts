import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { QuadroKambam } from './quadro-kambam';

describe('QuadroKambam', () => {
  let component: QuadroKambam;
  let fixture: ComponentFixture<QuadroKambam>;

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
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
