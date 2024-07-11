export interface EasyWebStoreOptions<T = any, K extends string = string> {
  type: 'localStorage' | 'sessionStorage';
  key: K;
  initialValue?: T | (() => T);
}

export default class EasyWebStore<T = any, K extends string = string> {
  private store: Storage | null;
  private onChanges: Array<(newValue: T, oldValue: T | null) => void> = [];
  private onRemoves: Array<(key: K, value: T | null) => void> = [];
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

  onChange(fn: (newValue: T, oldValue: T | null) => void) {
    this.onChanges.push(fn);
  }

  onRemove(fn: (key: K, value: T | null) => void) {
    this.onRemoves.push(fn);
  }

  get = () => {
    if (this.store) {
      const value = this.store.getItem(this.key);
      try {
        return JSON.parse(value == null ? 'null' : value);
      } catch (error) {
        console.error(error);
        return null;
      }
    }
  };

  set = (value: T) => {
    if (this.store) {
      try {
        this.onChanges?.forEach((fn) => fn(value, this.get()));
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
      this.onRemoves?.forEach((fn) => fn(this.key, this.get()));
      this.store.removeItem(this.key);
    }
  };
}
