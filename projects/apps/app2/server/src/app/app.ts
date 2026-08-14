import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@epikodelabs/waypoint';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}