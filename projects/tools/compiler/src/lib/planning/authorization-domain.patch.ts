/*
Keep the authorization-domain semantics structural.

Do not introduce:
  admin > user
  finance > user
  superadmin > admin

Monotonicity is derived from audience containment, not role names.

Examples:

parent roles ['user']
child  roles ['user', 'admin']
  -> valid narrowing

parent roles ['admin']
child  roles ['finance']
  -> incomparable -> invalid nested edge

parent protected
child anonymous
  -> invalid broadening
*/
