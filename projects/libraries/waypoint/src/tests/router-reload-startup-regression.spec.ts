import {
  RouterReloadError,
  type RouterReloadOptions,
  type RouterReloadReason,
} from '@epikodelabs/waypoint';

describe('router reload/startup regression', () => {
  it('exports the reload API', () => {
    const reason: RouterReloadReason = 'reset';
    const options: RouterReloadOptions = {
      reason,
      target: '/',
    };

    expect(options.reason).toBe('reset');
    expect(new RouterReloadError(503).status).toBe(503);
  });
});
