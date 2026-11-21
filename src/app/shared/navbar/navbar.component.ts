import { Component, HostListener, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  open = signal(false);
  scrolled = signal(false);

  links = [
    { path: '/', label: 'Inicio', exact: true },
    { path: '/miembros', label: 'Miembros', exact: false },
    { path: '/musica', label: 'Música', exact: false },
    { path: '/cronologia', label: 'Cronología', exact: false },
    { path: '/eventos', label: 'Eventos', exact: false },
        { path: '/noticias', label: 'Noticias', exact: false },
    { path: '/tienda', label: 'Tienda', exact: false },
    //{ path: '/yulieth', label: 'Yulieth', exact: false },
  ];

  constructor() {
    this.onScroll();
  }

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled.set(window.scrollY > 30);
  }

  toggle() {
    this.open.update((v) => !v);
  }

  close() {
    this.open.set(false);
  }
}