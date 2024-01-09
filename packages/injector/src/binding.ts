import {
  INJECTION,
  InjectableOption,
  Metadata,
  Provided,
  Provider,
  ProviderType,
  TokenType,
  Type,
} from '@grafo/common'
import { Injector } from './injector'

export class Binding {
  protected list = new Map<TokenType, Pick<Provided, 'resolve' | 'shared'>>()
  protected available = new Map<TokenType, Provided>()

  constructor(private injector: Injector) {}

  has(Type: TokenType): boolean {
    const abstract = this.injector.aliases.get(Type)
    return this.list.has(abstract)
  }

  get<T>(Type: Type<T> | string) {
    const abstract = this.injector.aliases.get(Type)
    const resolved = this.list.get(abstract)

    if (resolved)
      if (resolved.shared) return resolved.resolve
      else return resolved.resolve()

    throw Error(`Type ${abstract} not injected`)
  }

  set(Provider: Provider) {
    const obj = typeof Provider === 'object' ? Provider : { value: Provider }
    const provider = this.sanitize(obj) as Provided

    if (!this.available.has(provider.token)) {
      if (provider.alias) this.injector.alias(provider.alias, provider.token)

      this.available.set(provider.token, provider)
    }

    return provider
  }

  build() {
    for (const item of Array.from(this.available.values())) {
      this.resolve(item)
    }
  }

  async resolve(
    { token, type, resolve, dependencies, shared }: Provided,
    Parent?: Type, // eslint-disable-line
  ) {
    if (this.has(token)) return

    this.dependencies(dependencies, type)

    const args = dependencies.map((Dep: any, index: number) =>
      this.get(this.injector.token(type, index) ?? Dep),
    )

    if (shared) {
      this.list.set(token, {
        resolve: resolve(...args),
        shared,
      })
    } else {
      this.list.set(token, {
        resolve: () => resolve(...args),
        shared,
      })
    }
  }

  protected dependencies(Dependencies: any[], Parent: any) {
    if (!Dependencies) return
    for (const [index, Dependency] of Dependencies.entries()) {
      const token = this.injector.token(Parent, index) ?? Dependency

      if (!this.has(token)) {
        const abstract = this.injector.aliases.get(token)
        const type = this.available.get(abstract)
        if (type) this.resolve(type, Parent)
        else {
          throw new Error(
            `${
              typeof Dependency == 'string' ? Dependency : Dependency.name
            } is not available in injection context ${
              Parent.name
            }. Did you provide it in module ?`,
          )
        }
      }
    }
  }

  sanitize({
    token,
    value,
    inject,
    scope,
    alias,
    append,
  }: ProviderType): Provided {
    let type = {}
    let resolve = () => value
    let dependencies: Array<any> = []

    if (typeof value === 'function')
      if (value.prototype) {
        type = value
        token = token ?? value
        dependencies = Object.assign(
          [],
          Metadata.get('design:paramtypes', type),
        )
        resolve = (...args: unknown[]) => new value(...args)
      } else {
        resolve = value
        dependencies = inject ?? []
      }

    const metadata = Metadata.get<InjectableOption>(INJECTION, type)

    if (!token && typeof append === 'string') {
      token = append
    } else if (append === true) {
      if (!alias && typeof token === 'string') {
        append = token
      } else if (alias) {
        append = alias
      }
    }

    if (typeof token === 'function' && typeof append === 'string' && !alias) {
      alias = append
    }

    return {
      alias,
      type,
      // TODO: Check why the token gives undefined
      token: token ?? value,
      append,
      dependencies,
      resolve,
      metadata,
      shared: typeof scope !== 'undefined' ? scope : true,
    }
  }
}
