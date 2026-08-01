import {
  frame,
  layout,
  route,
} from '/protected-runtime/route-builders.js';
import {
  DemoShellComponent,
  EditorPage,
  EditorSidebarComponent,
} from '/protected-runtime/demo-pages.js';
import {
  confirmDraftDiscard,
} from '/protected-runtime/route-hooks.js';
import {
  s,
} from '/protected-runtime/schema.js';

const branch = Object.freeze([
  layout('/app', DemoShellComponent, [
    route(
      '/editor/:draftId',
      frame(EditorPage, {
        beforeLeave: [confirmDraftDiscard],
      }),
      {
        name: 'editor',
        paramsSchema: {
          draftId: s.number({
            min: 1,
          }),
        },
        querySchema: {
          mode: s.string('write'),
        },
      },
    ),
    route('/editor/:draftId', EditorSidebarComponent, {
      outlet: 'sidebar',
    }),
  ]),
]);

export default branch;
