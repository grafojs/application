export enum SCOPE {
  GLOBAL = 'GLOBAL',
  REQUEST = 'REQUEST',
  TRANSIENT = 'TRANSIENT',
}

export interface InjectableOption {
  scope: SCOPE
}
