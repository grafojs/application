import { describe, expect, it } from 'bun:test'
import { application } from 'test/application'
import { AliasModule, cases } from './alias'

const app = await application(AliasModule)

describe('Alias Application', () => {
  it('In module providers', () => {
    expect(app.get<string>(cases.provider.key)).toBe(cases.provider.value)
  })

  it('In module providers value:Class', () => {
    expect(app.get<any>(cases.providerClass.key).name).toBe(
      cases.providerClass.name,
    )
  })

  it('In module alias:array', () => {
    expect(app.get<string>(cases.alias.key)).toBe(cases.provider.value)
  })
  it('In module alias:object', () => {
    expect(app.get<string>(cases.object.key)).toBe(cases.provider.value)
  })

  it('In app function', () => {
    expect(app.get<string>(cases.function.key)).toBe(cases.provider.value)
  })

  it('Aliased to itself', () => {
    expect(() => {
      app.alias(cases.itself.key, cases.itself.abstract)
    }).toThrow(cases.itself.throw)
  })

  it('Parameters  type "String" or "Class""', () => {
    expect(() => {
      app.injector.aliases.add(
        cases.validate.key,
        cases.validate.abstract as any,
      )
    }).toThrow(cases.validate.throw)
  })
})
