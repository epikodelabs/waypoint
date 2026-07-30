import { Component } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import {
  BrowserTestingModule,
  platformBrowserTesting,
} from '@angular/platform-browser/testing';
import {
  provideStreamixRouter,
  route,
  RouterLink,
  RouterOutlet,
  StreamixRouter,
  type StreamixRoutes,
} from 'aether-secure-router';

@Component({
  standalone: true,
  template: '<h1>Home</h1>',
})
class HomeComponent {}

@Component({
  standalone: true,
  template: '<h1>About</h1>',
})
class AboutComponent {}

@Component({
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  template: `
    <a id="about-link" routerLink="/about">About</a>
    <router-outlet></router-outlet>
  `,
})
class RouterLinkHostComponent {}

describe('RouterLink', () => {
  beforeAll(() => {
    try {
      getTestBed().platform;
    } catch {
      TestBed.initTestEnvironment(
        BrowserTestingModule,
        platformBrowserTesting(),
      );
    }
  });

  beforeEach(() => {
    TestBed.resetTestingModule();
    window.history.replaceState(null, '', '/');
  });

  it('renders hrefs and navigates on click', async () => {
    const routes = [
      route('/', HomeComponent),
      route('/about', AboutComponent),
    ] as const satisfies StreamixRoutes;

    await TestBed.configureTestingModule({
      imports: [RouterLinkHostComponent],
      providers: [...provideStreamixRouter(routes)],
    }).compileComponents();

    const fixture = TestBed.createComponent(
      RouterLinkHostComponent,
    );
    const router = TestBed.inject(StreamixRouter);

    fixture.detectChanges();
    await new Promise(resolve => setTimeout(resolve, 0));
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector(
      '#about-link',
    ) as HTMLAnchorElement | null;

    expect(link).not.toBeNull();
    expect(link?.getAttribute('href')).toBe('/about');

    link?.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        button: 0,
      }),
    );

    await new Promise(resolve => setTimeout(resolve, 0));
    fixture.detectChanges();

    expect(router.state.path).toBe('/about');
    expect(fixture.nativeElement.innerHTML).toContain('About');
  });
});
