import { Injectable, inject, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class HistoricoDeNavegacao {
  private readonly router = inject(Router);

  private readonly urlAnterior = signal<string | null>(null);
  private readonly urlAtual = signal<string | null>(null);

  constructor(){
    this.router.events
    .pipe(filter((event) : event is NavigationEnd => event instanceof NavigationEnd))
    .subscribe((event) => {
      this.urlAnterior.set(this.urlAtual());
      this.urlAtual.set(event.url);
    });
  }

  voltar(rotaPadrao: string = '/tarefas') : void{
    const urlAnterior = this.urlAnterior();

    if (urlAnterior && urlAnterior !== this.urlAtual()) {
      this.router.navigateByUrl(urlAnterior);
  } else {
    this.router.navigateByUrl(rotaPadrao);
  }
}}
