import { Component } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import {
  BrowserTestingModule,
  platformBrowserTesting,
} from '@angular/platform-browser/testing';
import { StreamixOutlet } from 'aether-secure-router';

@Component({
  standalone: true,
  imports: [StreamixOutlet],
  template: '<streamix-outlet />',
})
class OutletHost {}

describe('StreamixOutlet isolation', () => {
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
    expect(StreamixOutlet).toBeTruthy();
    expect((StreamixOutlet as any).ɵdir).toBeTruthy();

    await TestBed.configureTestingModule({
      imports: [OutletHost],
    }).compileComponents();

    expect().nothing();
  });
});
