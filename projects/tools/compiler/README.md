# Route Compiler

`@epikodelabs/route-compiler` is the planned compiler package for deriving:

- server authorization/index metadata;
- named route catalogs;
- browser route entry modules;
- artifact manifests for protected route delivery.

This package is intentionally scaffolded as a plain Node/TypeScript project, not
an Angular project.

## Planned responsibilities

- parse authored route source;
- statically evaluate server-relevant fields such as `path`, `name`, and `policy`;
- emit server metadata in a language-neutral format;
- emit focused browser route entry modules;
- hand those entries off to a bundler step.

## Status

The current implementation provides:

- a typed programmatic API;
- a CLI entrypoint;
- compilation planning and output-path normalization.

Route AST parsing and artifact emission are not implemented yet.
