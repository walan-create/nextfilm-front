import { Component } from '@angular/core';
import { AppLayoutComponent } from "./layout/app-layout/app-layout.component";

@Component({
  selector: 'app-root',
  imports: [AppLayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'nextfilm-front';
}
