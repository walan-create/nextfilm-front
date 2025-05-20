import { Routes } from "@angular/router";


export const authRoutes:Routes = [
  {
    path: '',
    //component: ,
    children:[
      //Ruta para el login
      {
        path: 'login',
        //component: ,
      },
      //Ruta para el registro
      {
        path:'register',
        //component: ,
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
