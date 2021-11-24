// source: https://github.com/andreypopp/memoize-decorator
const SENTINEL = {};

export function memoize<T>(target: any, name: string, descriptor: TypedPropertyDescriptor<T>) {
  if (typeof descriptor.value === 'function') {
    return _memoizeMethod(target, name, descriptor) as any as TypedPropertyDescriptor<T>;
  } else if (typeof descriptor.get === 'function') {
    return _memoizeGetter(target, name, descriptor) as TypedPropertyDescriptor<T>;
  } else {
    throw new Error(
      '@memoize decorator can be applied to methods or getters, got ' +
        String(descriptor.value) +
        ' instead',
    );
  }
}

function _memoizeGetter(target: any, name: string, descriptor: PropertyDescriptor) {
  const memoizedName = `_memoized_${name}`;
  const get = descriptor.get!;
  target[memoizedName] = SENTINEL;
  return {
    ...descriptor,
    get() {
      if (this[memoizedName] === SENTINEL) {
        this[memoizedName] = get.call(this);
      }
      return this[memoizedName];
    },
  };
}

function _memoizeMethod<T>(target: any, name: string, descriptor: TypedPropertyDescriptor<T>) {
  if (!descriptor.value || (descriptor.value as any).length > 0) {
    throw new Error('@memoize decorator can only be applied to methods of zero arguments');
  }
  const memoizedName = `_memoized_${name}`;
  const value = descriptor.value;
  target[memoizedName] = SENTINEL;
  return {
    ...descriptor,
    value() {
      if (this[memoizedName] === SENTINEL) {
        this[memoizedName] = (value as any).call(this);
      }
      return this[memoizedName] as any;
    },
  };
}
