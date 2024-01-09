import { MODULE_METADATA_KEY } from '../constants'
import { Metadata } from '../metadata'
import { Type, ModuleMetadata } from '../types'

export function Module<T>(options: ModuleMetadata) {
  return (Type: Type<T>): void => {
    Metadata.set(MODULE_METADATA_KEY, options, Type)
  }
}
