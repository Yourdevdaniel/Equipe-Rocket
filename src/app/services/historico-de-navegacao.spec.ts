import { TestBed } from '@angular/core/testing';
import { HistoricoDeNavegacao } from './historico-de-navegacao';

describe('HistoricoDeNavegacao', () => {
  let service: HistoricoDeNavegacao;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoricoDeNavegacao);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
