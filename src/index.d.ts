export interface EasyWebStoreOptions<T = any, K extends string = string> {
    type: 'localStorage' | 'sessionStorage';
    key: K;
    initialValue?: T | (() => T);
}
type onChange<T> = (newValue: T, oldValue: T | null) => void;
type onRemove<T, K> = (key: K, value: T | null) => void;
export default class EasyWebStore<T = any, K extends string = string> {
    private store?;
    private onChanges;
    private onRemoves;
    key: K;
    constructor(props: EasyWebStoreOptions<T, K>);
    onChange: (fn: onChange<T>) => number;
    onRemove: (fn: onRemove<T, K>) => number;
    get: () => T | null;
    set: (value: T) => void;
    remove: () => void;
}
export {};
