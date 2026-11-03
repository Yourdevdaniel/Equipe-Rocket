import { Component, input } from '@angular/core';

// Aviso padrão de "não há nada para mostrar". A ação (botão ou link) vem de fora,
// por projeção de conteúdo, porque cada tela oferece uma saída diferente:
// criar uma tarefa ou limpar os filtros.
@Component({
  selector: 'app-estado-vazio',
  standalone: true,
  templateUrl: './estado-vazio.html',
  styleUrl: './estado-vazio.css',
})
export class EstadoVazio {
  readonly titulo = input.required<string>();
  readonly descricao = input<string>('');
}
