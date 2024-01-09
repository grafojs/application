import { TokenType } from '@grafo/common'

export class Aliases {
  protected list = new Map<TokenType, TokenType>()

  get(abstract: TokenType): TokenType {
    return this.list.has(abstract)
      ? this.get(this.list.get(abstract) as TokenType)
      : abstract
  }

  set(alias: TokenType, abstract: TokenType) {
    if (alias === abstract)
      throw Error(
        `${
          typeof abstract === 'string' ? abstract : abstract.name
        } is aliased to itself`,
      )

    if (this.validate(alias) && this.validate(abstract))
      this.list.set(alias, abstract)
    else {
      throw Error(`Parameters must be of type "String" or "Class"`)
    }
  }

  protected validate(key: TokenType) {
    return (
      typeof key === 'string' || (typeof key === 'function' && key.prototype)
    )
  }

  add(alias: any, abstract?: TokenType) {
    if (Array.isArray(alias)) {
      alias.map((item: any) => {
        if (Array.isArray(item)) {
          const [key, value] = item
          this.add(key, value)
        } else this.add(item)
      })
    } else if (typeof alias === 'object') {
      for (const [key, value] of Object.entries(alias))
        this.set(key, value as TokenType)
    } else if (abstract) {
      this.set(alias, abstract)
    }
  }
}
