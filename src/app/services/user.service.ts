import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';




const baseUrl = environment.baseUrl;

@Injectable({providedIn: 'root'})
export class ServiceNameServices {
 constructor(private http: HttpClient) {}

  getAllUsers(): Observable<any> {
    return this.http.get(`${baseUrl}/auth/getUsers`);
  }




}
