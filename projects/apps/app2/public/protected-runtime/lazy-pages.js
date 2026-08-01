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

export const ReportsPage =
  readRuntime().components.ReportsPage;
