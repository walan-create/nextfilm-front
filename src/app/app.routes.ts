import { Routes } from '@angular/router';
import { NotAuthenticatedGuard } from '@auth/guards/not-authenticated.guard';


export const routes: Routes = [
  // Ruta a la landing
  {
    path: 'landing',
    //component: Landing,
  },
  //Rutas a auth para login y register
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
    canMatch: [
      NotAuthenticatedGuard,
    ],
  },
  //Ruta a la front-page/home
  {
    path: 'home',
    //component: Home
  },
  // Ruta donde ver las peliculas
  {
    path: 'movies',
    //component: movies
    children: [
      // Ruta donde ver la info de cada pelicula
      {
        path: 'info/:id',
        //component: info
      },
      {
        path: ':id',
        //component: editar/crear
        canMatch: [
      //NotAuthenticatedGuard,
    ],
      },
    ]
  },
  //Ruta por si no se encuentra algo que redirija a home
  {
    path: '**',
    redirectTo: 'landing'
  }
];
