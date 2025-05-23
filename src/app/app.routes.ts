import { Routes } from '@angular/router';
import { NotAuthenticatedGuard } from '@auth/guards/not-authenticated.guard';
import { LandingComponent } from './pages/landing/landing.component';
import { MovieInfoComponent } from './pages/movie-info/movie-info.component';
import { MovieComponent } from './pages/movie/movie.component';
import { HomeComponent } from './pages/home/home.component';
import { MoviesAdminComponent } from './pages/movies-admin/movies-admin.component';
import { MoviesComponent } from './pages/movies/movies.component';

// ------------------------ Definición de rutas principales ------------------------
export const routes: Routes = [
  //* ------------------------ landing ------------------------
  {
    path: 'landing',
    component: LandingComponent,
  },

  //* ------------------------ auth ------------------------
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
    canMatch: [
      // NotAuthenticatedGuard,
    ],
  },

  //* ------------------------ Home ------------------------
  {
    path: 'home',
    component: HomeComponent,
  },

  // ! ELIMINAR (DE PRUEBA)
  {
    path: 'info',
    component: MovieInfoComponent,
  },

  //* ------------------------ Movies ------------------------
  {
    path: 'movies',
    component: MoviesComponent, // Solo para /movies
  },
  {
    path: 'movies/admin',
    component: MoviesAdminComponent,
  },
  {
    path: 'movies/info/:id',
    component: MovieInfoComponent,
  },
  {
    path: 'movies/edit/:id',
    component: MovieComponent,
    canMatch: [
      //NotAuthenticatedGuard,
    ],
  },
  {
    path: 'movies/create',
    component: MovieComponent,
    canMatch: [
      //NotAuthenticatedGuard,
    ],
  },
  //* ------------------------ Rent ------------------------
  {
    path: 'rent',
    component: MoviesComponent, //TODO cambiar componente
    children: [
      {
        path: 'new', // Para hacer un alquiler
        component: MovieComponent, //TODO cambiar componente
        canMatch: [
          //NotAuthenticatedGuard,
        ],
      },
    ],
  },
  //* ------------------------ rutas por defecto y wildcard ------------------------
  // Redirección a landing si la ruta está vacía
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  // Redirección a landing si la ruta no existe
  { path: '**', redirectTo: 'landing' },
];
