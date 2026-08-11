import { Component } from '@angular/core';
import { RouterLink } from '@epikodelabs/waypoint';

@Component({
  selector: 'app-runtime-home-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="home">
      <p class="eyebrow">Runtime application</p>
      <h1>Protected route delivery</h1>
      <p>
        This application contains only the public shell. Protected pages,
        layouts, hooks, and routes are loaded from authorized compiler artifacts.
      </p>
      <div class="actions">
        <a [routerLink]="'/app/workspace/101?view=overview&page=1&filters=open'">
          Open workspace
        </a>
        <a [routerLink]="'/app/reports'">Open reports</a>
      </div>
    </section>
  `,
  styles: `
    .home {
      max-width: 88rem;
      margin: 0 auto;
      padding: clamp(1.5rem, 3vw, 3rem);
      border: 1px solid var(--border-color);
      border-radius: 2rem;
      background: var(--panel-color);
      box-shadow: 0 24px 64px rgb(18 31 56 / 0.08);
    }
    .eyebrow {
      margin: 0 0 0.75rem;
      color: var(--accent-deep);
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    h1 { margin: 0; font-size: clamp(2.2rem, 5vw, 4rem); }
    p { max-width: 48rem; line-height: 1.7; }
    .actions { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1.5rem; }
    a {
      display: inline-flex;
      align-items: center;
      min-height: 3rem;
      padding: 0.75rem 1rem;
      border: 1px solid rgb(43 92 230 / 0.18);
      border-radius: 999px;
      background: rgb(255 255 255 / 0.82);
      color: var(--ink-strong);
      font-weight: 600;
      text-decoration: none;
    }
  `,
})
export class RuntimeHomePage {}