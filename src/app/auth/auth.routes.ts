import { Routes } from "@angular/router";
import { AuthLayoutComponent } from "./layout/auth-layout/auth-layout.component";
import { LoginPageComponent } from "./pages/login-page/login-page.component";
import { RegisterPageComponent } from './pages/register-page/register-page.component';


export const authRoutes:Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children:[
      //Ruta para el login
      {
        path: 'login',
        component: LoginPageComponent,
      },
      //Ruta para el registro
      {
        path:'register',
        component: RegisterPageComponent,
      },
      //Ruta para por si dentro de auth no se encuentra algo o esta mal que redirija al login
      {
        path: '**',
        redirectTo: 'login'
      }
    ],
  }
];

export default authRoutes;
