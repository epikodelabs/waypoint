import type {
  NavigationTree,
  RouteContributionDefinition,
  RouteSlotDefinition,
} from './navigation-definitions';

export function routeSlot<
  const TId extends string,
>(
  id: TId,
): RouteSlotDefinition<TId> {
  return Object.freeze({
    kind: 'route-slot',
    id: normalizeRouteIdentity(id, 'Route slot') as TId,
  });
}

export function routesFor<
  const TSlotId extends string,
  const TId extends string,
  const TEntries extends NavigationTree,
>(
  slotId: TSlotId,
  id: TId,
  entries: TEntries,
): RouteContributionDefinition<TSlotId, TId, TEntries> {
  return Object.freeze({
    kind: 'route-contribution',
    slotId: normalizeRouteIdentity(
      slotId,
      'Route contribution slot',
    ) as TSlotId,
    id: normalizeRouteIdentity(
      id,
      'Route contribution',
    ) as TId,
    entries,
  });
}

export function normalizeRouteIdentity(
  value: string,
  label: string,
): string {
  const normalized = value.trim();

  if (!normalized) {
    throw new Error(`${label} id must not be empty.`);
  }

  return normalized;
}