/*
Replace root-export-centric resolution with navigation-module resolution.

OLD conceptual flow:
  entry file
    -> select routesExport
    -> evaluate one NavigationTree
    -> separately discover contributions

NEW:
  entry file
    -> collectNavigationModuleProgram(program, entry)
    -> evaluate every exported navigation tree
    -> evaluate every exported routesFor contribution
    -> merge trees into one authored root tree
    -> keep contributions separate
    -> addImplicitRootSlots()
    -> continue semantic/IR pipeline

Pseudo-code:

const moduleProgram = collectNavigationModuleProgram(
  tsProgram,
  planned.entry,
);

const rootTrees = await Promise.all(
  moduleProgram.trees.map(source =>
    evaluateNavigationTreeExport(source),
  ),
);

const contributions = await Promise.all(
  moduleProgram.contributions.map(source =>
    evaluateContributionExport(source),
  ),
);

const rootTree = mergeRootNavigationTrees(rootTrees);

program = createSemanticNavigationProgram(
  rootTree,
  contributions,
);

program = addImplicitRootSlots(program).program;

`routesExport` is only retained temporarily for compatibility:
if supplied, restrict collection to that explicit tree export plus all
contribution exports.
*/
