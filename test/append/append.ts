import { Module } from '@grafo/common'
import { Application } from '@grafo/application'

export const cases = {
  module: {
    key: 'appendModule',
    value: 'Append In Module',
  },
  function: {
    key: 'appendFunction',
    value: 'Append In App Function',
  },
  provider: {
    key: 'appendProvider',
    value: 'Append In Module Provider',
  },

  string: {
    key: 'appendString',
    value: 'Append In Module String',
  },

  force: {
    key: 'appendString',
    value: 'Append In Module Force',
    throw: 'Appends: "appendString" is already exist in "Application"',
  },
  main: {
    key: 'modules',
    throw:
      'Appends: "modules" cannot override a main attribute or method in "Application"',
  },
}

@Module({
  providers: [
    { token: cases.string.key, value: cases.string.value },
    { value: cases.provider.value, append: cases.provider.key },
  ],
  appends: [
    cases.string.key,
    { key: cases.module.key, value: cases.module.value },
  ],
})
export class AppendModule {
  constructor(readonly app: Application) {}

  build() {
    this.app.append(cases.function.key, cases.function.value)
  }
}
