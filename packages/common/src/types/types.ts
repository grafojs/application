export type Constructor<T = unknown> = new (...args: unknown[]) => T

export type Type<T = any> = Function & {
  new (...args: any[]): T
}
