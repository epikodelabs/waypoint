/*
After existing structural/artifact validation:

diagnostics.push(
  ...validateAuthorizationMonotonicity(plan),
);

This belongs in Artifact Plan validation, not server runtime validation.

Reason:
the compiler already has the complete ownership tree and normalized
authorization domains. A weakening edge is a build-time security-model error.
*/
