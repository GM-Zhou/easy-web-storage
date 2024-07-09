export interface EasyWebStoreOptions<T = any> {
  type: "localStorage" | "sessionStorage";
  key: string;
  initialValue?: T;
  onChange?: (newValue: T, oldValue: T | null) => void;
  onRemove?: (key: string, value: T) => void;
}

export default class EasyWebStore<T = any> {
  constructor(props: EasyWebStoreOptions<T>) {
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
        console.error("WebStore: unsupported storage type");
      }
    }
  }

  store: Window["localStorage"] | Window["sessionStorage"] | null = null;
  protected key = "";
  protected onChange: EasyWebStoreOptions<T>["onChange"];
  protected onRemove: EasyWebStoreOptions<T>["onRemove"];

  get = () => {
    if (this.store) {
      const value = this.store.getItem(this.key);
      try {
        return JSON.parse(value == null ? "null" : value);
      } catch (error) {
        console.log(error);
        return null;
      }
    }
  };

  set = (value: T) => {
    if (this.store) {
      try {
        this.onChange?.(value, this.get());
        this.store.setItem(this.key, JSON.stringify(value));
      } catch (error) {
        console.log(error);
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

const store = new EasyWebStore({
  type: "localStorage",
  key: "my-store",
  initialValue: { name: "xmly", age: 25 },
  onChange: (newValue, oldValue) => {
    console.log("New value:", newValue, "Old value:", oldValue);
  },
  onRemove: (key, value) => {
    console.log("Key:", key, "Value:", value, "has been removed");
  },
});

store.get();

console.log(store);
