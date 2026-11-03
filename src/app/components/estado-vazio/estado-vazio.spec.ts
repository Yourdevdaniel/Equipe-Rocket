import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EstadoVazio } from './estado-vazio';

@Component({
  imports: [EstadoVazio],
  template: `
    <app-estado-vazio titulo="Nada aqui" descricao="Crie algo para começar.">
      <button type="button">Criar</button>
    </app-estado-vazio>
    <app-estado-vazio titulo="Só título" />
  `,
})
class Hospedeiro {}

describe('EstadoVazio', () => {
  it('mostra título, descrição e a ação projetada', async () => {
    await TestBed.configureTestingModule({ imports: [Hospedeiro] }).compileComponents();
    const fixture = TestBed.createComponent(Hospedeiro);
    fixture.detectChanges();

    const [com, sem] = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('.estado-vazio'));
    expect(com.querySelector('.titulo')?.textContent).toContain('Nada aqui');
    expect(com.querySelector('.descricao')?.textContent).toContain('Crie algo para começar.');
    expect(com.querySelector('.acao button')?.textContent).toContain('Criar');
    expect(sem.querySelector('.descricao')).toBeNull();
    expect(sem.getAttribute('role')).toBe('status');
  });
});
