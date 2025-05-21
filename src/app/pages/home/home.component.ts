import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'home',
  imports: [],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent { }
