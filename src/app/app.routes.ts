import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { MovieInfoComponent } from './pages/movie-info/movie-info.component';
import { HomeComponent } from './pages/home/home.component';
import { MoviesAdminComponent } from './pages/movies-admin/movies-admin.component';
import { MoviesComponent } from './pages/movies/movies.component';
import { RentalsComponent } from './pages/rentals/rentals.component';
import { CreateFilmPageComponent } from './pages/createFilm-page/createFilm-page.component';
import { EditMoviePageComponent } from './pages/editMovie-page/editMovie-page.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';

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

  //* ------------------------ Movies ------------------------
  {
    path: 'movies',
    component: MoviesComponent,
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
    component:  EditMoviePageComponent,
    canMatch: [
      //NotAuthenticatedGuard,
    ],
  },
  {
    path: 'movies/create',
    component: CreateFilmPageComponent,
    canMatch: [
      //NotAuthenticatedGuard,
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
    component: UserProfileComponent, //TODO Añadir Guard  para negar acceso a ADMINS
  },
  //* ------------------------ rutas por defecto y wildcard ------------------------
  // Redirección a landing si la ruta está vacía
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  // Redirección a landing si la ruta no existe
  { path: '**', redirectTo: 'landing' },
];
