function component(name) {
  return Object.freeze({
    kind: 'component',
    name,
  });
}

export const ReportsPage = component('ReportsPage');
