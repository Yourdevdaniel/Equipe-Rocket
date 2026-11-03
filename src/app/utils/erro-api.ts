import { HttpErrorResponse } from '@angular/common/http';

/**
 * Traduz uma falha de requisição em uma mensagem que diz o que aconteceu e o
 * que fazer. `oQueFalhou` completa a frase: "Não foi possível carregar {oQueFalhou}".
 *
 * Status 0 é o caso mais comum no desenvolvimento: o navegador não conseguiu
 * falar com o servidor (json-server parado), então não existe resposta HTTP.
 */
export function mensagemDeErro(erro: unknown, oQueFalhou: string): string {
  const prefixo = `Não foi possível carregar ${oQueFalhou}.`;
  const status = erro instanceof HttpErrorResponse ? erro.status : 0;

  if (status === 0) {
    return `${prefixo} Não há conexão com a API. Confira se o json-server está rodando (npm run api) e tente de novo.`;
  }
  if (status === 404) {
    return `${prefixo} O dado pedido não existe mais na API.`;
  }
  if (status >= 500) {
    return `${prefixo} A API respondeu com um erro interno (${status}). Tente de novo em instantes.`;
  }
  return `${prefixo} A API recusou o pedido (erro ${status}).`;
}
