import { describe, expect, it } from 'bun:test'
import { application } from 'test/application'
import { AppendModule, cases } from './append'

const app = await application(AppendModule)

describe('Append Application', () => {
  it('In module metadata', () => {
    expect(app[cases.module.key]).toBe(cases.module.value)
  })

  it('In module provider', () => {
    expect(app[cases.provider.key]).toBe(cases.provider.value)
  })

  it('In module append string', () => {
    expect(app[cases.string.key]).toBe(cases.string.value)
  })

  it('In app function', () => {
    expect(app[cases.function.key]).toBe(cases.function.value)
  })

  it('Override With "force"', () => {
    app.append(cases.force.key, cases.force.value, true)
    expect(app[cases.force.key]).toBe(cases.force.value)
  })

  it('Override Without "force": Throws error', () => {
    expect(() => {
      app.append(cases.force.key, cases.force.value)
    }).toThrow(cases.force.throw)
  })

  it('Override main attribute: Throws error', () => {
    expect(() => {
      app.append(cases.main.key, cases.main.key)
    }).toThrow(cases.main.throw)
  })
})
