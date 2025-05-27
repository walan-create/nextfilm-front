//mockup
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ServiceNameService {
  constructor() {}

  getAllUsers(): Observable<any[]> {
    const mockUsers = [
      { id: 1, name: 'Juan Pérez' },
      { id: 2, name: 'María García' },
      { id: 3, name: 'Carlos Sánchez' },{ id: 1, name: 'Juan Pérez' },
      { id: 2, name: 'María García' },
      { id: 3, name: 'Carlos Sánchez' },{ id: 1, name: 'Juan Pérez' },
      { id: 2, name: 'María García' },
      { id: 3, name: 'Carlos Sánchez' },{ id: 1, name: 'Juan Pérez' },
      { id: 2, name: 'María García' },
      { id: 3, name: 'Carlos Sánchez' },

    ];
    return of(mockUsers);
  }


}
