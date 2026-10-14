import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  standalone: true,
  selector: 'app-lista-projetos',
  styleUrl: './lista-projetos.css',
  templateUrl: './lista-projetos.html',
})
export class ListaProjetos {}
