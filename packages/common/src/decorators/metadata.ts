import { Metadata } from '../metadata'
import { Type } from '../types'

export const SetMetadata =
  (key: string, value: unknown) =>
  (
    target: Type | Object,
    property?: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>,
  ) => {
    if (property && descriptor) Metadata.set(key, value, descriptor.value)
    else Metadata.set(key, value, target)
  }
