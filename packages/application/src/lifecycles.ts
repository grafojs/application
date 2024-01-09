import { Lifecycle, LifecycleModule } from '@grafo/common'

export class Lifecycles {
  list: Record<string, any> = {}

  set(name: string, callback: LifecycleModule) {
    if (!this.list[name]) this.list[name] = []

    const lifecycle = this.list[name]

    if (typeof callback === 'function') {
      ;(lifecycle[0] ??= []).push(this.sanitize({ fn: callback }, name))
    } else if (typeof callback === 'object') {
      if (Array.isArray(callback.fn))
        callback.fn.map((fn: any) => {
          let data = {
            level: callback.level ?? 0,
            fn,
            deps: callback.deps ?? [],
          }

          if (typeof fn === 'object') {
            data = { ...data, ...fn }
          }

          this.set(name, data)
        })
      else
        (lifecycle[callback.level ?? 0] ??= []).push(
          this.sanitize(callback, name),
        )
    }

    this.list[name] = lifecycle
  }

  sanitize(callback: any, lifecycle: string): Lifecycle {
    return {
      name: undefined,
      lifecycle,
      level: 0,
      deps: [],
      run: false,
      ...callback,
    }
  }

  async run(name: string, ...args: any) {
    if (!this.list[name]) return

    for (const lifecycle of this.list[name])
      for (const callback of lifecycle) await this.call(callback, ...args)
  }

  async call(callback: any, ...args: any) {
    if (callback.run) return

    for (const dep of callback.deps) {
      const dependency = this.list[callback.lifecycle][callback.level].find(
        (item: any) => {
          return item.name === dep
        },
      )

      if (dependency) {
        if (dependency.run) continue
        await this.call(dependency, ...args)
      }
    }

    await callback.fn(...args)

    callback.run = true
  }
}
