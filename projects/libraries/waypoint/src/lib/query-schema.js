export const s = {
    string: (defaultValue) => ({
        _type: 'string',
        default: defaultValue,
    }),
    number: (opts) => ({
        _type: 'number',
        ...opts,
    }),
    boolean: (defaultValue) => ({
        _type: 'boolean',
        default: defaultValue,
    }),
    array: (defaultValue) => ({
        _type: 'array',
        default: defaultValue,
    }),
    date: (defaultValue) => ({
        _type: 'date',
        default: defaultValue,
    }),
    optional: (inner) => ({
        _type: 'optional',
        inner,
    }),
};
function parseValue(spec, raw) {
    if (raw === undefined) {
        if (spec._type === 'optional')
            return undefined;
        return undefined;
    }
    switch (spec._type) {
        case 'string':
            return raw;
        case 'number': {
            const value = Number(raw);
            if (Number.isNaN(value)) {
                if (spec.default !== undefined) {
                    return spec.default;
                }
                throw new Error(`Invalid number value "${raw}".`);
            }
            const min = spec.min ?? -Infinity;
            const max = spec.max ?? Infinity;
            return Math.max(min, Math.min(max, value));
        }
        case 'boolean':
            return raw === 'true' || raw === '1'
                ? true
                : raw === 'false' || raw === '0'
                    ? false
                    : (spec.default ?? false);
        case 'date': {
            const value = new Date(raw);
            if (!Number.isNaN(value.getTime())) {
                return value;
            }
            if (spec.default) {
                return new Date(spec.default.getTime());
            }
            throw new Error(`Invalid date value "${raw}".`);
        }
        case 'optional':
            return parseValue(spec.inner, raw);
        default:
            return raw;
    }
}
function getDefault(spec) {
    switch (spec._type) {
        case 'string':
            return spec.default ?? '';
        case 'number':
            return spec.default ?? 0;
        case 'boolean':
            return spec.default ?? false;
        case 'array':
            return Object.freeze([...(spec.default ?? [])]);
        case 'date':
            return spec.default
                ? new Date(spec.default.getTime())
                : new Date();
        case 'optional':
            return undefined;
        default:
            return undefined;
    }
}
function getParamDefault(spec) {
    switch (spec._type) {
        case 'string':
            return spec.default ?? '';
        case 'number':
            return spec.default ?? 0;
        case 'boolean':
            return spec.default ?? false;
        case 'date':
            return spec.default
                ? new Date(spec.default.getTime())
                : new Date();
        case 'optional':
            return undefined;
        default:
            return undefined;
    }
}
function parseQueryInternal(schema, url) {
    const result = {};
    for (const [key, spec] of Object.entries(schema)) {
        const allValues = url.searchParams.getAll(key);
        const raw = allValues[0];
        if (spec._type === 'array') {
            result[key] =
                allValues.length > 0
                    ? Object.freeze([...allValues])
                    : Object.freeze([...(spec.default ?? [])]);
            continue;
        }
        if (spec._type === 'optional' && raw === undefined) {
            continue;
        }
        const parsed = parseValue(spec, raw);
        result[key] = parsed !== undefined ? parsed : getDefault(spec);
    }
    return Object.freeze(result);
}
export function parseQuery(schema, url) {
    return parseQueryInternal(schema, url);
}
export function parseQueryRecord(schema, url) {
    return parseQueryInternal(schema, url);
}
export function parseParams(schema, params) {
    const result = {};
    for (const [key, spec] of Object.entries(schema)) {
        const raw = params[key];
        if (spec._type === 'optional' && raw === undefined) {
            continue;
        }
        const parsed = parseValue(spec, raw);
        result[key] = parsed !== undefined ? parsed : getParamDefault(spec);
    }
    return Object.freeze(result);
}
export function parseParamsRecord(schema, params) {
    const result = {};
    for (const [key, spec] of Object.entries(schema)) {
        const raw = params[key];
        if (spec._type === 'optional' && raw === undefined) {
            continue;
        }
        const parsed = parseValue(spec, raw);
        result[key] = parsed !== undefined ? parsed : getParamDefault(spec);
    }
    return Object.freeze(result);
}
function unwrapOptionalQuerySchema(schema) {
    let current = schema;
    while (current._type === 'optional') {
        current = current.inner;
    }
    return current;
}
export function serializeQuery(schema, values) {
    return serializeQueryRecord(schema, values);
}
export function serializeQueryRecord(schema, values) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(values)) {
        if (value === undefined) {
            continue;
        }
        const declared = schema[key];
        if (!declared) {
            continue;
        }
        const spec = unwrapOptionalQuerySchema(declared);
        if (spec._type === 'array' &&
            Array.isArray(value)) {
            for (const item of value) {
                params.append(key, String(item));
            }
            continue;
        }
        if (spec._type === 'date' &&
            value instanceof Date) {
            params.set(key, value.toISOString());
            continue;
        }
        if (value !== getDefault(declared)) {
            params.set(key, String(value));
        }
    }
    const search = params.toString();
    return search
        ? `?${search}`
        : '';
}
function serializeValue(spec, value) {
    if (spec._type === 'optional') {
        return serializeValue(spec.inner, value);
    }
    if (spec._type === 'date' && value instanceof Date) {
        return value.toISOString();
    }
    if (spec._type === 'boolean') {
        return value ? 'true' : 'false';
    }
    return String(value);
}
export function serializeParams(schema, values) {
    const params = {};
    for (const [key, value] of Object.entries(values)) {
        if (value === undefined) {
            continue;
        }
        const spec = schema[key];
        if (!spec) {
            params[key] = String(value);
            continue;
        }
        params[key] = serializeValue(spec, value);
    }
    return params;
}
