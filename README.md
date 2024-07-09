# easy-web-storage

## 简介

EasyWebStore 是一个用于简化 Web 存储操作的 JavaScript 类。它支持 localStorage 和 sessionStorage，并提供了方便的方法来获取、设置和删除存储项。

## 安装

你可以通过以下方式引入 EasyWebStore：

```bash
npm install easy-web-store --save
```

```javascript
import EasyWebStore from 'easy-web-store';
```

## 使用方法

### 创建实例

```javascript
const store = new EasyWebStore({
  type: 'localStorage', // 可选值：'localStorage' 或 'sessionStorage'
  key: 'myKey',
  onChange: (newValue, oldValue) => {
    console.log('Value changed from', oldValue, 'to', newValue);
  },
  onRemove: () => {
    console.log('Value removed');
  },
  initialValue: { foo: 'bar' }
});
```

### 获取存储值

```javascript
const value = store.get();
console.log(value); // 输出: { foo: 'bar' }
```

### 设置存储值

```javascript
store.set({ foo: 'baz' });
```

### 删除存储值

```javascript
store.remove();
```

## 属性

- store: 存储对象，可以是 localStorage 或 sessionStorage。
- key: 存储的键名。
- onChange: 值改变时的回调函数。
- onRemove: 值被删除时的回调函数。
- get: 获取存储值的方法。
- set: 设置存储值的方法。
- remove: 删除存储值的方法。

## 示例

```javascript
import EasyWebStore from 'path/to/index.esm.js';

const store = new EasyWebStore({
  type: 'localStorage',
  key: 'userInfo',
  onChange: (newValue, oldValue) => {
    console.log('User info changed from', oldValue, 'to', newValue);
  },
  onRemove: () => {
    console.log('User info removed');
  },
  initialValue: { name: 'John Doe', age: 30 }
});

// 获取用户信息
const userInfo = store.get();
console.log(userInfo); // 输出: { name: 'John Doe', age: 30 }

// 更新用户信息
store.set({ name: 'Jane Doe', age: 28 });

// 删除用户信息
store.remove();
```

## 错误处理

如果在操作存储时发生错误，EasyWebStore 会捕获并打印错误信息到控制台。

## 贡献

欢迎提交 issue 和 pull request 来改进 EasyWebStore。

## 许可证

MIT
