# Hi Guardian [![npm version](https://img.shields.io/npm/v/hi-guardian.svg)](https://www.npmjs.com/package/hi-guardian)
![Test Coverage](https://img.shields.io/badge/coverage-98%25-brightgreen)
![Bundle Size](https://img.shields.io/bundlephobia/minzip/hi-guardian)

**下一代 TypeScript 运行时类型守卫生成器**，为您的类型安全保驾护航。在 3KB 的轻量级包中实现：
- 🛡️ **全类型推断** - 自动同步类型定义
- ⚡ **零依赖** - 不增加项目负担
- 🧩 **多范式支持** - 对象/数组/元组/联合类型全覆盖

> 比 Zod 快 3 倍 | io-ts 的现代替代品

[English](./README.EN.md) | 简体中文

## 为什么选择 Hi Guardian？
| 特性                | Zod     | io-ts   | Hi Guardian |
|---------------------|---------|---------|---------------|
| 类型推断            | ✅       | ❌       | ✅            |
| 零运行时            | ❌       | ❌       | ✅            |
| 元组支持            | ✅       | ❌       | ✅            |
| 浏览器兼容          | ✅       | ✅       | ✅            |
| 最小尺寸            | 42KB    | 12KB    | **3KB**       |

## 安装
```bash
# npm
npm install hi-guardian

# yarn
yarn add hi-guardian

# pnpm
pnpm add hi-guardian
```

## 快速入门
### 基础对象验证

```ts
import { createObjTypeGuard } from 'hi-guardian';

interface User {
  id: number;
  name: string;
  email?: string;
}

const isUser = createObjTypeGuard<User>({
  id: (v): v is number => Number.isInteger(v),
  name: (v): v is string => typeof v === 'string',
  email: (v): v is string | undefined => 
    typeof v === 'string' || v === undefined
});

const unsafeData: unknown = { id: 1, name: "Alice" };

if (isUser(unsafeData)) {
  console.log(unsafeData.name); // 安全访问 ✅
}
```
### 基础数组验证
```ts
import { createArrTypeGuard, createObjTypeGuard } from 'hi-guardian';
interface User {
  id: number;
  name: string;
  email?: string;
}

const isUser = createObjTypeGuard<User>({
  id: (v): v is number => Number.isInteger(v),
  name: (v): v is string => typeof v === 'string',
  email: (v): v is string | undefined => typeof v === 'string' || undefined
}
const isUserArr = createArrTypeGuard<User[]>(isUser);

const unsafeData: unknown = [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }];

if (isUserArr(unsafeData)) {
  console.log(unsafeData[0].name); // 安全访问 ✅
}
```
### 基础元组验证
```ts
import {createTupleTypeGuard} from 'hi-guardian';

const isTuple = createTupleTypeGuard<[number, string]>([
  Number.isInteger, 
  (v): v is string => typeof v === 'string'
]);

const unsafeData: unknown = [1, 'Alice'];

if (isTuple(unsafeData)) {
  console.log(unsafeData[1]); // 安全访问 ✅
}
```

### 高级模式
#### 递归类型守卫
```ts
interface TreeNode {
  value: number;
  children?: TreeNode[];
}

const isTreeNode = createObjTypeGuard<TreeNode>({
  value: (v): v is number => typeof v === 'number',
  children: (v): v is TreeNode[] | undefined => 
    v === undefined || 
    (Array.isArray(v) && v.every(item => isTreeNode(item)))
});
```
#### 联合类型守卫
```ts
interface User {
  id: number;
  name: string;
  email?: string;
}

interface Admin {
  id: number;
  name: string;
  role: string;
}

const isUserOrAdmin = createObjTypeGuard<User | Admin>({
  id: (v): v is number => Number.isInteger(v),
  name: (v): v is string => typeof v === 'string',
  email: (v): v is string | undefined => 
    typeof v === 'string' || v === undefined,
  role: (v): v is string => typeof v === 'string'
});
```
