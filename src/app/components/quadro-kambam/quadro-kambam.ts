import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
@Component({
  imports: [RouterLink],
  standalone: true,
  selector: 'app-quadro-kambam',
  styleUrl:'./quadro-kambam.css',
  templateUrl: './quadro-kambam.html'
})

export class QuadroKambam {
  private route = inject(ActivatedRoute);
  id = this.route.snapshot.paramMap.get('id');
  nome = this.route.snapshot.paramMap.get('nome');
}
