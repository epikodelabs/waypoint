import {
  layout,
  redirectRoute,
} from '/protected-runtime/route-builders.js';
import {
  DemoShellComponent,
} from '/protected-runtime/demo-pages.js';

const branch = Object.freeze([
  layout('/app', DemoShellComponent, [
    redirectRoute(
      '',
      '/app/workspace/101?view=overview&page=1&filters=open&filters=recent',
      {
        name: 'appHome',
      },
    ),
  ]),
]);

export default branch;
