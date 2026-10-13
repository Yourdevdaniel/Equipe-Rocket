export interface Projeto {
    id: string;
    nome: string;
    descricao: string;
    disciplina: string;
    criadoEm: string;
    
}

export interface Tarefa {
    id: string;
    projetoId: string;
    titulo: string;
    descricao: string;
    status: 'a-fazer' | 'em-andamento' | 'em-revisao' | 'concluida';
    prioridade: "alta" | "media" | "baixa";
    responsavel: string,
    prazo: string
}

export type ProjetoComTarefas = Projeto & { tarefas: Tarefa[] };