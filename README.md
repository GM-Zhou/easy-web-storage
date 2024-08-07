# easy-web-storage

## 简介

EasyWebStorage 是一个用于简化 Web 存储操作的 JavaScript 类。它支持 localStorage 和 sessionStorage，并提供了方便的方法来获取、设置和删除存储项。

## 安装

你可以通过以下方式引入 EasyWebStorage：

```bash
npm install @zhou-gm/easy-web-storage --save
```

## 属性

- storage: 存储对象，可以是 localStorage 或 sessionStorage。
- key: 存储的键名。
- get: 获取存储值的方法。
- set: 设置存储值的方法。
- remove: 删除存储值的方法。
- onChange: 添加值改变时的回调函数，可重复添加。
- onRemove: 值被删除时的回调函数，可重复添加。

## 使用方法

### 创建实例

```js
import EasyWebStorage from '@zhou-gm/easy-web-storage';

const store = new EasyWebStorage({
  storage: 'localStorage',
  key: 'testKey',
  initialValue: { name: 'Jane Doe', age: 28 },
});

store.onChange((newValue, oldValue) => {
  console.log(`${store.key} 已更新, ${oldValue.test} -> ${newValue.test}`);
  document.getElementById('currentValue').innerText = JSON.stringify(newValue);
});

store.onRemove((key, value) => {
  console.log(`${key} 已移除`, value.test);
  document.getElementById('currentValue').innerText = 'null';
});

// 更新用户信息
store.set({ name: 'Jane Doe', age: 29 });

// 获取用户信息
const userInfo = store.get();
console.log(userInfo); // 输出: { name: 'John Doe', age: 30 }

// 删除用户信息
store.remove();
```

### TypeScript

使用泛型或者给 initialValue 传入初始值可以获得更好的类型提示

```ts
import EasyWebStorage from '@zhou-gm/easy-web-storage';

const store = new EasyWebStorage<{ name: string; age: number }>({
  storage: 'localStorage',
  key: 'testKey',
  initialValue: { name: 'Jane Doe', age: 29 },
});

store.onChange((newValue, oldValue) => {
  console.log(`${store.key} 已更新, ${oldValue.test} -> ${newValue.test}`);
  document.getElementById('currentValue').innerText = JSON.stringify(newValue);
});

store.onRemove((key, oldValue) => {
  console.log(`${key} 已移除`, oldValue.test);
  document.getElementById('currentValue').innerText = 'null';
});

// 更新用户信息
store.set({ name: 'Jane Doe', age: 28 });

// 获取用户信息
const userInfo = store.get();
console.log(userInfo); // 输出: { name: 'John Doe', age: 30 }

// 删除用户信息
store.remove();
```

### umd

```html
<script src="@zhou-gm/easy-web-storage/index.global.js"></script>
<script>
const EasyWebStorage = window.EasyWebStorage.default;
const store = new EasyWebStorage({
  storage: 'localStorage',
  key: 'testKey',
  initialValue: { name: 'Jane Doe', age: 28 },
});

store.onChange((newValue, oldValue) => {
  console.log(`${store.key} 已更新`, newValue, oldValue);
  document.getElementById('currentValue').innerText = JSON.stringify(newValue);
});

store.onRemove((key, oldValue) => {
  console.log(`${key} 已移除`, oldValue);
  document.getElementById('currentValue').innerText = 'null';
});

// 更新用户信息
store.set({
  name: 'Jane Doe',
  age: 30,
});

// 获取用户信息
const userInfo = store.get();
console.log(userInfo); // 输出: { name: 'John Doe', age: 30 }

// 删除用户信息
store.remove();
</script>
```

## 错误处理

如果在操作存储时发生错误，EasyWebStorage 会捕获并打印错误信息到控制台。

## 贡献

欢迎提交 issue 和 pull request 来改进 easy-web-storage
