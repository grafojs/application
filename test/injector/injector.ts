import { Module } from '@grafo/common'
import { Application } from '@grafo/application'

export const cases = {}

@Module({})
export class InjectorModule {
  constructor(readonly app: Application) {}
  build() {}
}
