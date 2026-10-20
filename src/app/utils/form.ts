import { FormGroup } from '@angular/forms';

// Leva o foco do teclado ao primeiro campo inválido. Depende do id do campo ser igual ao nome do controle.
export function focarPrimeiroInvalido(form: FormGroup): void {
  const nome = Object.keys(form.controls).find((chave) => form.controls[chave].invalid);
  if (nome) {
    document.getElementById(nome)?.focus();
  }
}
