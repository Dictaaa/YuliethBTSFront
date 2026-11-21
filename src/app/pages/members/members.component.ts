import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MemberCardComponent } from '../../shared/member-card/member-card.component';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { MEMBERS } from '../../core/data/bts.data';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [RouterLink, MemberCardComponent, RevealDirective],
  template: `
    <section class="container">
      <header class="page-head">
        <h1 appReveal="up">Los 7 integrantes 💜</h1>
        <p appReveal="up" [revealDelay]="150">Toca a cada uno para ver su perfil y sus proyectos solistas.</p>
      </header>

      <div class="members">
        @for (m of members; track m.id; let i = $index) {
          <a [routerLink]="['/miembros', m.id]" class="link" appReveal="up" [revealDelay]="(i % 4) * 120">
            <app-member-card [member]="m" />
          </a>
        }
      </div>
    </section>
  `,
  styleUrl: './members.component.scss',
})
export class MembersComponent {
  members = MEMBERS;
}