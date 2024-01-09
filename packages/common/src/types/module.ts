import { AppendType, LifecycleModule, Provider } from '.'
import { Type } from './types'

export type Modulated = Required<ModuleMetadata> & {
  module: Type
  instance: any
  called: Record<string, boolean>
}

export interface ModuleMetadata {
  appends?: Array<AppendType>
  imports?: Array<Type<any> | DynamicModule | Promise<DynamicModule>>
  providers?: Provider[]
  lifecycles?: Record<string, LifecycleModule | Array<LifecycleModule>>
  [key: string]: any
}

export type ModuleType = Type<any> | DynamicModule | Promise<DynamicModule>

export type DynamicModule = ModuleMetadata & {
  module: Type<any>
}

export type ModuleLoadType = DynamicModule & {
  dynamic: boolean
}

export interface Modular {
  load?(): void
  build?(): void
  register?(): void
  boot?(): void
}
