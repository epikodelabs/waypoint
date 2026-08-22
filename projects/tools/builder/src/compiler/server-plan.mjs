export function createServerRoutePlan(snapshot) {
    const contributionsBySlot = indexContributions(snapshot.contributions);
    const contributionSources = new Map(snapshot.contributions.map(contribution => [
        contribution.definition.id,
        contribution,
    ]));
    const context = {
        contributionsBySlot,
        contributionSources,
        artifacts: new Map(),
        branches: [],
        active: new Set(),
        nextBranchId: 1,
    };
    compileEntries(snapshot.rootRoutes, '/', [], context);
    // Every discovered contribution must have been reachable from a root slot.
    for (const contribution of snapshot.contributions) {
        if (!context.artifacts.has(contribution.definition.id)) {
            throw new Error(`Route contribution "${contribution.definition.id}" targets ` +
                `unreachable slot "${contribution.definition.slotId}".`);
        }
    }
    return Object.freeze({
        branches: Object.freeze([...context.branches]),
        artifacts: Object.freeze([...context.artifacts.values()].map(artifact => Object.freeze({
            kind: artifact.kind,
            artifactKey: artifact.artifactKey,
            routeSetId: artifact.routeSetId,
            dependencies: Object.freeze([...artifact.dependencies]),
            branchIds: Object.freeze([...artifact.branchIds]),
            sourceFile: artifact.sourceFile,
            exportName: artifact.exportName,
        }))),
    });
}
function compileEntries(entries, parentPath, inheritedPolicies, context, provenance) {
    for (const entry of entries) {
        if (!entry || typeof entry !== 'object') {
            continue;
        }
        if (entry.kind === 'layout') {
            compileEntries(entry.entries ?? [], joinRoutePath(parentPath, String(entry.path ?? '')), appendPolicy(inheritedPolicies, entry.policy), context, provenance);
            continue;
        }
        if (entry.kind === 'route-slot') {
            const slotId = String(entry.id ?? '').trim();
            for (const contribution of context.contributionsBySlot.get(slotId) ?? []) {
                compileContribution(contribution, parentPath, inheritedPolicies, context, provenance);
            }
            continue;
        }
        if (entry.kind !== 'route'
            && entry.kind !== 'redirect') {
            continue;
        }
        // Named-outlet routes are browser rendering details, not separate server
        // destinations. Emitting them would duplicate the same URL and can weaken
        // policy matching if their options differ.
        if (entry.kind === 'route'
            && typeof entry.outlet === 'string'
            && entry.outlet.length > 0) {
            continue;
        }
        if (!provenance) {
            // Root-host entries are intentionally not deliverable protected artifacts.
            continue;
        }
        const pathValue = joinRoutePath(parentPath, String(entry.path ?? ''));
        const id = `${provenance.contributionId}:${context.nextBranchId++}`;
        const branch = Object.freeze({
            id,
            kind: entry.kind,
            path: pathValue,
            staticPrefix: staticPrefix(pathValue),
            name: typeof entry.name === 'string'
                ? entry.name
                : undefined,
            redirectTo: entry.kind === 'redirect'
                ? compileRedirect(parentPath, String(entry.redirectTo ?? ''))
                : undefined,
            policies: Object.freeze(appendPolicy(inheritedPolicies, entry.policy)),
            routeSetId: provenance.contributionId,
        });
        context.branches.push(branch);
        const artifact = context.artifacts.get(provenance.contributionId);
        artifact?.branchIds.push(id);
    }
}
function compileContribution(contribution, parentPath, inheritedPolicies, context, parentProvenance) {
    const id = String(contribution.definition.id).trim();
    if (context.active.has(id)) {
        throw new Error(`Recursive route contribution "${id}" was detected.`);
    }
    let artifact = context.artifacts.get(id);
    if (!artifact) {
        artifact = {
            kind: 'route',
            artifactKey: id,
            routeSetId: id,
            dependencies: new Set(),
            branchIds: [],
            sourceFile: contribution.sourceFile,
            exportName: contribution.exportName,
        };
        context.artifacts.set(id, artifact);
    }
    if (parentProvenance
        && parentProvenance.contributionId
            !== id) {
        artifact.dependencies.add(parentProvenance.contributionId);
    }
    context.active.add(id);
    try {
        compileEntries(contribution.definition.entries, parentPath, inheritedPolicies, context, {
            contributionId: id,
        });
    }
    finally {
        context.active.delete(id);
    }
}
function indexContributions(contributions) {
    const output = new Map();
    const ids = new Set();
    for (const contribution of contributions) {
        const id = String(contribution.definition.id).trim();
        const slotId = String(contribution.definition.slotId).trim();
        if (ids.has(id)) {
            throw new Error(`Duplicate route contribution id "${id}".`);
        }
        ids.add(id);
        const current = output.get(slotId) ?? [];
        current.push(contribution);
        output.set(slotId, current);
    }
    return output;
}
function appendPolicy(policies, value) {
    if (!isPolicy(value)) {
        return policies;
    }
    return Object.freeze([
        ...policies,
        Object.freeze({
            allowAnonymous: value.allowAnonymous,
            roles: value.roles
                ? Object.freeze([...value.roles])
                : undefined,
            permissions: value.permissions
                ? Object.freeze([...value.permissions])
                : undefined,
        }),
    ]);
}
function isPolicy(value) {
    if (!value || typeof value !== 'object') {
        return false;
    }
    const candidate = value;
    return (candidate.allowAnonymous === undefined
        || typeof candidate.allowAnonymous === 'boolean') && (candidate.roles === undefined
        || (Array.isArray(candidate.roles)
            && candidate.roles.every((item) => typeof item === 'string'))) && (candidate.permissions === undefined
        || (Array.isArray(candidate.permissions)
            && candidate.permissions.every((item) => typeof item === 'string')));
}
function joinRoutePath(parent, child) {
    const left = normalizePath(parent);
    if (!child.trim()) {
        return left;
    }
    const right = child.trim().replace(/^\/+|\/+$/g, '');
    if (!right)
        return left;
    return normalizePath(left === '/'
        ? `/${right}`
        : `${left}/${right}`);
}
function normalizePath(value) {
    const normalized = `/${value}`
        .replace(/\/+/g, '/')
        .replace(/\/+$/g, '');
    return normalized || '/';
}
function compileRedirect(parentPath, target) {
    if (/^[A-Za-z][A-Za-z\d+.-]*:/.test(target)
        || target.startsWith('//')
        || target.startsWith('/')) {
        return target;
    }
    return joinRoutePath(parentPath, target);
}
function staticPrefix(routePath) {
    const segments = normalizePath(routePath)
        .split('/')
        .filter(Boolean);
    const staticSegments = [];
    for (const segment of segments) {
        if (segment.startsWith(':')) {
            break;
        }
        staticSegments.push(segment);
    }
    return staticSegments.length > 0
        ? `/${staticSegments.join('/')}`
        : '/';
}
export function commonStaticPrefix(branches) {
    if (branches.length === 0) {
        return '/';
    }
    const split = branches.map(branch => branch.staticPrefix
        .split('/')
        .filter(Boolean));
    const first = split[0];
    const common = [];
    for (let index = 0; index < first.length; index++) {
        const value = first[index];
        if (split.every(segments => segments[index] === value)) {
            common.push(value);
            continue;
        }
        break;
    }
    return common.length > 0
        ? `/${common.join('/')}`
        : '/';
}
