import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { MovieInfoComponent } from './pages/movie-info/movie-info.component';
import { HomeComponent } from './pages/home/home.component';
import { MoviesAdminComponent } from './pages/movies-admin/movies-admin.component';
import { MoviesComponent } from './pages/movies/movies.component';
import { RentalsComponent } from './pages/rentals/rentals.component';
import { CreateFilmPageComponent } from './pages/createFilm-page/createFilm-page.component';
import { EditMoviePageComponent } from './pages/editMovie-page/editMovie-page.component';
import { AuthenticatedGuard } from '@auth/guards/authenticated.guard';
import { IsAdminGuard } from '@auth/guards/is-admin.guard';

// ------------------------ Definición de rutas principales ------------------------
export const routes: Routes = [
  //* ------------------------ landing ------------------------
  {
    path: 'landing',
    component: LandingComponent,
    canMatch: [
      NotAuthenticatedGuard,
    ],
  },

  //* ------------------------ auth ------------------------
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
    canMatch: [
      NotAuthenticatedGuard,
    ],
  },

  //* ------------------------ Home ------------------------
  {
    path: 'home',
    component: HomeComponent,
    canMatch: [
      AuthenticatedGuard, // Aseguramos que el usuario esté autenticado para acceder a esta ruta
    ],
  },

  //* ------------------------ Movies ------------------------
  {
    path: 'movies',
    component: MoviesComponent,
     canMatch: [
      AuthenticatedGuard, // Aseguramos que el usuario esté autenticado para acceder a esta ruta
    ],

  },
  {
    path: 'movies/admin',
    component: MoviesAdminComponent,
    canMatch: [
      IsAdminGuard, // Aseguramos que el usuario esté autenticado para acceder a esta ruta
    ],
  },
  {
    path: 'movies/info/:id',
    component: MovieInfoComponent,
     canMatch: [
      AuthenticatedGuard, // Aseguramos que el usuario esté autenticado para acceder a esta ruta
    ],
  },
  {
    path: 'movies/edit/:id',
    component:  EditMoviePageComponent,
    canMatch: [
      IsAdminGuard, // Aseguramos que el usuario esté autenticado para acceder a esta ruta
    ],
  },
  {
    path: 'movies/create',
    component: CreateFilmPageComponent,
    canMatch: [
      IsAdminGuard, // Aseguramos que el usuario esté autenticado para acceder a esta ruta
    ],
  },
  //* ------------------------ Rent ------------------------
  {
    path: 'rentals',
    component: RentalsComponent, //TODO cambiar componente
    children: [
      {
        path: 'new', // Para hacer un alquiler
        component: HomeComponent, //TODO cambiar componente
        canMatch: [
          //NotAuthenticatedGuard,
        ],
      },
      {
        path: 'edit/:id', // Para editar un alquiler
        component: HomeComponent, //TODO cambiar componente
        canMatch: [
          //NotAuthenticatedGuard,
        ],
      },
    ],
  },

  //* ------------------------ profile ------------------------
  {
    path: 'profile',
    component: HomeComponent, //TODO cambiar componente cuando esté creado
    canMatch: [
      AuthenticatedGuard, // Aseguramos que el usuario esté autenticado para acceder a esta ruta
    ],
  },
  //* ------------------------ rutas por defecto y wildcard ------------------------
  // Redirección a landing si la ruta está vacía
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  // Redirección a landing si la ruta no existe
  { path: '**', redirectTo: 'landing' },
];
