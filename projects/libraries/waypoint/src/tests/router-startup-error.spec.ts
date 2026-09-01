import {
  Component,
} from '@angular/core';
import {
  TestBed,
} from '@angular/core/testing';
import {
  provideRouter,
  RouterOutlet,
  routeSlot,
} from '@epikodelabs/waypoint';

import {
  ensureAngularTestEnvironment,
} from './angular-testbed.init';

ensureAngularTestEnvironment();

@Component({
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
class HostComponent {}

describe('server-delivery startup errors', () => {
  it('renders the startup failure instead of leaving the outlet empty', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [
        ...provideRouter(
          [routeSlot('public')],
          {
            resolveRoutes: async () => {
              throw new Error(
                'artifact import failed',
              );
            },
          },
        ),
      ],
    }).compileComponents();

    const fixture =
      TestBed.createComponent(
        HostComponent,
      );

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(
      fixture.nativeElement.textContent,
    ).toContain(
      'Page failed to load',
    );

    expect(
      fixture.nativeElement.textContent,
    ).toContain(
      'artifact import failed',
    );
  });
});