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
            switchMap((tarefasExistentes) =>
                this.http.post<Tarefa>(`${this.api}/tarefas`, { id: proximoId(tarefasExistentes), ...dadosFormulario })
            )
        );
    }

    criarProjetoComIdSequencial(dadosFormulario: Omit<Projeto, 'id'>): Observable<Projeto> {
        return this.listarProjetos().pipe(
            switchMap((projetosExistentes) =>
                this.http.post<Projeto>(`${this.api}/projetos`, { id: proximoId(projetosExistentes), ...dadosFormulario })
            )
        );
    }

    editarProjeto(id: string, alteracoes: Partial<Projeto>): Observable<Projeto> {
        return this.http.patch<Projeto>(`${this.api}/projetos/${id}`, alteracoes);
    }
}

// Próximo id numérico em texto ("1", "2"...), igual ao que já existe no db.json.
function proximoId(lista: { id: string }[]): string {
    const maiorId = lista.reduce((max, item) => {
        const num = Number(item.id);
        return !isNaN(num) && num > max ? num : max;
    }, 0);
    return String(maiorId + 1);
}
