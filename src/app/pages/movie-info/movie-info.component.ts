import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-movie-info',
  imports: [],
  templateUrl: './movie-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieInfoComponent { }
