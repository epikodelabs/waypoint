import {
  redirectRoute,
} from '/protected-runtime/route-builders.js';

const branch = Object.freeze([
  redirectRoute(
    '/legacy',
    '/app/workspace/101?view=activity&page=2&filters=legacy',
    {
      name: 'legacy',
    },
  ),
]);

export default branch;
