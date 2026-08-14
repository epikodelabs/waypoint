import {
  canContainAuthorizationDomain,
  commonAuthorizationDomain,
} from './authorization-domain';

describe('Artifact Plan v2 authorization', () => {
  it('allows a stricter audience to consume code from a weaker requirement set', () => {
    const user = commonAuthorizationDomain([{ roles: ['user'] } as any]);
    const userAdmin = commonAuthorizationDomain([{ roles: ['user', 'admin'] } as any]);

    expect(canContainAuthorizationDomain(userAdmin, user)).toBeTrue();
    expect(canContainAuthorizationDomain(user, userAdmin)).toBeFalse();
  });

  it('does not rank unrelated roles', () => {
    const admin = commonAuthorizationDomain([{ roles: ['admin'] } as any]);
    const finance = commonAuthorizationDomain([{ roles: ['finance'] } as any]);

    expect(canContainAuthorizationDomain(admin, finance)).toBeFalse();
    expect(canContainAuthorizationDomain(finance, admin)).toBeFalse();
  });

  it('does not allow protected code into an anonymous artifact', () => {
    const publicDomain = commonAuthorizationDomain([{ allowAnonymous: true } as any]);
    const admin = commonAuthorizationDomain([{ roles: ['admin'] } as any]);

    expect(canContainAuthorizationDomain(publicDomain, admin)).toBeFalse();
  });
});
