/*
After the semantic program has been assembled from authored root navigation and
discovered routesFor() exports:

const implicit = addImplicitRootSlots(program);
program = implicit.program;

Optionally emit an info/profile diagnostic containing implicit.implicitSlotIds.

IMPORTANT:
This happens only after all explicit routeSlot() declarations are known.
No explicit slot is replaced.

Existing "unknown contribution slot" validation is therefore still useful:
after synthesis, any remaining unknown target is a genuine compiler bug or an
unsupported contribution source.
*/
