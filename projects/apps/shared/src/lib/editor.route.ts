import { inject } from '@angular/core';
import {
  frame,
  route,
  s,
} from '@epikodelabs/waypoint';

import { EditorPage, EditorSidebarComponent } from '../../../app1/src/app/demo-pages';
import { DemoSessionService } from '../../../app1/src/app/demo-session.service';

export const editorRoute = route(
  '/editor/:draftId',
  frame(EditorPage, {
    beforeLeave: [
      () => {
        const session = inject(DemoSessionService);

        return !session.draftDirty()
          || window.confirm(
            'Leave the draft and discard unsaved changes?',
          );
      },
    ],
  }),
  {
    name: 'editor',
    paramsSchema: {
      draftId: s.number({ min: 1 }),
    },
    querySchema: {
      mode: s.string('write'),
    },
  },
);

export const editorSidebarRoute = route(
  '/editor/:draftId',
  EditorSidebarComponent,
  {
    outlet: 'sidebar',
  },
);

export const editorBranchRoutes = [
  editorRoute,
  editorSidebarRoute,
] as const;