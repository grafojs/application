import 'reflect-metadata'

export class Metadata {
  static get<T>(key: string, obj: Object, property?: string | symbol): T {
    if (property) return Reflect.getOwnMetadata(key, obj, property)
    return Reflect.getMetadata(key, obj) as T
  }

  static set(
    key: string,
    value: unknown,
    target: Object,
    property?: string | symbol,
  ) {
    if (property) return Reflect.defineMetadata(key, value, target, property)

    return Reflect.defineMetadata(key, value, target)
  }
}
