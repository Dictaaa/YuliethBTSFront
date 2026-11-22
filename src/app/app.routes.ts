import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Inicio · Yulieth y BTS',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'miembros',
    title: 'Miembros · BTS',
    loadComponent: () =>
      import('./pages/members/members.component').then((m) => m.MembersComponent),
  },
  {
    path: 'miembros/:id',
    title: 'Perfil · BTS',
    loadComponent: () =>
      import('./pages/member-detail/member-detail.component').then(
        (m) => m.MemberDetailComponent
      ),
  },
  {
    path: 'musica',
    title: 'Música · BTS',
    loadComponent: () =>
      import('./pages/music/music.component').then((m) => m.MusicComponent),
  },
  {
    path: 'cronologia',
    title: 'Cronología · BTS',
    loadComponent: () =>
      import('./pages/chronology/chronology.component').then(
        (m) => m.ChronologyComponent
      ),
  },
  {
    path: 'eventos',
    title: 'Eventos · BTS',
    loadComponent: () =>
      import('./pages/events/events.component').then((m) => m.EventsComponent),
  },
 {
    path: 'noticias',
    title: 'Noticias · BTS',
    loadComponent: () =>
      import('./pages/news/news.component').then((m) => m.NewsComponent),
  },
  {
    path: 'tienda',
    title: 'Tienda y descuentos · BTS',
    loadComponent: () =>
      import('./pages/shop/shop.component').then((m) => m.ShopComponent),
  },
  {
    path: 'yulieth',
    title: 'Portafolio · Yulieth',
    loadComponent: () =>
      import('./pages/about-yulieth/about-yulieth.component').then(
        (m) => m.AboutYuliethComponent
      ),
  },
  {
    path: 'para-yulieth',
    title: 'Para Yulieth 💜',
    loadComponent: () =>
      import('./pages/for-yulieth/for-yulieth.component').then(
        (m) => m.ForYuliethComponent
      ),
  },
    {
    path: 'juegos',
    title: 'Juegos ARMY 🎮',
    loadComponent: () =>
      import('./games/pages/games-hub/games-hub.component').then((m) => m.GamesHubComponent),
  },
  {
    path: 'juegos/ranking',
    title: 'Ranking · Juegos ARMY',
    loadComponent: () =>
      import('./games/pages/ranking/ranking.component').then((m) => m.RankingComponent),
  },
  {
    path: 'juegos/:id',
    title: 'Juego · ARMY',
    loadComponent: () =>
      import('./games/pages/game-runner/game-runner.component').then((m) => m.GameRunnerComponent),
  },
  { path: '**', redirectTo: '' },
];