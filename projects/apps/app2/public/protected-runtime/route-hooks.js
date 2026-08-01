function activeUser(context) {
  return context?.session?.user ?? {
    id: 'anonymous',
    name: 'Anonymous',
    role: 'guest',
    canAccessAdmin: false,
    preferredView: 'overview',
    focusFilters: Object.freeze(['open']),
    favoriteDraftId: 0,
  };
}

export function prepareWorkspace(context) {
  const projectId = Number(
    context?.params?.projectId ?? 0,
  );
  const user = activeUser(context);

  return {
    snapshot: Object.freeze({
      projectId,
      loadOrder: Number(
        context?.session?.workspaceLoads ?? 1,
      ),
      canOpenAdmin: Boolean(
        user.canAccessAdmin,
      ),
      activeUserName: user.name,
      activeUserRole: user.role,
      recommendedDraftId: Number(
        user.favoriteDraftId ?? 0,
      ),
      suggestedFilters: Object.freeze(
        Array.isArray(user.focusFilters)
          ? [...user.focusFilters]
          : ['open'],
      ),
    }),
  };
}

export function confirmDraftDiscard(context) {
  const dirty = Boolean(
    context?.session?.draftDirty,
  );

  if (!dirty) {
    return true;
  }

  if (typeof globalThis.confirm === 'function') {
    return globalThis.confirm(
      'Leave the draft and discard unsaved changes?',
    );
  }

  return true;
}

export function requireAdminAccess(context) {
  if (Boolean(context?.session?.adminAccess)) {
    return true;
  }

  return {
    redirectTo: '/app/settings?section=access',
    replace: true,
  };
}

export function prepareAdminAudit(context) {
  const user = activeUser(context);

  return {
    audit: Object.freeze({
      accessGranted: Boolean(
        context?.session?.adminAccess,
      ),
      reviewedBy: String(
        user.email ?? `${user.id}@waypoint.test`,
      ),
      reviewerRole: user.role,
      workspaceLoads: Number(
        context?.session?.workspaceLoads ?? 0,
      ),
    }),
  };
}
