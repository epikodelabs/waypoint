/*
createHostModulePredicate() should no longer accept application configuration.

Compiler-owned identity-sensitive defaults:
  @angular/*
  @epikodelabs/waypoint

Any future additional singleton identities should be an advanced build policy,
not runtime hostModules plumbing.
*/
