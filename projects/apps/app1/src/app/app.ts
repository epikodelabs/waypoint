import { Component } from '@angular/core';
import {
  RouterOutlet,
  StreamixRouterLink,
} from '@epikodelabs/waypoint';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    StreamixRouterLink,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
