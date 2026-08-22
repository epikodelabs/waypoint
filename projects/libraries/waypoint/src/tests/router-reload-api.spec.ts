import {
  RouterReloadError,
  type RouterReloadOptions,
  type RouterReloadReason,
} from '@epikodelabs/waypoint';

describe('router reload public API', () => {
  it('exports the reload contract from the primary entry point', () => {
    const reason: RouterReloadReason = 'reset';
    const options: RouterReloadOptions = {
      reason,
      target: '/app',
    };

    expect(options.reason).toBe('reset');
    expect(new RouterReloadError(503).status).toBe(503);
  });

  it('rejects unsafe server-provided reload locations through the router implementation contract', () => {
    const error = new RouterReloadError(403);
    expect(error.message).toContain('403');
    expect(error.name).toBe('RouterReloadError');
  });
});
