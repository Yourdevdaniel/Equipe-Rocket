import { HttpErrorResponse } from '@angular/common/http';
import { mensagemDeErro, mensagemDeFalhaAoGravar } from './erro-api';

describe('mensagemDeErro', () => {
  it('status 0 (json-server parado) manda conferir o servidor e dá o comando', () => {
    const msg = mensagemDeErro(new HttpErrorResponse({ status: 0 }), 'as tarefas');

    expect(msg).toContain('Não foi possível carregar as tarefas.');
    expect(msg).toContain('json-server');
    expect(msg).toContain('npm run api');
  });

  it('404 diz que o dado não existe mais', () => {
    const msg = mensagemDeErro(new HttpErrorResponse({ status: 404 }), 'o projeto');

    expect(msg).toContain('não existe mais');
  });

  it('5xx informa o código do erro interno', () => {
    const msg = mensagemDeErro(new HttpErrorResponse({ status: 500 }), 'os projetos');

    expect(msg).toContain('erro interno (500)');
  });

  it('outro status 4xx informa o código recusado', () => {
    const msg = mensagemDeErro(new HttpErrorResponse({ status: 400 }), 'os projetos');

    expect(msg).toContain('erro 400');
  });

  it('erro que não é HTTP cai no caso sem conexão', () => {
    expect(mensagemDeErro(new Error('boom'), 'as tarefas')).toContain('json-server');
  });
});

describe('mensagemDeFalhaAoGravar', () => {
  it('sem conexão avisa que nada foi salvo e que os dados digitados continuam na tela', () => {
    const msg = mensagemDeFalhaAoGravar(new HttpErrorResponse({ status: 0 }), 'salvar a tarefa');

    expect(msg).toContain('Não foi possível salvar a tarefa.');
    expect(msg).toContain('npm run api');
    expect(msg).toContain('O que você digitou continua na tela');
  });

  it('404 diz que o registro não existe mais', () => {
    const msg = mensagemDeFalhaAoGravar(new HttpErrorResponse({ status: 404 }), 'excluir a tarefa');

    expect(msg).toContain('Não foi possível excluir a tarefa.');
    expect(msg).toContain('não existe mais');
  });

  it('5xx informa o código e pede para tentar de novo', () => {
    const msg = mensagemDeFalhaAoGravar(new HttpErrorResponse({ status: 500 }), 'salvar o projeto');

    expect(msg).toContain('erro interno (500)');
    expect(msg).toContain('tente de novo');
  });
});
