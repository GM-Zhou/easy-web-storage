
# 开始

> 本篇文章中，我将给大家展示如何从 0 到 1，构建自己的前端工具库，包括从创建项目到打包发布到 npm。本文的示例项目仓库为 [easy-web-storage](https://github.com/GM-Zhou/easy-web-storage)

## 1. 梳理需求

最好是针对现有业务的一些小的痛点，这里以 easy-web-storage 为例：

- storage 中存在多个字段，需要更集中的管理
- storage 中的字段更新时，需要添加一些副作用
- storage 存取值时的错误处理和格式转换

## 2. 创建项目

- 新建文件夹 easy-web-storage，并使用 pnpm init 初始化
- 安装依赖
  - ts 语言支持`pnpm i -D typescript`
  - tsup 打包工具 `pnpm i -D tsup tslib`
- 新建 src/index.ts 作为入口文件
- 将 package.json 中的`type`值改为`"module"`，以支持 ESM 形式的导入导出
- 使用`pnpx tsconfig.json`创建`tsconfig.json`，选择默认的 node 模板，然后修改一下

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "module": "ESNext",
    "lib": [
      "dom",
      "es6",
      "es2017",
      "esnext.asynciterable"
    ],
    "noEmit": true, // tsc 仅检查，不生成 js 文件
    "sourceMap": false,
    "strict": true,
    "declaration": true,
    "esModuleInterop": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "removeComments": true
  },
  "include": [
    "src/**/*",
  ]
}
```

## 3. 编写代码

在 src/index.ts 中编写需求代码

```typescript
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
```

**代码逻辑比较简单：**

将原本 localStorage/sessionStorage .set/.get 的数据管理方式，改为原子化的方式

支持 TS 泛型，自动处理存取值错误，并能够为它动态添加多个副作用

**例如：**

```ts
const userStore = new EasyWebStorage({
  storage: 'localStorage',
  key: 'user',
  initialValue: {
    name: 'zhangsan',
    age: 18
  }
})

const user = userStore.get();

userStore.onChange((newValue, oldValue) => {
  console.log(`${userStore.key} 已更新, ${oldValue.test} -> ${newValue.test}`);
})
userStore.onChange((newValue, oldValue) => {
  console.log('添加的第二个副作用');
})

user.set({ name: 'lisi', age: 19 });
```

## 4. 使用 tsup 打包

> tsup 是基于 esbuild 开发的一个新型打包工具（比 rollup 还新）。内置了 TypeScript 支持，零配置、开箱即用，帮助你高效创建现代 TypeScript/JavaScript 库

[tsup 仓库地址](https://github.com/egoist/tsup)

- 新建 tsup.config.ts 文件

```ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'], // 入口
  outDir: 'dist', // 打包输出目录
  clean: true, // 每次打包前清空目录
  format: ['esm', 'iife'], // 打包格式，iife 支持 script 标签直接引入
  globalName: 'easyWebStore', // iife 模式下的全局变量名
  dts: true, // 输出 d.ts 文件
  minify: true, // 压缩代码
});

```

使用 pnpm tsup 打包后，可以看到 dist 目录结构
-- index.d.ts
-- index.global.js
-- index.js

## 5. 配置 package.json

根据项目需要和打包结果进行配置

```json
{
  "name": "@zhou-gm/easy-web-storage",
  "private": false,
  "version": "1.0.16",
  "description": "make web storage more manageable",
  "keywords": [
    "localStorage",
    "sessionStorage",
    "typescript",
    "javascript"
  ],
  "author": "",
  "license": "ISC",
  "homepage": "https://github.com/GM-Zhou/easy-web-storage",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/GM-Zhou/easy-web-storage.git"
  },
  "files": [
    "dist"
  ],
  "type": "module",
  "module": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsup",
    "pub": "node ./scripts/publish.js"
  },
  "devDependencies": {
    "@eslint/js": "^9.6.0",
    "eslint": "^9.6.0",
    "globals": "^15.8.0",
    "prettier": "^3.3.2",
    "tslib": "^2.6.3",
    "tsup": "^8.1.0",
    "typescript": "^5.5.3",
    "typescript-eslint": "^7.16.0"
  }
}
```

**其中：**

name 使用`@zhou-gm`组织前缀，可以防止重名，但是需要在 npm 中新建一个组织

private: false 代表可以发布到 npm，否则 npm 将拒绝发布

files: ['dist'] 代表上传 npm 时，只上传 dist 目录

main: 'dist/index.cjs' 代表使用 commonjs 引入该项目时的入口

module: 'dist/index.js' 代表使用 esm 引入该项目时的入口

types: 'dist/index.d.ts' 代表类型文件入口

exports 字段提供了更细粒度的导出控制，这里按照默认的 . 路径来写

## 6. 编写测试文件

因为 easy-web-storage 的宿主环境为浏览器，并且功能较为简单，所以编写 html 作为测试文件
新建 test/test.esm.html，用于测试 esm 格式
新建 test/test.iife.html，用于测试 iife 格式

**此时可以找 [kimi](https://kimi.moonshot.cn/) 帮忙：**
将 dist 目录下的 index.js 上传，然后让它根据文件生成一份详细且美观的 html 测试代码，生成后复制代码到 test/test.esm.html，将引入的 js 文件路径改为 dist/index.js

test/test.iife.html 同理，然后使用 vscode 插件`Live Server`启动 html，，再进行一些微调即可

## 7. 发布 npm

首先在命令行查看 npm 是否登录

```bash
npm whoami --registry https://registry.npmjs.org
```

后缀 --registry <https://registry.npmjs.org> 是为了防止本地修改过 npm 源

如果显示结果为你的 npm 用户名，则进行下一步，否则使用 npm login 命令登录

**登录成功后，我们便可以使用 npm publish 进行发布了，但是为了后续发布的便利，我们还需要用 node 写一些自动化的脚本来辅助发布：**

新建 scripts/publish.js

```js
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// 如果检查未通过，则退出
const checkWorker = execSync('pnpm tsc && pnpm build', { stdio: 'inherit' });
if (checkWorker) process.exit(1);

// 升级 package.json
const packageJson = JSON.parse(readFileSync(resolve('package.json'), 'utf-8'));
const { version } = packageJson;
const newVersion = version
  .split('.')
  .map((v, i) => (i === 2 ? parseInt(v) + 1 : v))
  .join('.');
packageJson.version = newVersion;
writeFileSync('package.json', JSON.stringify(packageJson, null, 2));

// git commit
execSync('git add .', { stdio: 'inherit' });
execSync(`git commit -m "chore: upgrade version to ${newVersion}"`, { stdio: 'inherit' });

// npm 发布
execSync(`npm publish --registry https://registry.npmjs.org --no-git-checks --access public`, {
  stdio: 'inherit',
});

// 上传 git
execSync('git push', { stdio: 'inherit' });
```

脚本比较简单，大致流程为：

- 使用 tsc 检查代码
- 修改 package.json 的版本号
- git 保存代码
- npm publish
  - --registry 参数以防止本地替换过 npm 源
  - --no-git-checks 防止 npm 因为 git 仓库没有保存提交而报错
  - --access public：当包名使用组织前缀时，发布需要带上这个参数
- git push

脚本编写完成后，就可以正常使用 pnpm pub 命令发布了

## 8. 总结

至此，一个简单的前端工具库就大功告成了

虽然实现的功能较为简单，但是在从 0 到 1 的过程中，我温故而知新，对 web storage，错误捕获和处理，观察者模式，tsconfig.json，package.json，node 等又有了更多的认识和思考

如果这篇文章对你有帮助，请给我一个 star 吧，谢谢！
<https://github.com/GM-Zhou/easy-web-storage>
