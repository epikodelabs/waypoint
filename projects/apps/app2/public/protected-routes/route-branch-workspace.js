import {
  frame,
  layout,
  route,
} from '/protected-runtime/route-builders.js';
import {
  DemoShellComponent,
  WorkspacePage,
  WorkspaceSidebarComponent,
} from '/protected-runtime/demo-pages.js';
import {
  prepareWorkspace,
} from '/protected-runtime/route-hooks.js';
import {
  s,
} from '/protected-runtime/schema.js';

const branch = Object.freeze([
  layout('/app', DemoShellComponent, [
    route(
      '/workspace/:projectId',
      frame(WorkspacePage, {
        prepare: [prepareWorkspace],
      }),
      {
        name: 'workspace',
        paramsSchema: {
          projectId: s.number({
            min: 1,
          }),
        },
        querySchema: {
          view: s.string('overview'),
          page: s.number({
            default: 1,
            min: 1,
          }),
          filters: s.array(),
          draft: s.optional(
            s.boolean(),
          ),
        },
      },
    ),
    route(
      '/workspace/:projectId',
      WorkspaceSidebarComponent,
      {
        outlet: 'sidebar',
      },
    ),
  ]),
]);

export default branch;
