import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Tarefa } from '../../models';

@Component({
  selector: 'app-tarefa-card',
  imports: [DatePipe, RouterLink],
  templateUrl: './tarefa-card.html',
  styleUrl: './tarefa-card.css',
})
export class TarefaCard {
  tarefa = input.required<Tarefa>();

  readonly rotuloStatus: Record<Tarefa['status'], string> = {
    'a-fazer': 'A Fazer',
    'em-andamento': 'Em Andamento',
    'em-revisao': 'Em Revisão',
    'concluida': 'Concluído',
  };

  readonly rotuloPrioridade: Record<Tarefa['prioridade'], string> = {
    alta: 'Alta',
    media: 'Média',
    baixa: 'Baixa',
  };
}