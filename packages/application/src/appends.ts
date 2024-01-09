import { AppendType } from '@grafo/common'
import { Application } from './application'

export class Appends {
  readonly list: Set<AppendType> = new Set()
  readonly added: Set<string> = new Set()
  readonly unavailable: Array<string> = []

  constructor(readonly instance: Application) {
    this.unavailable = Appends.getMethods(instance)
  }

  set(append: AppendType) {
    this.list.add(append)
  }

  add(append: any, value?: any, force?: boolean) {
    if (Array.isArray(append)) append.map((item) => this.add(item))
    else if (typeof append === 'string')
      if (this.unavailable.includes(append))
        throw new Error(
          `${this.constructor.name}: "${append}" cannot override a main attribute or method in "${this.instance.constructor.name}"`,
        )
      else if (force || !this.added.has(append)) {
        Object.assign(this.instance, {
          [append]: value === undefined ? this.instance.get(append) : value,
        })
        this.added.add(append)
      } else
        throw new Error(
          `${this.constructor.name}: "${append}" is already exist in "${this.instance.constructor.name}"`,
        )
    else if (typeof append === 'object')
      this.add(append.key, append.value, append.force)
  }

  static getMethods(instance: Object): string[] {
    let currentObj = instance
    const methods: string[] = []

    while (currentObj && currentObj !== Object.prototype) {
      const currentMethods = Object.getOwnPropertyNames(currentObj).filter(
        (method) => method !== 'constructor',
      )

      methods.push(...currentMethods)

      currentObj = Object.getPrototypeOf(currentObj)
    }

    return methods
  }
}
