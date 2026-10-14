import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable  } from 'rxjs';
import { Projeto, ProjetoComTarefas, Tarefa } from '../models'

@Injectable({ providedIn: 'root' })
export class ProjetosService {
    private http = inject(HttpClient);
    private api = 'http://localhost:3000';

    listarProjetos(): Observable<Projeto[]>{
        return this.http.get<Projeto[]>(`${this.api}/projetos`);
    }

    buscarProjeto(id: string): Observable<ProjetoComTarefas>{
        return this.http.get<ProjetoComTarefas>(`${this.api}/projetos/${id}?_embed=tarefas`);
    }

    listarTarefas(): Observable<Tarefa[]> {
        return this.http.get<Tarefa[]>(`${this.api}/tarefas`);
    }

    buscarTarefa(id: string): Observable<Tarefa> {
        return this.http.get<Tarefa>(`${this.api}/tarefas/${id}`);
    }
}


