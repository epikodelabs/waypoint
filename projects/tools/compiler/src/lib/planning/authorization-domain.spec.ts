import {
  canContainAuthorizationDomain,
  normalizeAuthorizationDomain,
} from './authorization-domain';

describe('authorization domains', () => {
  it('allows stricter role requirements to contain weaker-domain code', () => {
    const application = normalizeAuthorizationDomain({
      roles: ['user'],
    });
    const administration = normalizeAuthorizationDomain({
      roles: ['user', 'admin'],
    });

    expect(canContainAuthorizationDomain(administration, application)).toBeTrue();
    expect(canContainAuthorizationDomain(application, administration)).toBeFalse();
  });

  it('does not invent an ordering between unrelated roles', () => {
    const finance = normalizeAuthorizationDomain({ roles: ['finance'] });
    const administration = normalizeAuthorizationDomain({ roles: ['admin'] });

    expect(canContainAuthorizationDomain(finance, administration)).toBeFalse();
    expect(canContainAuthorizationDomain(administration, finance)).toBeFalse();
  });

  it('keeps authenticated code out of anonymous domains', () => {
    const publicDomain = normalizeAuthorizationDomain({ allowAnonymous: true });
    const authenticated = normalizeAuthorizationDomain({ roles: ['user'] });

    expect(canContainAuthorizationDomain(publicDomain, authenticated)).toBeFalse();
  });
});
