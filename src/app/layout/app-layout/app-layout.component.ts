import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { Router, RouterOutlet } from '@angular/router';
import { FooterComponent } from "../../components/footer/footer.component";
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-layout',
  imports: [HeaderComponent, RouterOutlet, FooterComponent, NgClass],
  templateUrl: './app-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppLayoutComponent {
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
