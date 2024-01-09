import { Application } from '@grafo/application'
import { ModuleType } from '@grafo/common'

export const application = async (Module: ModuleType) => {
  const app = new Application()

  await app.load(Module)
  await app.modules.run('load')

  await app.build()
  await app.modules.run('build')

  return app
}
