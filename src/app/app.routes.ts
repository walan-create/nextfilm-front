import { Routes } from '@angular/router';
import { NotAuthenticatedGuard } from '@auth/guards/not-authenticated.guard';
import { LandingComponent } from './pages/landing/landing.component';
import { MoviesComponent } from './pages/movies/movies.component';
import { MovieInfoComponent } from './pages/movie-info/movie-info.component';
import { MovieComponent } from './pages/movie/movie.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  // Ruta a la landing
  {
    path: 'landing',
    component: LandingComponent,
  },
  //Rutas a auth para login y register
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
    canMatch: [
      // NotAuthenticatedGuard,
    ],
  },
  // Ruta a la home
  {
    path: 'home',
    component: HomeComponent,
  },
  // Ruta donde ver las peliculas
  {
    path: 'movies',
    component: MoviesComponent,
    children: [
      // Ruta donde ver la info de cada pelicula
      {
        path: 'info/:id',
        component: MovieInfoComponent,
      },
      // Ruta donde editar la info de la pelicula
      {
        path: ':id',
        component: MovieComponent,
        canMatch: [
          //NotAuthenticatedGuard,
        ],
      },
    ],
  },
  //Ruta por si no se encuentra algo que redirija a home
  { path: '', redirectTo: 'landing', pathMatch: 'full' }, // Página de inicio por defecto
  { path: '**', redirectTo: 'landing' }, // Redirección en caso de ruta no encontrada
];
