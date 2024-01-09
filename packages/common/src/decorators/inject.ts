import { INJECTION } from '../constants'
import { Metadata } from '../metadata'

export const Inject =
  (token?: string) =>
  (
    target: Record<string, unknown> | any,
    key: string | symbol | undefined,
    index: number,
  ) => {
    Metadata.set(`${INJECTION}:token:${index}`, token, target)
  }
