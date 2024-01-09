import { Type } from './types'

export type TokenType = Type | string

export type Provided = {
  token: TokenType
  alias: string | undefined
  type: any
  append: boolean | string | undefined
  shared: boolean
  resolve: any
  metadata: any
  dependencies: TokenType[]
}

export type ProviderType = {
  token?: TokenType
  alias?: string
  append?: boolean | string
  value: Type | Function | Object | string | boolean | any
  inject?: any[]
  scope?: any
}

export type Provider = Type | ProviderType
