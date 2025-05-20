import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { AppLayoutComponent } from "./layout/app-layout/app-layout.component";

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, AppLayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'nextfilm-front';
}
