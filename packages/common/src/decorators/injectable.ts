import { INJECTION } from '../constants'
import { InjectableOption, SCOPE } from '../types'
import { SetMetadata } from './metadata'

export const Injectable = (
  options: InjectableOption = { scope: SCOPE.GLOBAL },
) => SetMetadata(INJECTION, options)
