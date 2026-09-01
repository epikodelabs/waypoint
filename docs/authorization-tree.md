# Authorization tree

Nested `routesFor()` ownership is monotonic.

A nested route set inherits the complete context of the slot it targets,
including inherited policy context.

Waypoint therefore enforces:

```text
parent audience
    ⊇
child audience
```

or, phrased in requirements:

```text
child requirements
    >=
parent requirements
```

A child may preserve or strengthen authorization:

```text
application
  roles: user
      ↓
administration
  roles: user + admin
      ↓
security
  roles: user + admin
  permissions: security:manage
```

Valid.

A child may not weaken authorization:

```text
administration
  roles: user + admin
      ↓
application
  roles: user
```

Invalid: WPT3211.

The rule does not assign ranks to role names.

These domains are incomparable:

```text
roles: admin
roles: finance
```

so neither may be nested beneath the other unless their inherited policy chain
makes the resulting child domain a true subset of the parent audience.

This invariant aligns three structures:

```text
routesFor ownership tree
        =
artifact dependency tree
        =
authorization monotonicity tree
```

That gives the compiler a simple security guarantee:

> walking deeper into protected route ownership can never reveal code to a
> broader audience.