import {
  Component,
  effect,
  inject,
} from '@angular/core';
import {
  RouterOutlet,
  StreamixRouterLink,
} from '@epikodelabs/waypoint';
import { DemoSessionService } from '../../../app1/src/app/demo-session.service';
import { registerProtectedRouteRuntime } from './protected-route-runtime';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    StreamixRouterLink,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly session = inject(DemoSessionService);

  constructor() {
    registerProtectedRouteRuntime();

    if (typeof document === 'undefined') {
      return;
    }

    effect(() => {
      const identity =
        this.session.currentUserId();

      document.cookie =
        `identity=${encodeURIComponent(identity)}; Path=/; SameSite=Lax`;
    });
  }
}
