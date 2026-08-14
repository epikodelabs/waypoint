export function withWaypointRuntimePolyfill(
  targetOptions: Record<string, unknown>,
  runtimeEntry: string,
): Record<string, unknown> {
  const current = targetOptions['polyfills'];
  const polyfills =
    typeof current === 'string'
      ? [current]
      : Array.isArray(current)
        ? current.filter((value): value is string => typeof value === 'string')
        : [];

  return {
    ...targetOptions,
    polyfills: [...polyfills, runtimeEntry],
  };
}
