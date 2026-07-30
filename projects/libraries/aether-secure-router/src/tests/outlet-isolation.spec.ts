import { Component } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import {
  BrowserTestingModule,
  platformBrowserTesting,
} from '@angular/platform-browser/testing';
import { RouterOutlet } from 'aether-secure-router';

@Component({
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet></router-outlet>',
})
class OutletHost {}

describe('RouterOutlet isolation', () => {
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

  it('should compile as a standalone directive', async () => {
    expect(RouterOutlet).toBeTruthy();
    expect((RouterOutlet as any).ɵdir).toBeTruthy();

    await TestBed.configureTestingModule({
      imports: [OutletHost],
    }).compileComponents();

    expect(true).toBe(true);
  });
});
