function readRuntime() {
  const runtime =
    globalThis.__app2ProtectedRouteRuntime;

  if (!runtime) {
    throw new Error(
      'Protected route runtime is not registered.',
    );
  }

  return runtime;
}

export const prepareWorkspace =
  readRuntime().hooks.prepareWorkspace;
export const confirmDraftDiscard =
  readRuntime().hooks.confirmDraftDiscard;
export const requireAdminAccess =
  readRuntime().hooks.requireAdminAccess;
export const prepareAdminAudit =
  readRuntime().hooks.prepareAdminAudit;
