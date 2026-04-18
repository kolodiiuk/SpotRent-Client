import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { LocaleService } from './services/locale.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class App {
  constructor(private locale: LocaleService) { }
}
