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
var import_node_path4 = __toESM(require("node:path"));
var import_architect = require("@angular-devkit/architect");

// projects/tools/builder/src/compiler/analyze.ts
var import_node_fs = __toESM(require("node:fs"));
var import_node_path = __toESM(require("node:path"));
async function analyze(options) {
  const entry = import_node_path.default.resolve(
    options.entry
  );
  const diagnostics = [];
  if (!import_node_fs.default.existsSync(entry)) {
    diagnostics.push({
      level: "error",
      code: "WPT1001",
      message: `Waypoint navigation entry does not exist: ${entry}`
    });
  }
  const plan = diagnostics.length === 0 ? Object.freeze({
    entry,
    serverOutput: import_node_path.default.resolve(
      options.serverOutput
    ),
    artifactsOutput: import_node_path.default.resolve(
      options.artifactsOutput
    )
  }) : void 0;
  return Object.freeze({
    success: diagnostics.length === 0,
    diagnostics: Object.freeze(
      diagnostics
    ),
    planned: Object.freeze({
      entry,
      serverOutput: import_node_path.default.resolve(
        options.serverOutput
      ),
      artifactsOutput: import_node_path.default.resolve(
        options.artifactsOutput
      ),
      buildManifestOutput: options.buildManifestOutput ? import_node_path.default.resolve(
        options.buildManifestOutput
      ) : void 0
    }),
    plan
  });
}

// projects/tools/builder/src/compiler/build-layout.ts
var import_node_path2 = __toESM(require("node:path"));
function createBuildLayout(outputPath) {
  const root = import_node_path2.default.resolve(outputPath);
  const metadataRoot = import_node_path2.default.join(
    root,
    ".waypoint"
  );
  return Object.freeze({
    root,
    publicRoot: import_node_path2.default.join(
      root,
      "browser"
    ),
    protectedRoot: import_node_path2.default.join(
      root,
      "protected"
    ),
    metadataRoot,
    manifest: import_node_path2.default.join(
      metadataRoot,
      "manifest.json"
    ),
    serverRoot: import_node_path2.default.join(
      metadataRoot,
      "server"
    )
  });
}

// projects/tools/builder/src/compiler/prepare-build.ts
var import_promises = __toESM(require("node:fs/promises"));
var import_node_path3 = __toESM(require("node:path"));
async function prepareBuild(analysis, options) {
  if (!analysis.success || !analysis.plan) {
    throw new Error(
      "Cannot prepare Waypoint build from failed analysis."
    );
  }
  const metadataRoot = import_node_path3.default.resolve(
    options.metadataRoot
  );
  const hostRoot = import_node_path3.default.join(
    metadataRoot,
    "host"
  );
  const routesEntry = import_node_path3.default.join(
    hostRoot,
    "routes.ts"
  );
  const runtimeEntry = import_node_path3.default.join(
    hostRoot,
    "runtime.js"
  );
  await import_promises.default.mkdir(
    hostRoot,
    {
      recursive: true
    }
  );
  await import_promises.default.writeFile(
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
  await import_promises.default.writeFile(
    runtimeEntry,
    [
      `// Waypoint builder runtime bootstrap.`,
      ``
    ].join("\n"),
    "utf8"
  );
  let published = false;
  return Object.freeze({
    host: Object.freeze({
      routesEntry,
      runtimeEntry
    }),
    async publish() {
      const serverRoot = import_node_path3.default.resolve(
        analysis.planned.serverOutput
      );
      await import_promises.default.mkdir(
        serverRoot,
        {
          recursive: true
        }
      );
      const serverIndex = import_node_path3.default.join(
        serverRoot,
        "server-index.json"
      );
      await import_promises.default.writeFile(
        serverIndex,
        JSON.stringify(
          {
            version: 1,
            generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
            shards: [],
            artifacts: []
          },
          null,
          2
        ) + "\n",
        "utf8"
      );
      if (analysis.planned.buildManifestOutput) {
        await import_promises.default.mkdir(
          import_node_path3.default.dirname(
            analysis.planned.buildManifestOutput
          ),
          {
            recursive: true
          }
        );
        await import_promises.default.writeFile(
          analysis.planned.buildManifestOutput,
          JSON.stringify(
            {
              version: 1,
              entry: analysis.planned.entry,
              serverOutput: analysis.planned.serverOutput,
              artifactsOutput: analysis.planned.artifactsOutput
            },
            null,
            2
          ) + "\n",
          "utf8"
        );
      }
      published = true;
      return {
        success: true,
        diagnostics: []
      };
    },
    async rollback() {
      if (!published) {
        return;
      }
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
    const entry = import_node_path4.default.resolve(
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
    const build = await prepareBuild(
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
              build.host.routesEntry
            )
          }
        ],
        polyfills: [
          ...normalizePolyfills(
            angularOptions["polyfills"]
          ),
          angularWorkspacePath(
            workspaceRoot,
            build.host.runtimeEntry
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
          await build.rollback();
          return angularResult;
        }
      } finally {
        await delegated.stop();
      }
      const published = await build.publish();
      reportDiagnostics(
        published.diagnostics,
        context
      );
      return published.success ? { success: true } : {
        success: false,
        error: "Waypoint publication failed."
      };
    } finally {
      await build.dispose();
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
  const relative = import_node_path4.default.relative(
    workspaceRoot,
    absolutePath
  );
  if (relative === ".." || relative.startsWith(`..${import_node_path4.default.sep}`) || import_node_path4.default.isAbsolute(relative)) {
    throw new Error(
      `Waypoint generated path "${absolutePath}" is outside workspace "${workspaceRoot}".`
    );
  }
  return relative.split(import_node_path4.default.sep).join("/");
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
    return import_node_path4.default.resolve(
      workspaceRoot,
      value
    );
  }
  if (value && typeof value === "object" && typeof value.base === "string") {
    return import_node_path4.default.resolve(
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
