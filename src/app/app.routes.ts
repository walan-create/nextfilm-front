import { Routes } from '@angular/router';
import { NotAuthenticatedGuard } from '@auth/guards/not-authenticated.guard';
import { LandingComponent } from './pages/landing/landing.component';
import { MovieInfoComponent } from './pages/movie-info/movie-info.component';
import { HomeComponent } from './pages/home/home.component';
import { MoviesAdminComponent } from './pages/movies-admin/movies-admin.component';
import { MoviesComponent } from './pages/movies/movies.component';
import { MovieCreatePageComponent } from './pages/movie-create-page/movie-create-page.component';

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
    component: MovieInfoComponent,
    canMatch: [
      //NotAuthenticatedGuard,
    ],
  },
  {
    path: 'movies/create',
    component: MovieCreatePageComponent,
    canMatch: [
      //NotAuthenticatedGuard,
    ],
  },
  //* ------------------------ Rent ------------------------
  {
    path: 'rentals', // Para ver la información de los alquileres y las reservas (ADMIN)
    component: HomeComponent, //TODO cambiar componente
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
    path: 'profile', // Para que el usuario vea sus reservas y alquileres
    component: HomeComponent, //TODO cambiar componente cuando esté creado
  },
  //* ------------------------ rutas por defecto y wildcard ------------------------
  // Redirección a landing si la ruta está vacía
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  // Redirección a landing si la ruta no existe
  { path: '**', redirectTo: 'landing' },
];
