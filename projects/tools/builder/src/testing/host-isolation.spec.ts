import path from 'node:path';

import { assertHostIsolation } from './assert-host-isolation';

describe('Waypoint host isolation', () => {
  it('keeps administration implementation out of public Angular output', async () => {
    const outputRoot = path.resolve('dist/projects/apps/app2/client');

    await assertHostIsolation(
      path.join(outputRoot, 'browser'),
      path.join(outputRoot, 'protected'),
      [
        {
          name: 'administration',
          marker: 'WAYPOINT_BUILD_SENTINEL_ADMIN_7f84e2c1',
        },
      ],
    );
  });
});