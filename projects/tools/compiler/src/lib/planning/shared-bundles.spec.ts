import { planSharedBundle } from './shared-bundles';

const domain = (
  roles: readonly string[] = [],
  permissions: readonly string[] = [],
  allowAnonymous = false,
) => ({ roles, permissions, allowAnonymous });

describe('authorization-aware shared bundles', () => {
  it('shares dependencies between consumers with the same audience', () => {
    const result = planSharedBundle([
      { artifactKey: 'admin-users', authorization: domain(['admin']) },
      { artifactKey: 'admin-audit', authorization: domain(['admin']) },
    ]);

    expect(result?.authorization).toEqual(domain(['admin']));
  });

  it('uses a safe weaker dependency domain for nested consumers', () => {
    const result = planSharedBundle([
      { artifactKey: 'application', authorization: domain(['user']) },
      { artifactKey: 'administration', authorization: domain(['user', 'admin']) },
    ]);

    expect(result?.authorization).toEqual(domain(['user']));
  });

  it('duplicates instead of sharing across incomparable audiences', () => {
    const result = planSharedBundle([
      { artifactKey: 'administration', authorization: domain(['admin']) },
      { artifactKey: 'finance', authorization: domain(['finance']) },
    ]);

    expect(result).toBeUndefined();
  });

  it('never hoists authenticated code into a public shared bundle', () => {
    const result = planSharedBundle([
      { artifactKey: 'public', authorization: domain([], [], true) },
      { artifactKey: 'admin', authorization: domain(['admin']) },
    ]);

    expect(result).toBeUndefined();
  });
});
