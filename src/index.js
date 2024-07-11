export default class EasyWebStore {
    constructor(props) {
        this.onChanges = [];
        this.onRemoves = [];
        this.onChange = (fn) => this.onChanges.push(fn);
        this.onRemove = (fn) => this.onRemoves.push(fn);
        this.get = () => {
            if (!this.store)
                return null;
            try {
                const value = this.store.getItem(this.key);
                return JSON.parse(value == null ? 'null' : value);
            }
            catch (error) {
                console.error(error);
                return null;
            }
        };
        this.set = (value) => {
            if (this.store) {
                try {
                    this.onChanges.forEach((fn) => fn(value, this.get()));
                    this.store.setItem(this.key, JSON.stringify(value == null || value == 'undefined' ? null : value));
                }
                catch (error) {
                    console.error(error);
                }
            }
        };
        this.remove = () => {
            if (this.store) {
                try {
                    this.onRemoves.forEach((fn) => fn(this.key, this.get()));
                    this.store.removeItem(this.key);
                }
                catch (error) {
                    console.error(error);
                }
            }
        };
        const { type, key, initialValue } = props;
        this.store = type === 'localStorage' ? window.localStorage : window.sessionStorage;
        this.key = key;
        if (this.store && initialValue !== undefined) {
            try {
                const value = typeof initialValue === 'function' ? initialValue() : initialValue;
                this.set(value);
            }
            catch (error) {
                console.error(`Error initializing value for key ${this.key}:`, error);
            }
        }
    }
}
