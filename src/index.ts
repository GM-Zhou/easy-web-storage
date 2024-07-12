export interface EasyWebStorageOptions<T = any, K extends string = string> {
  storage: 'localStorage' | 'sessionStorage';
  key: K;
  initialValue?: T | (() => T);
}

type onChange<T> = (newValue: T, oldValue: T | null) => void;
type onRemove<T, K> = (key: K, oldValue: T | null) => void;

export default class EasyWebStorage<T = any, K extends string = string> {
  private storage?: Storage;
  private onChanges: Array<onChange<T>> = [];
  private onRemoves: Array<onRemove<T, K>> = [];
  key: K;

  constructor(props: EasyWebStorageOptions<T, K>) {
    const { storage, key, initialValue } = props;
    this.storage = storage === 'localStorage' ? window.localStorage : window.sessionStorage;
    this.key = key;

    if (this.storage && initialValue != null) {
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
    if (!this.storage) return null;
    try {
      const value = this.storage.getItem(this.key);
      return JSON.parse(value == null ? 'null' : value);
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  set = (value: T) => {
    if (this.storage) {
      try {
        this.onChanges.forEach((fn) => fn(value, this.get()));
        this.storage.setItem(
          this.key,
          JSON.stringify(value == null || value == 'undefined' ? null : value),
        );
      } catch (error) {
        console.error(error);
      }
    }
  };

  remove = () => {
    if (this.storage) {
      try {
        this.onRemoves.forEach((fn) => fn(this.key, this.get()));
        this.storage.removeItem(this.key);
      } catch (error) {
        console.error(error);
      }
    }
  };
}
