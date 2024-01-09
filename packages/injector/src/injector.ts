import { INJECTION, Metadata, Provider, TokenType, Type } from '@grafo/common'
import { Aliases } from './aliases'
import { Binding } from './binding'

export class Injector {
  readonly aliases = new Aliases()
  readonly binding = new Binding(this)

  has(Type: TokenType): boolean {
    return this.binding.has(Type)
  }

  get<T>(Type: TokenType) {
    return this.binding.get(Type) as T
  }

  set(Provider: Provider) {
    return this.binding.set(Provider)
  }

  add(provider: Provider | Provider[]) {
    if (Array.isArray(provider)) provider.map((item) => this.set(item))
    else this.set(provider)
  }

  alias(alias: TokenType, abstract: TokenType) {
    this.aliases.set(alias, abstract)
  }

  build() {
    this.binding.build()
  }

  token(Type: Type, index?: number) {
    return Metadata.get<string>(`${INJECTION}:token:${index}`, Type)
  }
}
