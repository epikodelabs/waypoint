const {
  createBuilder,
  scheduleTargetAndForget,
  targetFromTargetString,
  targetStringFromTarget,
} = require('@angular-devkit/architect');
const { from } = require('rxjs');
const { concatMap } = require('rxjs/operators');

const CUSTOM_OPTION_KEYS = new Set([
  'delegateTarget',
  'prerequisiteTargets',
  'targetConfiguration',
]);

module.exports = createBuilder((options, context) => {
  const delegateTarget = resolveTarget(
    options.delegateTarget,
    options.targetConfiguration,
    context,
  );
  const prerequisiteTargets = (
    options.prerequisiteTargets ?? []
  ).map(specifier =>
    resolveTarget(
      specifier,
      options.targetConfiguration,
      context,
    ),
  );
  const delegateOverrides = collectDelegateOverrides(
    options,
  );

  return from(
    runPrerequisites(prerequisiteTargets, context),
  ).pipe(
    concatMap(() =>
      scheduleTargetAndForget(
        context,
        delegateTarget,
        delegateOverrides,
      ),
    ),
  );
});

async function runPrerequisites(targets, context) {
  for (const target of targets) {
    context.reportStatus(
      `Running ${targetStringFromTarget(target)}.`,
    );

    const run = await context.scheduleTarget(target);

    try {
      const result = await run.result;
      if (!result.success) {
        throw new Error(
          `Target ${targetStringFromTarget(target)} failed.`,
        );
      }
    } finally {
      await run.stop();
    }
  }
}

function resolveTarget(
  specifier,
  targetConfiguration,
  context,
) {
  const target = targetFromTargetString(
    specifier,
    context.target?.project,
  );

  if (!target.configuration && targetConfiguration) {
    target.configuration = targetConfiguration;
  } else if (
    !target.configuration
    && context.target?.configuration
  ) {
    target.configuration =
      context.target.configuration;
  }

  return target;
}

function collectDelegateOverrides(options) {
  const overrides = {};

  for (const [key, value] of Object.entries(options)) {
    if (!CUSTOM_OPTION_KEYS.has(key)) {
      overrides[key] = value;
    }
  }

  return overrides;
}