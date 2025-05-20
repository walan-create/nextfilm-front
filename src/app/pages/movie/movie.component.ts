import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-movie',
  imports: [],
  templateUrl: './movie.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieComponent { }
