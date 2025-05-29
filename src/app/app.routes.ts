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
import { AuthenticatedGuard } from '@auth/guards/authenticated.guard';
import { IsAdminGuard } from '@auth/guards/is-admin.guard';
import { NotAuthenticatedGuard } from '@auth/guards/not-authenticated.guard';
import { NewRentalComponent } from './pages/new-rental/new-rental.component';
import { UpdateRentalComponent } from './pages/update-rental/update-rental.component';

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
      // AuthenticatedGuard, // Aseguramos que el usuario esté autenticado para acceder a esta ruta
    ],
  },

  //* ------------------------ Movies ------------------------
  {
    path: 'movies',
    component: MoviesComponent,
     canMatch: [
      // AuthenticatedGuard, // Aseguramos que el usuario esté autenticado para acceder a esta ruta
    ],

  },
  {
    path: 'movies/admin',
    component: MoviesAdminComponent,
    canMatch: [
      // IsAdminGuard, // Aseguramos que el usuario esté autenticado para acceder a esta ruta
    ],
  },
  {
    path: 'movies/info/:id',
    component: MovieInfoComponent,
     canMatch: [
      // AuthenticatedGuard, // Aseguramos que el usuario esté autenticado para acceder a esta ruta
    ],
  },
  {
    path: 'movies/edit/:id',
    component:  EditMoviePageComponent,
    canMatch: [
      // IsAdminGuard, // Aseguramos que el usuario esté autenticado para acceder a esta ruta
    ],
  },
  {
    path: 'movies/create',
    component: CreateFilmPageComponent,
    canMatch: [
      // IsAdminGuard, // Aseguramos que el usuario esté autenticado para acceder a esta ruta
    ],
  },
  //* ------------------------ Rent ------------------------
  {
    path: 'rentals',
    component: RentalsComponent, //TODO cambiar componente
  },
   {
    path: 'rentals/new',
    component: NewRentalComponent, //TODO cambiar componente
  },
   {
    path: 'rentals/edit/:id',
    component: UpdateRentalComponent, //TODO cambiar componente
  },




  //* ------------------------ profile ------------------------
  {
    path: 'profile',
    component: UserProfileComponent, //TODO Añadir Guard  para negar acceso a ADMINS
    canMatch: [
      // AuthenticatedGuard, // Aseguramos que el usuario esté autenticado para acceder a esta ruta
    ],
  },
  //* ------------------------ rutas por defecto y wildcard ------------------------
  // Redirección a landing si la ruta está vacía
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  // Redirección a landing si la ruta no existe
  { path: '**', redirectTo: 'landing' },
]
