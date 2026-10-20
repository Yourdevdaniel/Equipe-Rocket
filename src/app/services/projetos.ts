import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap  } from 'rxjs';
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

    editarTarefa(id: string, alteracoes:Partial<Tarefa>): Observable<Tarefa>{
        return this.http.patch<Tarefa>(`${this.api}/tarefas/${id}`, alteracoes);
    }

    criarTarefaComIdSequencial(dadosFormulario: Omit<Tarefa, 'id' >): Observable<Tarefa> {
  return this.listarTarefas().pipe(
    switchMap((tarefasExistentes: Tarefa[]) => {
      const maiorId = tarefasExistentes.reduce((max: number, t: Tarefa) => {
        const num = Number(t.id);
        return !isNaN(num) && num > max ? num : max;
      }, 0);

      const novaTarefa: Tarefa = {
        id: String(maiorId + 1),
        ...dadosFormulario
      };

      console.log(novaTarefa)

      return this.http.post<Tarefa>(`${this.api}/tarefas`, novaTarefa);
    })
  );
  }
}


