export interface EasyWebStoreOptions<T = any, K extends string = string> {
  type: 'localStorage' | 'sessionStorage';
  key: K;
  initialValue?: T;
  onChange?: (newValue: T, oldValue: T | null) => void;
  onRemove?: (key: K, value: T) => void;
}

export default class EasyWebStore<T = any, K extends string = string> {
  constructor(props: EasyWebStoreOptions<T, K>) {
    if (props) {
      if (props.type) {
        this.store = window[props.type];
      }

      if (this.store) {
        this.key = props.key;
        this.onChange = props.onChange;
        this.onRemove = props.onRemove;

        if (props.initialValue != null) {
          this.set(props.initialValue);
        }
      } else {
        console.error('WebStore: unsupported storage type');
      }
    }
  }

  store: Window['localStorage'] | Window['sessionStorage'] | null = null;
  protected key = '' as K;
  protected onChange: EasyWebStoreOptions<T, K>['onChange'];
  protected onRemove: EasyWebStoreOptions<T, K>['onRemove'];

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
        this.onChange?.(value, this.get());

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
      this.onRemove?.(this.key, this.get());
      this.store.removeItem(this.key);
    }
  };
}
