import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Server
  },
  {
    path: 'login',
    renderMode: RenderMode.Server
  },
  {
    path: 'complaints',
    renderMode: RenderMode.Server
  }
];
