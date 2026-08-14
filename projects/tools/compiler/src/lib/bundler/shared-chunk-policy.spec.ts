import { decideSharedChunk } from './shared-chunk-policy';

describe('shared chunk policy', () => {
  it('prefers duplication when sharing would broaden authorization', () => {
    const result = decideSharedChunk({
      moduleId: 'feature-utils',
      consumers: [
        {
          artifactKey: 'admin',
          authorization: {
            allowAnonymous: false,
            roles: ['admin'],
            permissions: [],
          },
        },
        {
          artifactKey: 'finance',
          authorization: {
            allowAnonymous: false,
            roles: ['finance'],
            permissions: [],
          },
        },
      ],
    });

    expect(result.mode).toBe('duplicate');
  });
});
