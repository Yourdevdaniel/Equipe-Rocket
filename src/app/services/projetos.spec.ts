import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ProjetosService } from './projetos';

describe('ProjetosService', () => {
  let service: ProjetosService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProjetosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});