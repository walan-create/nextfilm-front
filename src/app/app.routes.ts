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
import { NotAdminGuard } from '@auth/guards/not-admin.guard';

// ------------------------ Definición de rutas principales ------------------------
export const routes: Routes = [
  //* ------------------------ landing ------------------------
  {
    path: 'landing',
    component: LandingComponent,
    canMatch: [
      NotAuthenticatedGuard, // Aseguramos que el usuario NO esté autenticado para acceder a esta ruta
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
    AuthenticatedGuard,
    ],

  },
  {
    path: 'movies/admin',
    component: MoviesAdminComponent,
    canMatch: [
    AuthenticatedGuard,
    IsAdminGuard, // Aseguramos que el usuario tenga rol de Admin para acceder a esta ruta
    ],
  },
  {
    path: 'movies/info/:id',
    component: MovieInfoComponent,
    canMatch: [
    AuthenticatedGuard,
    ],
  },
  {
    path: 'movies/edit/:id',
    component:  EditMoviePageComponent,
    canMatch: [
    AuthenticatedGuard,
    IsAdminGuard,
    ],
  },
  {
    path: 'movies/create',
    component: CreateFilmPageComponent,
    canMatch: [
    AuthenticatedGuard,
    IsAdminGuard,
    ],
  },
  //* ------------------------ Rent ------------------------
  {
    path: 'rentals',
    component: RentalsComponent,
    canMatch:[
    AuthenticatedGuard,
    IsAdminGuard,
    ]
  },
   {
    path: 'rentals/new',
    component: NewRentalComponent,
    canMatch:[
    AuthenticatedGuard,
    IsAdminGuard,
    ]
  },
   {
    path: 'rentals/edit/:id',
    component: UpdateRentalComponent,
    canMatch:[
    AuthenticatedGuard,
    IsAdminGuard,
    ]
  },




  //* ------------------------ profile ------------------------
  {
    path: 'profile',
    component: UserProfileComponent,
    canMatch: [
      AuthenticatedGuard,
      NotAdminGuard, // Aseguramos que el usuario esté autenticado para acceder a esta ruta
    ],
  },
  //* ------------------------ rutas por defecto y wildcard ------------------------
  // Redirección a landing si la ruta está vacía
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  // Redirección a landing si la ruta no existe
  { path: '**', redirectTo: 'landing' },
]
