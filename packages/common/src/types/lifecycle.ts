export type LifecycleType = {
  name?: string
  level?: number
  fn: Array<Function | LifecycleType> | Function
  deps?: Array<string>
}

export type LifecycleModule = Function | LifecycleType

export type Lifecycle = {
  name?: string
  lifecycle: string
  level: number
  run: boolean
  fn: Function
  deps: Array<string>
}
