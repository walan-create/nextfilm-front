import { Component } from '@angular/core';
import { AppLayoutComponent } from "./layout/app-layout/app-layout.component";
import { MoviesAdminComponent } from "./pages/movies-admin/movies-admin.component";

@Component({
  selector: 'app-root',
  imports: [AppLayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'nextfilm-front';
}
