import {
  route,
} from '/protected-runtime/route-builders.js';
import {
  IntroPage,
} from '/protected-runtime/demo-pages.js';

const branch = Object.freeze([
  route('/', IntroPage, {
    name: 'intro',
  }),
]);

export default branch;
