import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, map, catchError, of, tap } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';

import { User } from '../interfaces/user.interface';
import { AuthResponse } from '../interfaces/auth-response.interface';
import { environment } from '../../../environments/environment.development';

// Definimos un tipo para representar los posibles estados de autenticación
type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
// Base URL para las solicitudes HTTP
const baseUrl = environment.baseUrl;

@Injectable({ providedIn: 'root' })
export class AuthService {
  //--------------- Señales y estado reactivo -------------------
  private _authStatus = signal<AuthStatus>('checking'); // Estado de autenticación
  private _user = signal<User | null>(null); // Datos del usuario autenticado
  private _token = signal<string | null>(localStorage.getItem('token')); // Token de autenticación

  // Inyección del servicio HttpClient para realizar solicitudes HTTP
  private http = inject(HttpClient);

  private checkStatusCache = new Map<AuthResponse, number>();

  //--------------- Recursos y computados -------------------
  // Recurso para verificar el estado de autenticación al montar el servicio
  checkStatusResource = rxResource({
    loader: () => this.checkStatus(),
  });

  // Computed para obtener el estado de autenticación de forma reactiva
  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'checking') return 'checking';
    if (this._user()) return 'authenticated';
    return 'not-authenticated';
  });

  // Computed para obtener los datos del usuario de forma reactiva
  user = computed<User | null>(() => this._user());

  // Computed para obtener el token de forma reactiva
  token = computed<string | null>(() => this._token());

  //--------------- Métodos principales -------------------

  // Método para iniciar sesión
  login(email: string, password: string): Observable<boolean> {
    // const auth: AuthResponse = {
    //   token: 'hola',
    //   user: {
    //     email: '',
    //     id: '',
    //     name: '',
    //     isAdmin: false,
    //   },
    // };

    // this.handleAuthSuccess(auth);
    // return of(true);
    return this.http
      .post<AuthResponse>(`${baseUrl}/auth/login`, {
        email: email,
        password: password,
      })
      .pipe(
        tap(resp => this.checkStatusCache.set(resp, new Date().getTime() )),
        tap((resp) => console.log(resp)),
        map((resp) => this.handleAuthSuccess(resp)), // Manejo de éxito
        catchError((error: any) => this.handleAuthError(error)) // Manejo de errores
      );
  }

  // Método para registrar un nuevo usuario
  register(email: string, password: string, name: string): Observable<boolean> {
    // const auth: AuthResponse = {
    //   token: 'hola',
    //   user: {
    //     email: '',
    //     id: '',
    //     name: '',
    //     isAdmin: false,
    //   },
    // };

    // this.handleAuthSuccess(auth);
    // return of(true);
    return this.http
      .post<AuthResponse>(`${baseUrl}/auth/register`, {
        email: email,
        password: password,
        name: name,
      })
      .pipe(
        tap(resp => this.checkStatusCache.set(resp, new Date().getTime() )),
        map((resp) => this.handleAuthSuccess(resp)),
        catchError((error: any) => this.handleAuthError(error))
      );
  }

  // Método para verificar el estado de autenticación
  checkStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.logout();
      return of(false);
    }


    const resp = this.comprobarCache(token);

    if(resp != false){
      this.handleAuthSuccess(resp);
      return of(true);
    }


    return this.http.post<AuthResponse>(`${baseUrl}/auth/checkStatus`,{token:token}).pipe(
      tap(resp => this.checkStatusCache.set(resp, new Date().getTime() )),
      map((resp) => this.handleAuthSuccess(resp)), // Manejo de éxito
      catchError((error: any) => this.handleAuthError(error)) // Manejo de errores
    );

    // const auth: AuthResponse = {
    //   token: 'hola',
    //   user: {
    //     email: '',
    //     id: '',
    //     name: '',
    //     isAdmin: false,
    //   },
    // };

    // this.handleAuthSuccess(auth);
    // return of(true);
  }


  private comprobarCache(token: string){
    const minutes = 15*60*1000;
    const now = new Date().getTime();

    for(let key of this.checkStatusCache.keys()) {
      if(key.token === token){
        const past = now - this.checkStatusCache.get(key)!
        if(past < minutes) {
          return key;
        }
      }
    }
    return false;
  }

  //----------------------------------

  // Manejo de éxito en las solicitudes de autenticación
  private handleAuthSuccess(resp: AuthResponse) {
    this._user.set(resp.user); // Guarda los datos del usuario
    this._authStatus.set('authenticated'); // Cambia el estado a autenticado
    this._token.set(resp.token); // Guarda el token
    localStorage.setItem('token', resp.token); // Persiste el token en el almacenamiento local
    return true;
  }

  // Manejo de errores en las solicitudes de autenticación
  private handleAuthError(error: any) {
    this.logout(); // Limpia el estado en caso de error
    return of(false); // Devuelve `false` como resultado
  }

  // Método para cerrar sesión
  logout() {
    this._user.set(null); // Limpia los datos del usuario
    this._token.set(null); // Limpia el token
    this._authStatus.set('not-authenticated'); // Cambia el estado a no autenticado
    localStorage.clear(); // Elimina todo el contenido del localStorage
    // localStorage.removeItem('token'); // Opcional: elimina el token del almacenamiento local
  }
}
