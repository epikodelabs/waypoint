function marker(kind, config = {}) {
  return Object.freeze({
    kind,
    ...config,
  });
}

export const s = Object.freeze({
  string(defaultValue) {
    return marker('string', {
      default: defaultValue,
    });
  },
  number(config = {}) {
    return marker('number', config);
  },
  array() {
    return marker('array');
  },
  boolean() {
    return marker('boolean');
  },
  optional(inner) {
    return marker('optional', {
      inner,
    });
  },
});
