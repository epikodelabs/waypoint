import type { Type } from '@angular/core';

import {
  frame,
  lazyFrame,
  route,
} from '../lib/route-builders';
import type {
  InferFrameData,
  InferRoutePreparedData,
} from '../lib/navigation-definitions';

function expectType<T>(_value: T): void {}

class ProjectPage {}

interface Project {
  readonly id: number;
  readonly name: string;
}

describe('typed frame preparation', () => {
  it('preserves prepare handlers at runtime', async () => {
    const project: Project = {
      id: 7,
      name: 'Waypoint',
    };

    const view = frame(ProjectPage, {
      prepare: [
        async () => ({ project }),
        () => ({ permissions: ['read'] as const }),
      ],
    });

    const first = await view.prepare?.[0]?.({} as never);
    const second = await view.prepare?.[1]?.({} as never);

    expect(first).toEqual({ project });
    expect(second).toEqual({ permissions: ['read'] });
  });

  it('supports the same inference for lazy frames', () => {
    const view = lazyFrame(
      async () => ProjectPage,
      {
        prepare: [
          () => ({ projectId: 42 }),
        ],
        afterEnter: [activated => {
          const projectId: number = activated.data.projectId;
          expect(projectId).toBe(42);
        }],
      },
    );

    expect(view.kind).toBe('frame');
  });
});

const project: Project = {
  id: 1,
  name: 'Typed preparation',
};

const projectFrame = frame(ProjectPage as Type<unknown>, {
  prepare: [
    async () => ({ project }),
    () => ({ permissions: ['read', 'write'] as const }),
  ],

  afterEnter: [activated => {
    expectType<string>(activated.data.project.name);
    expectType<'read' | 'write'>(activated.data.permissions[0]);

    // @ts-expect-error prepare did not provide a customer value
    activated.data.customer;
  }],

  beforeLeave: [active => {
    expectType<number>(active.data.project.id);
    return true;
  }],
});

const projectRoute = route('/projects/:projectId', projectFrame, {
  name: 'project',
});

type ProjectFrameData = InferFrameData<typeof projectFrame>;
type ProjectRouteData = InferRoutePreparedData<typeof projectRoute>;

const frameData: ProjectFrameData = {
  project,
  permissions: ['read', 'write'],
};

const routeData: ProjectRouteData = frameData;
expectType<ProjectRouteData>(routeData);
