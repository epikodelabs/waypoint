/*
When loading the authored entry source:

const sourceFile = program.getSourceFile(planned.entry);
if (!sourceFile) ...

const routesExport = selectNavigationExport(
  sourceFile,
  planned.routesExport,
);

Use `routesExport` for the existing static evaluator/export lookup.

`planned.routesExport` becomes optional. Selection order:

1. explicit configured export;
2. exactly one discovered navigation root;
3. otherwise diagnostic/error.
*/
