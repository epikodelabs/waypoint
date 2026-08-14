/*
Remove from RouteCompilerOptions / PlannedCompilerOutputs:

  readonly hostModules?: readonly string[];

createHostModulePredicate() should no longer accept application-supplied
additional modules for the normal build path.

Identity-sensitive defaults remain compiler-owned:

  @angular/*
  @epikodelabs/waypoint

If Waypoint later supports user-defined singleton package identities, expose
that as an advanced builder/compiler policy—not application runtime code.
*/
