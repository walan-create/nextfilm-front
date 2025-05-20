import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  // authService = inject(AuthService);

  router = inject(Router);

  // Señal para almacenar la ruta actual
  currentRoute = signal<string>('');

  ngOnInit(): void {
    // Detectar cambios en la ruta
    this.router.events.subscribe(() => {
      this.updateCurrentRoute();
    });

    // Inicializar la ruta actual
    this.updateCurrentRoute();
  }

  private updateCurrentRoute(): void {
    this.currentRoute.set(this.router.url); // Actualiza la señal con la ruta actual
  }
}
