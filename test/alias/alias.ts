import { Module } from '@grafo/common'
import { Application } from '@grafo/application'

class Alias {
  name = 'aliasClassValue'
}

export const cases = {
  provider: {
    key: 'aliasProvider',
    value: 'aliasValue',
    token: 'aliasToken',
  },
  providerClass: {
    key: 'aliasProviderClass',
    value: Alias,
    name: 'aliasClassValue',
  },
  alias: {
    key: 'aliasArray',
    abstract: 'aliasProvider',
  },
  object: {
    key: 'aliasObject',
    abstract: 'aliasProvider',
  },
  validate: {
    key: 'aliasValidate',
    abstract: () => {},
    throw: 'Parameters must be of type "String" or "Class"',
  },
  function: {
    key: 'appendFunction',
    abstract: 'aliasProvider',
  },
  itself: {
    key: 'aliasItself',
    abstract: 'aliasItself',
    throw: 'aliasItself is aliased to itself',
  },
}

@Module({
  providers: [
    {
      token: cases.provider.token,
      value: cases.provider.value,
      alias: cases.provider.key,
    },
    {
      value: cases.providerClass.value,
      alias: cases.providerClass.key,
    },
  ],
  alias: [
    [cases.alias.key, cases.alias.abstract],
    { [cases.object.key]: cases.object.abstract },
  ],
})
export class AliasModule {
  constructor(readonly app: Application) {}

  build() {
    this.app.alias(cases.function.key, cases.function.abstract)
  }
}
