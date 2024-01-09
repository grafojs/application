import { LifecycleModule, ModuleType, Provider, TokenType } from '@grafo/common'
import { Injector } from '@grafo/injector'
import { Modules } from './modules'
import { Appends } from './appends'
import { Lifecycles } from './lifecycles'

export class Application {
  [key: string]: any
  readonly modules = new Modules(this)
  readonly appends = new Appends(this)
  readonly injector = new Injector()
  readonly lifecycles = new Lifecycles()

  constructor() {
    this.injector.add([
      { token: Application, value: this, alias: 'app' },
      { token: Injector, value: this.injector },
      { token: Modules, value: this.modules },
    ])
  }

  has(Type: TokenType): boolean {
    return this.injector.has(Type)
  }

  get<T = any>(Type: TokenType) {
    return this.injector.get(Type) as T
  }

  set(provider: Provider) {
    const sanitize = this.injector.set(provider)

    if (typeof sanitize.append == 'string') this.appends.set(sanitize.append)

    return sanitize
  }

  alias(alias: TokenType, abstract: TokenType) {
    this.injector.alias(alias, abstract)
  }

  async load(Module: ModuleType | ModuleType[]) {
    if (!Module) return
    if (Array.isArray(Module)) Module.map((item) => this.modules.load(item))
    else this.modules.load(Module)
  }

  async build() {
    this.injector.build()
    this.append([...this.appends.list])
  }

  append(append: any, value?: any, force?: boolean) {
    this.appends.add(append, value, force)
  }

  async run(lifecycle: string) {
    await this.lifecycles.run(lifecycle, this)
  }

  lifecycle(name: string, callback: LifecycleModule | Array<LifecycleModule>) {
    if (Array.isArray(callback))
      callback.map((item) => this.lifecycles.set(name, item))
    else this.lifecycles.set(name, callback)
  }
}
