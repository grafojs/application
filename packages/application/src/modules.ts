import {
  MODULE_METADATA_KEY,
  Metadata,
  Modulated,
  ModuleLoadType,
  ModuleMetadata,
  ModuleType,
  Type,
} from '@grafo/common'
import { Application } from './application'

export class Modules {
  list = new Map<Type, Modulated>()

  constructor(readonly app: Application) {}

  get all() {
    return Array.from(this.list.values())
  }

  has(Module: Type): boolean {
    return this.list.has(Module)
  }

  get(Module: Type) {
    return this.list.get(Module)
  }

  set(Module: ModuleType) {
    const obj =
      typeof Module === 'object'
        ? { dynamic: true, ...Module }
        : { module: Module, dynamic: false }
    const module = this.resolve(obj as ModuleLoadType)
    this.list.set(module.module, module)
    return module
  }

  load(Module: ModuleType) {
    const module: Modulated = this.set(Module)

    if (module.loaded) return

    this.app.set(module.module)

    for (const item of module.imports) this.load(item)
    for (const item of module.providers) this.app.set(item)
    for (const value of module.appends) this.app.appends.set(value)
    for (const [key, value] of Object.entries(module.lifecycles))
      if (Array.isArray(value))
        value.map((item: any) => this.app.lifecycle(key, item))
      else this.app.lifecycle(key, value as any)

    if (module.alias) this.app.injector.aliases.add(module.alias)

    module.loaded = true
  }

  async run(method: string) {
    for (const module of this.all) this.call(method, module)
  }

  async call(method: string, module: any) {
    if (method in module.module.prototype) {
      for (const item of module.imports)
        await this.call(method, this.list.get(item))

      if (module.called[method]) return

      module.instance = module.instance ?? this.app.get(module.module)

      await module.instance[method]()

      module.called[method] = true
    }
  }

  protected resolve(Module: ModuleLoadType): Modulated {
    let metadata

    if (Module.dynamic === false)
      metadata = Metadata.get(
        MODULE_METADATA_KEY,
        Module.module,
      ) as ModuleMetadata
    else metadata = Module

    return {
      module: Module.module,
      imports: [],
      providers: [],
      appends: [],
      lifecycles: {},
      called: {},
      alias: undefined,
      instance: undefined,
      ...metadata,
    }
  }
}
