declare module 'zustand' {
  export interface StoreApi<T> {
    getState: () => T;
    setState: (partial: T | Partial<T> | ((state: T) => T | Partial<T>), replace?: boolean) => void;
    subscribe: (listener: (state: T, prevState: T) => void) => () => void;
    destroy: () => void;
  }
  
  export type UseBoundStore<S extends StoreApi<any>> = {
    (): ReturnType<S['getState']>;
    <U>(selector: (state: ReturnType<S['getState']>) => U, equals?: (a: U, b: U) => boolean): U;
  } & S;

  export function create<T>(createState: (set: any, get: any, api: any) => T): UseBoundStore<StoreApi<T>>;
  export default create;
}
