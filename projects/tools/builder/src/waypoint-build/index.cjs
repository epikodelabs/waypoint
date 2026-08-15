var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// projects/tools/builder/src/waypoint-build/index.ts
var index_exports = {};
__export(index_exports, {
  default: () => index_default
});
module.exports = __toCommonJS(index_exports);
var import_node_path6 = __toESM(require("node:path"));
var import_architect = require("@angular-devkit/architect");

// projects/tools/builder/src/compiler/analyze.ts
var import_node_fs = __toESM(require("node:fs"));
var import_node_path2 = __toESM(require("node:path"));

// projects/tools/builder/src/compiler/navigation-snapshot.ts
var import_promises = __toESM(require("node:fs/promises"));
var import_node_path = __toESM(require("node:path"));
var import_node_url = require("node:url");
var import_esbuild = require("esbuild");
var import_typescript = __toESM(require("typescript"));
async function loadNavigationSnapshot(projectRoot, entry, metadataRoot) {
  const routeFiles = await discoverRouteModules(
    import_node_path.default.join(projectRoot, "src"),
    entry
  );
  const generatedRoot = import_node_path.default.join(
    metadataRoot,
    "analysis"
  );
  const generatedSourceRoot = import_node_path.default.join(
    generatedRoot,
    "sources"
  );
  await import_promises.default.mkdir(
    generatedSourceRoot,
    { recursive: true }
  );
  const waypointStubFile = import_node_path.default.join(
    generatedSourceRoot,
    "waypoint-stub.ts"
  );
  await import_promises.default.writeFile(
    waypointStubFile,
    waypointStubSource(),
    "utf8"
  );
  const transformedModules = await Promise.all(
    [entry, ...routeFiles].map(
      (file, index) => writeTransformedRouteModule(
        file,
        import_node_path.default.join(
          generatedSourceRoot,
          `module-${index}.ts`
        ),
        waypointStubFile
      )
    )
  );
  const [transformedEntry, ...transformedRoutes] = transformedModules;
  const sourceFile = import_node_path.default.join(
    generatedRoot,
    "navigation-snapshot.entry.ts"
  );
  const bundleFile = import_node_path.default.join(
    generatedRoot,
    "navigation-snapshot.mjs"
  );
  const imports = transformedRoutes.map(
    (file, index) => `import * as routeModule${index} from ${JSON.stringify(asImportPath(file))};`
  );
  const moduleDescriptors = routeFiles.map(
    (file, index) => `{ sourceFile: ${JSON.stringify(file)}, exports: routeModule${index} }`
  );
  await import_promises.default.writeFile(
    sourceFile,
    [
      `import { routes as rootRoutes } from ${JSON.stringify(asImportPath(transformedEntry))};`,
      ...imports,
      "",
      `export default {`,
      `  rootRoutes,`,
      `  modules: [${moduleDescriptors.join(",")}],`,
      `};`,
      ""
    ].join("\n"),
    "utf8"
  );
  await (0, import_esbuild.build)({
    entryPoints: [sourceFile],
    outfile: bundleFile,
    bundle: true,
    platform: "node",
    format: "esm",
    target: "node22",
    sourcemap: false,
    logLevel: "silent"
  });
  const loaded = await import(`${(0, import_node_url.pathToFileURL)(bundleFile).href}?t=${Date.now()}`);
  const payload = loaded.default;
  if (!Array.isArray(payload.rootRoutes)) {
    throw new Error(
      `Waypoint entry "${entry}" did not export a NavigationTree named "routes".`
    );
  }
  const contributions = [];
  for (const module2 of payload.modules ?? []) {
    if (typeof module2.sourceFile !== "string" || !module2.exports || typeof module2.exports !== "object") {
      continue;
    }
    for (const [exportName, value] of Object.entries(
      module2.exports
    )) {
      if (!isContribution(value)) continue;
      contributions.push(Object.freeze({
        definition: value,
        sourceFile: module2.sourceFile,
        exportName
      }));
    }
  }
  return Object.freeze({
    rootRoutes: Object.freeze([...payload.rootRoutes]),
    contributions: Object.freeze(contributions)
  });
}
async function discoverRouteModules(sourceRoot, entry) {
  const files = [];
  async function visit(directory) {
    let entries;
    try {
      entries = await import_promises.default.readdir(
        directory,
        { withFileTypes: true }
      );
    } catch {
      return;
    }
    for (const item of entries) {
      const absolute = import_node_path.default.join(
        directory,
        item.name
      );
      if (item.isDirectory()) {
        await visit(absolute);
        continue;
      }
      if (!item.isFile() || !item.name.endsWith(".routes.ts") || import_node_path.default.resolve(absolute) === import_node_path.default.resolve(entry) || item.name.endsWith(".spec.ts")) {
        continue;
      }
      files.push(import_node_path.default.resolve(absolute));
    }
  }
  await visit(sourceRoot);
  return Object.freeze(
    files.sort()
  );
}
async function writeTransformedRouteModule(sourcePath, outputPath, waypointStubFile) {
  const sourceText = await import_promises.default.readFile(
    sourcePath,
    "utf8"
  );
  const sourceFile = import_typescript.default.createSourceFile(
    sourcePath,
    sourceText,
    import_typescript.default.ScriptTarget.Latest,
    true,
    import_typescript.default.ScriptKind.TS
  );
  let cursor = 0;
  let transformed = "";
  for (const statement of sourceFile.statements) {
    if (!import_typescript.default.isImportDeclaration(statement)) {
      continue;
    }
    transformed += sourceText.slice(
      cursor,
      statement.getFullStart()
    );
    transformed += transformImportDeclaration(
      statement,
      outputPath,
      waypointStubFile
    );
    cursor = statement.getEnd();
  }
  transformed += sourceText.slice(cursor);
  transformed = transformed.replace(
    /\bimport\s*\(/g,
    "__waypointDynamicImport("
  );
  const prelude = [
    `const __waypointStubValue = new Proxy(function () {}, {`,
    `  get() { return __waypointStubValue; },`,
    `  apply() { return undefined; },`,
    `  construct() { return {}; },`,
    `});`,
    `const __waypointDynamicImport = async () => ({});`,
    ""
  ].join("\n");
  await import_promises.default.writeFile(
    outputPath,
    `${prelude}${transformed}`,
    "utf8"
  );
  return outputPath;
}
function transformImportDeclaration(statement, outputPath, waypointStubFile) {
  const specifier = statement.moduleSpecifier.text;
  const clause = statement.importClause;
  if (!clause || clause.isTypeOnly) {
    return "";
  }
  if (specifier === "@epikodelabs/waypoint") {
    const relative = toRelativeImport(
      outputPath,
      waypointStubFile
    );
    return rewriteImportSpecifier(
      clause,
      relative
    );
  }
  return stubImportBindings(clause);
}
function rewriteImportSpecifier(clause, specifier) {
  const parts = [];
  if (clause.name) {
    parts.push(clause.name.text);
  }
  if (clause.namedBindings && import_typescript.default.isNamespaceImport(
    clause.namedBindings
  )) {
    parts.push(
      `* as ${clause.namedBindings.name.text}`
    );
  } else if (clause.namedBindings && import_typescript.default.isNamedImports(
    clause.namedBindings
  )) {
    parts.push(
      `{ ${clause.namedBindings.elements.map(
        (element) => element.propertyName ? `${element.propertyName.text} as ${element.name.text}` : element.name.text
      ).join(", ")} }`
    );
  }
  if (parts.length === 0) {
    return "";
  }
  return `import ${parts.join(", ")} from ${JSON.stringify(asImportPath(specifier))};`;
}
function stubImportBindings(clause) {
  const statements = [];
  if (clause.name) {
    statements.push(
      `const ${clause.name.text} = __waypointStubValue;`
    );
  }
  if (clause.namedBindings && import_typescript.default.isNamespaceImport(
    clause.namedBindings
  )) {
    statements.push(
      `const ${clause.namedBindings.name.text} = __waypointStubValue;`
    );
  } else if (clause.namedBindings && import_typescript.default.isNamedImports(
    clause.namedBindings
  )) {
    for (const element of clause.namedBindings.elements) {
      statements.push(
        `const ${element.name.text} = __waypointStubValue;`
      );
    }
  }
  return statements.join("\n");
}
function toRelativeImport(fromFile, toFile) {
  const relative = import_node_path.default.relative(
    import_node_path.default.dirname(fromFile),
    toFile
  );
  return relative.startsWith(".") ? relative : `./${relative}`;
}
function waypointStubSource() {
  return [
    `export function routeSlot(id) {`,
    `  return { kind: 'route-slot', id };`,
    `}`,
    ``,
    `export function routesFor(slotId, id, entries) {`,
    `  return { kind: 'route-contribution', slotId, id, entries };`,
    `}`,
    ``,
    `export function route(path, view, options = {}) {`,
    `  return { kind: 'route', path, ...options };`,
    `}`,
    ``,
    `export function redirectRoute(path, redirectTo, options = {}) {`,
    `  return { kind: 'redirect', path, redirectTo, ...options };`,
    `}`,
    ``,
    `export function layout(path, view, entries, options = {}) {`,
    `  return { kind: 'layout', path, entries, ...options };`,
    `}`,
    ``,
    `export function lazyRoute(path, loader, options = {}) {`,
    `  return { kind: 'route', path, ...options };`,
    `}`,
    ``,
    `export function frame(component, options = {}) {`,
    `  return { component, ...options };`,
    `}`,
    ``,
    `export const s = Object.freeze({`,
    `  number(options = {}) { return { kind: 'number', ...options }; },`,
    `  string(value) { return { kind: 'string', value }; },`,
    `  array() { return { kind: 'array' }; },`,
    `  optional(value) { return { kind: 'optional', value }; },`,
    `  boolean() { return { kind: 'boolean' }; },`,
    `});`,
    ""
  ].join("\n");
}
function isContribution(value) {
  if (!value || typeof value !== "object") return false;
  const candidate = value;
  return candidate.kind === "route-contribution" && typeof candidate.slotId === "string" && candidate.slotId.trim().length > 0 && typeof candidate.id === "string" && candidate.id.trim().length > 0 && Array.isArray(candidate.entries);
}
function asImportPath(file) {
  return file.split(import_node_path.default.sep).join("/");
}

// projects/tools/builder/src/compiler/server-plan.ts
function createServerRoutePlan(snapshot) {
  const contributionsBySlot = indexContributions(
    snapshot.contributions
  );
  const contributionSources = new Map(
    snapshot.contributions.map(
      (contribution) => [
        contribution.definition.id,
        contribution
      ]
    )
  );
  const context = {
    contributionsBySlot,
    contributionSources,
    artifacts: /* @__PURE__ */ new Map(),
    branches: [],
    active: /* @__PURE__ */ new Set(),
    nextBranchId: 1
  };
  compileEntries(
    snapshot.rootRoutes,
    "/",
    [],
    context
  );
  for (const contribution of snapshot.contributions) {
    if (!context.artifacts.has(
      contribution.definition.id
    )) {
      throw new Error(
        `Route contribution "${contribution.definition.id}" targets unreachable slot "${contribution.definition.slotId}".`
      );
    }
  }
  return Object.freeze({
    branches: Object.freeze(
      [...context.branches]
    ),
    artifacts: Object.freeze(
      [...context.artifacts.values()].map(
        (artifact) => Object.freeze({
          kind: artifact.kind,
          artifactKey: artifact.artifactKey,
          routeSetId: artifact.routeSetId,
          dependencies: Object.freeze(
            [...artifact.dependencies]
          ),
          branchIds: Object.freeze(
            [...artifact.branchIds]
          ),
          sourceFile: artifact.sourceFile,
          exportName: artifact.exportName
        })
      )
    )
  });
}
function compileEntries(entries, parentPath, inheritedPolicies, context, provenance) {
  for (const entry of entries) {
    if (!entry || typeof entry !== "object") {
      continue;
    }
    if (entry.kind === "layout") {
      compileEntries(
        entry.entries ?? [],
        joinRoutePath(
          parentPath,
          String(entry.path ?? "")
        ),
        appendPolicy(
          inheritedPolicies,
          entry.policy
        ),
        context,
        provenance
      );
      continue;
    }
    if (entry.kind === "route-slot") {
      const slotId = String(entry.id ?? "").trim();
      for (const contribution of context.contributionsBySlot.get(
        slotId
      ) ?? []) {
        compileContribution(
          contribution,
          parentPath,
          inheritedPolicies,
          context,
          provenance
        );
      }
      continue;
    }
    if (entry.kind !== "route" && entry.kind !== "redirect") {
      continue;
    }
    if (entry.kind === "route" && typeof entry.outlet === "string" && entry.outlet.length > 0) {
      continue;
    }
    if (!provenance) {
      continue;
    }
    const pathValue = joinRoutePath(
      parentPath,
      String(entry.path ?? "")
    );
    const id = `${provenance.contributionId}:${context.nextBranchId++}`;
    const branch = Object.freeze({
      id,
      kind: entry.kind,
      path: pathValue,
      staticPrefix: staticPrefix(pathValue),
      name: typeof entry.name === "string" ? entry.name : void 0,
      redirectTo: entry.kind === "redirect" ? compileRedirect(
        parentPath,
        String(entry.redirectTo ?? "")
      ) : void 0,
      policies: Object.freeze(
        appendPolicy(
          inheritedPolicies,
          entry.policy
        )
      ),
      routeSetId: provenance.contributionId
    });
    context.branches.push(
      branch
    );
    const artifact = context.artifacts.get(
      provenance.contributionId
    );
    artifact?.branchIds.push(id);
  }
}
function compileContribution(contribution, parentPath, inheritedPolicies, context, parentProvenance) {
  const id = String(
    contribution.definition.id
  ).trim();
  if (context.active.has(id)) {
    throw new Error(
      `Recursive route contribution "${id}" was detected.`
    );
  }
  let artifact = context.artifacts.get(id);
  if (!artifact) {
    artifact = {
      kind: "route",
      artifactKey: id,
      routeSetId: id,
      dependencies: /* @__PURE__ */ new Set(),
      branchIds: [],
      sourceFile: contribution.sourceFile,
      exportName: contribution.exportName
    };
    context.artifacts.set(
      id,
      artifact
    );
  }
  if (parentProvenance && parentProvenance.contributionId !== id) {
    artifact.dependencies.add(
      parentProvenance.contributionId
    );
  }
  context.active.add(id);
  try {
    compileEntries(
      contribution.definition.entries,
      parentPath,
      inheritedPolicies,
      context,
      {
        contributionId: id
      }
    );
  } finally {
    context.active.delete(id);
  }
}
function indexContributions(contributions) {
  const output = /* @__PURE__ */ new Map();
  const ids = /* @__PURE__ */ new Set();
  for (const contribution of contributions) {
    const id = String(
      contribution.definition.id
    ).trim();
    const slotId = String(
      contribution.definition.slotId
    ).trim();
    if (ids.has(id)) {
      throw new Error(
        `Duplicate route contribution id "${id}".`
      );
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
      roles: value.roles ? Object.freeze(
        [...value.roles]
      ) : void 0,
      permissions: value.permissions ? Object.freeze(
        [...value.permissions]
      ) : void 0
    })
  ]);
}
function isPolicy(value) {
  if (!value || typeof value !== "object") {
    return false;
  }
  const candidate = value;
  return (candidate.allowAnonymous === void 0 || typeof candidate.allowAnonymous === "boolean") && (candidate.roles === void 0 || Array.isArray(candidate.roles) && candidate.roles.every(
    (item) => typeof item === "string"
  )) && (candidate.permissions === void 0 || Array.isArray(
    candidate.permissions
  ) && candidate.permissions.every(
    (item) => typeof item === "string"
  ));
}
function joinRoutePath(parent, child) {
  const left = normalizePath(parent);
  if (!child.trim()) {
    return left;
  }
  const right = child.trim().replace(
    /^\/+|\/+$/g,
    ""
  );
  if (!right) return left;
  return normalizePath(
    left === "/" ? `/${right}` : `${left}/${right}`
  );
}
function normalizePath(value) {
  const normalized = `/${value}`.replace(/\/+/g, "/").replace(/\/+$/g, "");
  return normalized || "/";
}
function compileRedirect(parentPath, target) {
  if (/^[A-Za-z][A-Za-z\d+.-]*:/.test(
    target
  ) || target.startsWith("//") || target.startsWith("/")) {
    return target;
  }
  return joinRoutePath(
    parentPath,
    target
  );
}
function staticPrefix(routePath) {
  const segments = normalizePath(routePath).split("/").filter(Boolean);
  const staticSegments = [];
  for (const segment of segments) {
    if (segment.startsWith(":")) {
      break;
    }
    staticSegments.push(segment);
  }
  return staticSegments.length > 0 ? `/${staticSegments.join("/")}` : "/";
}
function commonStaticPrefix(branches) {
  if (branches.length === 0) {
    return "/";
  }
  const split = branches.map(
    (branch) => branch.staticPrefix.split("/").filter(Boolean)
  );
  const first = split[0];
  const common = [];
  for (let index = 0; index < first.length; index++) {
    const value = first[index];
    if (split.every(
      (segments) => segments[index] === value
    )) {
      common.push(value);
      continue;
    }
    break;
  }
  return common.length > 0 ? `/${common.join("/")}` : "/";
}

// projects/tools/builder/src/compiler/analyze.ts
async function analyze(options) {
  const entry = import_node_path2.default.resolve(
    options.entry
  );
  const diagnostics = [];
  const projectRoot = findProjectRoot(entry);
  const planned = Object.freeze({
    entry,
    projectRoot,
    serverOutput: import_node_path2.default.resolve(
      options.serverOutput
    ),
    artifactsOutput: import_node_path2.default.resolve(
      options.artifactsOutput
    ),
    buildManifestOutput: options.buildManifestOutput ? import_node_path2.default.resolve(
      options.buildManifestOutput
    ) : void 0
  });
  if (!import_node_fs.default.existsSync(entry)) {
    diagnostics.push({
      level: "error",
      code: "WPT1001",
      message: `Waypoint navigation entry does not exist: ${entry}`
    });
    return Object.freeze({
      success: false,
      diagnostics: Object.freeze(diagnostics),
      planned
    });
  }
  try {
    const metadataRoot = import_node_path2.default.dirname(
      planned.serverOutput
    );
    const snapshot = await loadNavigationSnapshot(
      projectRoot,
      entry,
      metadataRoot
    );
    const plan = createServerRoutePlan(
      snapshot
    );
    if (plan.artifacts.length === 0) {
      diagnostics.push({
        level: "warning",
        code: "WPT2001",
        message: "No routesFor() contributions were discovered."
      });
    }
    return Object.freeze({
      success: true,
      diagnostics: Object.freeze(diagnostics),
      planned,
      snapshot,
      plan
    });
  } catch (error) {
    diagnostics.push({
      level: "error",
      code: "WPT1002",
      message: error instanceof Error ? error.message : String(error)
    });
    return Object.freeze({
      success: false,
      diagnostics: Object.freeze(diagnostics),
      planned
    });
  }
}
function findProjectRoot(entry) {
  let current = import_node_path2.default.dirname(entry);
  while (true) {
    if (import_node_fs.default.existsSync(
      import_node_path2.default.join(
        current,
        "tsconfig.app.json"
      )
    )) {
      return current;
    }
    const parent = import_node_path2.default.dirname(current);
    if (parent === current) {
      throw new Error(
        `Could not locate Angular project root for "${entry}".`
      );
    }
    current = parent;
  }
}

// projects/tools/builder/src/compiler/build-layout.ts
var import_node_path3 = __toESM(require("node:path"));
function createBuildLayout(outputPath) {
  const root = import_node_path3.default.resolve(outputPath);
  const metadataRoot = import_node_path3.default.join(
    root,
    ".waypoint"
  );
  return Object.freeze({
    root,
    publicRoot: import_node_path3.default.join(
      root,
      "browser"
    ),
    protectedRoot: import_node_path3.default.join(
      root,
      "protected"
    ),
    metadataRoot,
    manifest: import_node_path3.default.join(
      metadataRoot,
      "manifest.json"
    ),
    serverRoot: import_node_path3.default.join(
      metadataRoot,
      "server"
    )
  });
}

// projects/tools/builder/src/compiler/prepare-build.ts
var import_promises3 = __toESM(require("node:fs/promises"));
var import_node_path5 = __toESM(require("node:path"));

// projects/tools/builder/src/compiler/server-output.ts
var import_node_crypto = __toESM(require("node:crypto"));
var import_promises2 = __toESM(require("node:fs/promises"));
var import_node_path4 = __toESM(require("node:path"));
async function publishServerRouteOutput(plan, serverRoot) {
  const absoluteRoot = import_node_path4.default.resolve(serverRoot);
  const temporaryRoot = `${absoluteRoot}.tmp-${process.pid}-${Date.now()}`;
  await import_promises2.default.rm(
    temporaryRoot,
    {
      recursive: true,
      force: true
    }
  );
  await import_promises2.default.mkdir(
    import_node_path4.default.join(
      temporaryRoot,
      "shards"
    ),
    {
      recursive: true
    }
  );
  const shardDescriptors = [];
  for (const artifact of plan.artifacts) {
    const branches = plan.branches.filter(
      (branch) => branch.routeSetId === artifact.routeSetId
    );
    const shardFile = `shards/${safeFileName(artifact.routeSetId)}.json`;
    await import_promises2.default.writeFile(
      import_node_path4.default.join(
        temporaryRoot,
        shardFile
      ),
      JSON.stringify(
        {
          version: 1,
          branches
        },
        null,
        2
      ) + "\n",
      "utf8"
    );
    shardDescriptors.push({
      prefix: commonStaticPrefix(branches),
      file: shardFile
    });
  }
  const artifacts = plan.artifacts.map(
    (artifact) => ({
      kind: artifact.kind,
      artifactKey: artifact.artifactKey,
      routeSetId: artifact.routeSetId,
      dependencies: artifact.dependencies,
      branchIds: artifact.branchIds
      /*
       * Browser artifact publication is a later builder phase. Keep file/hash
       * absent until that phase supplies a real physical artifact. The server
       * can still match and authorize routes from this metadata, and it will
       * refuse module delivery until a physical artifact is published.
       */
    })
  );
  const index = {
    version: 1,
    generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    shards: shardDescriptors.sort(
      (left, right) => right.prefix.length - left.prefix.length
    ),
    artifacts,
    generationHash: import_node_crypto.default.createHash("sha256").update(
      JSON.stringify({
        shards: shardDescriptors,
        artifacts
      })
    ).digest("hex").slice(0, 16)
  };
  await import_promises2.default.writeFile(
    import_node_path4.default.join(
      temporaryRoot,
      "server-index.json"
    ),
    JSON.stringify(
      index,
      null,
      2
    ) + "\n",
    "utf8"
  );
  await import_promises2.default.rm(
    absoluteRoot,
    {
      recursive: true,
      force: true
    }
  );
  await import_promises2.default.rename(
    temporaryRoot,
    absoluteRoot
  );
  return Object.freeze({
    indexPath: import_node_path4.default.join(
      absoluteRoot,
      "server-index.json"
    )
  });
}
function safeFileName(value) {
  const normalized = value.replace(
    /[^A-Za-z0-9._-]+/g,
    "-"
  );
  return normalized || "routes";
}

// projects/tools/builder/src/compiler/prepare-build.ts
async function prepareBuild(analysis, options) {
  if (!analysis.success || !analysis.plan) {
    throw new Error(
      "Cannot prepare Waypoint build from failed analysis."
    );
  }
  const metadataRoot = import_node_path5.default.resolve(
    options.metadataRoot
  );
  const hostRoot = import_node_path5.default.join(
    metadataRoot,
    "host"
  );
  const routesEntry = import_node_path5.default.join(
    hostRoot,
    "routes.ts"
  );
  const runtimeEntry = import_node_path5.default.join(
    hostRoot,
    "runtime.js"
  );
  await import_promises3.default.mkdir(
    hostRoot,
    {
      recursive: true
    }
  );
  await import_promises3.default.writeFile(
    routesEntry,
    [
      `import { routeSlot, type NavigationTree } from '@epikodelabs/waypoint';`,
      ``,
      `export const routes = [`,
      `  routeSlot('public'),`,
      `  routeSlot('application'),`,
      `] as const satisfies NavigationTree;`,
      ``
    ].join("\n"),
    "utf8"
  );
  await import_promises3.default.writeFile(
    runtimeEntry,
    [
      `// Waypoint generated host runtime bootstrap.`,
      ``
    ].join("\n"),
    "utf8"
  );
  return Object.freeze({
    host: Object.freeze({
      routesEntry,
      runtimeEntry
    }),
    async publish() {
      await publishServerRouteOutput(
        analysis.plan,
        analysis.planned.serverOutput
      );
      if (analysis.planned.buildManifestOutput) {
        await import_promises3.default.mkdir(
          import_node_path5.default.dirname(
            analysis.planned.buildManifestOutput
          ),
          {
            recursive: true
          }
        );
        await import_promises3.default.writeFile(
          analysis.planned.buildManifestOutput,
          JSON.stringify(
            {
              version: 1,
              entry: analysis.planned.entry,
              routeSets: analysis.plan.artifacts.map(
                (artifact) => ({
                  artifactKey: artifact.artifactKey,
                  routeSetId: artifact.routeSetId,
                  dependencies: artifact.dependencies,
                  branches: artifact.branchIds
                })
              )
            },
            null,
            2
          ) + "\n",
          "utf8"
        );
      }
      return {
        success: true,
        diagnostics: []
      };
    },
    async rollback() {
    },
    async dispose() {
    }
  });
}

// projects/tools/builder/src/waypoint-build/index.ts
async function execute(options, context) {
  try {
    if (!context.target) {
      throw new Error(
        "Waypoint build requires an Architect project target context."
      );
    }
    const workspaceRoot = context.workspaceRoot;
    const projectMetadata = await context.getProjectMetadata(context.target.project);
    const projectRoot = typeof projectMetadata["root"] === "string" ? projectMetadata["root"] : "";
    const angularOptions = angularApplicationOptions(options);
    const outputPath = resolveOutputPath(
      workspaceRoot,
      angularOptions["outputPath"]
    );
    const layout = createBuildLayout(outputPath);
    const waypoint = options.waypoint ?? {};
    const entry = import_node_path6.default.resolve(
      workspaceRoot,
      projectRoot,
      waypoint.entry ?? "src/app/app.routes.ts"
    );
    const analysis = await analyze({
      entry,
      serverOutput: layout.serverRoot,
      artifactsOutput: layout.protectedRoot,
      buildManifestOutput: waypoint.buildManifest === false ? void 0 : layout.buildManifest,
      routesExport: waypoint.routesExport,
      profile: waypoint.profile
    });
    reportDiagnostics(
      analysis.diagnostics,
      context
    );
    if (!analysis.success || !analysis.plan) {
      return {
        success: false,
        error: "Waypoint analysis failed."
      };
    }
    const build2 = await prepareBuild(
      analysis,
      {
        metadataRoot: layout.metadataRoot
      }
    );
    try {
      const delegatedOptions = {
        ...angularOptions,
        fileReplacements: [
          ...normalizeReplacements(
            angularOptions["fileReplacements"]
          ),
          {
            replace: angularWorkspacePath(
              workspaceRoot,
              analysis.planned.entry
            ),
            with: angularWorkspacePath(
              workspaceRoot,
              build2.host.routesEntry
            )
          }
        ],
        polyfills: [
          ...normalizePolyfills(
            angularOptions["polyfills"]
          ),
          angularWorkspacePath(
            workspaceRoot,
            build2.host.runtimeEntry
          )
        ]
      };
      const delegated = await context.scheduleBuilder(
        "@angular/build:application",
        delegatedOptions,
        {
          target: context.target
        }
      );
      try {
        const angularResult = await delegated.result;
        if (!angularResult.success) {
          await build2.rollback();
          return angularResult;
        }
      } finally {
        await delegated.stop();
      }
      const published = await build2.publish();
      reportDiagnostics(
        published.diagnostics,
        context
      );
      return published.success ? { success: true } : {
        success: false,
        error: "Waypoint publication failed."
      };
    } finally {
      await build2.dispose();
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    context.logger.error(message);
    return {
      success: false,
      error: message
    };
  }
}
function angularWorkspacePath(workspaceRoot, absolutePath) {
  const relative = import_node_path6.default.relative(
    workspaceRoot,
    absolutePath
  );
  if (relative === ".." || relative.startsWith(`..${import_node_path6.default.sep}`) || import_node_path6.default.isAbsolute(relative)) {
    throw new Error(
      `Waypoint generated path "${absolutePath}" is outside workspace "${workspaceRoot}".`
    );
  }
  return relative.split(import_node_path6.default.sep).join("/");
}
function angularApplicationOptions(options) {
  const {
    waypoint: _waypoint,
    ...angular
  } = options;
  return angular;
}
function normalizeReplacements(value) {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object" || typeof item.replace !== "string" || typeof item.with !== "string") {
      return [];
    }
    return [{
      replace: item.replace,
      with: item.with
    }];
  });
}
function normalizePolyfills(value) {
  if (typeof value === "string") {
    return [value];
  }
  return Array.isArray(value) ? value.filter(
    (item) => typeof item === "string"
  ) : [];
}
function resolveOutputPath(workspaceRoot, value) {
  if (typeof value === "string" && value.length > 0) {
    return import_node_path6.default.resolve(
      workspaceRoot,
      value
    );
  }
  if (value && typeof value === "object" && typeof value.base === "string") {
    return import_node_path6.default.resolve(
      workspaceRoot,
      value.base
    );
  }
  throw new Error(
    "Waypoint build requires Angular application outputPath."
  );
}
function reportDiagnostics(diagnostics, context) {
  for (const diagnostic of diagnostics) {
    const text = diagnostic.code ? `${diagnostic.code}: ${diagnostic.message}` : diagnostic.message;
    if (diagnostic.level === "error") {
      context.logger.error(text);
    } else if (diagnostic.level === "warning") {
      context.logger.warn(text);
    } else {
      context.logger.info(text);
    }
  }
}
var index_default = (0, import_architect.createBuilder)(
  execute
);
