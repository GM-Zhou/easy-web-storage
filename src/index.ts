export interface EasyWebStoreOptions<T = any, K extends string = string> {
  type: 'localStorage' | 'sessionStorage';
  key: K;
  initialValue?: T | (() => T);
}

type onChange<T> = (newValue: T, oldValue: T | null) => void;
type onRemove<T, K> = (key: K, value: T | null) => void;

export default class EasyWebStore<T = any, K extends string = string> {
  private store?: Storage;
  private onChanges: Array<onChange<T>> = [];
  private onRemoves: Array<onRemove<T, K>> = [];
  key: K;

  constructor(props: EasyWebStoreOptions<T, K>) {
    const { type, key, initialValue } = props;
    this.store = type === 'localStorage' ? window.localStorage : window.sessionStorage;
    this.key = key;

    if (this.store && initialValue !== undefined) {
      try {
        const value = typeof initialValue === 'function' ? (initialValue as any)() : initialValue;
        this.set(value);
      } catch (error) {
        console.error(`Error initializing value for key ${this.key}:`, error);
      }
    }
  }

  onChange = (fn: onChange<T>) => this.onChanges.push(fn);
  onRemove = (fn: onRemove<T, K>) => this.onRemoves.push(fn);

  get = (): T | null => {
    if (!this.store) return null;
    try {
      const value = this.store.getItem(this.key);
      return JSON.parse(value == null ? 'null' : value);
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  set = (value: T) => {
    if (this.store) {
      try {
        this.onChanges.forEach((fn) => fn(value, this.get()));
        this.store.setItem(
          this.key,
          JSON.stringify(value == null || value == 'undefined' ? null : value),
        );
      } catch (error) {
        console.error(error);
      }
    }
  };

  remove = () => {
    if (this.store) {
      try {
        this.onRemoves.forEach((fn) => fn(this.key, this.get()));
        this.store.removeItem(this.key);
      } catch (error) {
        console.error(error);
      }
    }
  };
}
