import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HistoricoDeNavegacao } from './services/historico-de-navegacao';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('Equipe-Rocket');

  private readonly historicoDeNavegacao = inject(HistoricoDeNavegacao);
}
