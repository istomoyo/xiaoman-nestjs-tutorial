# xiaoman-nestjs-tutorial

## 第一章 介绍 nestjs

> [视频课程 小满 nest js 系列](https://www.bilibili.com/video/BV1NG41187Bs?spm_id_from=333.999.0.0)

`Nestjs` 是一个用于构建高效可扩展的一个基于 Node js 服务端 应用程序开发框架

并且完全支持`typeScript` 结合了 AOP 面向切面的编程方式

`nestjs` 还是一个`spring MVC` 的风格 其中有依赖注入 IOC 控制反转 都是借鉴了`Angualr`

`nestjs` 的底层代码运用了 `express` 和 `Fastify` 在他们的基础上提供了一定程度的抽象，同时也将其 API 直接暴露给开发人员。这样可以轻松使用每个平台的无数第三方模块

[nest js 英文官网 NestJS - A progressive Node.js framework](https://nestjs.com/)

nestjs 中文网 [NestJS 简介 | NestJS 中文文档 | NestJS 中文网](https://nestjs.bootcss.com/)

nestjs 中文网 2 [Nest.js 中文文档](https://docs.nestjs.cn/)

### nestjs 内置框架 express 默认 express

能够快速构建服务端应用程序，且学习成本非常低，容易上手
<img src="https://i-blog.csdnimg.cn/blog_migrate/018e05c6314512e67159d7f1d60b4a26.png">

express 文档[Express - 基于 Node.js 平台的 web 应用开发框架 - Express 中文文档 | Express 中文网](https://www.expressjs.com.cn/)

### nestjs 唯二内置框架 Fastify

<img src="https://i-blog.csdnimg.cn/blog_migrate/e892b14296dd0c6c222ba348b4fa087d.png">

- **高性能**： 据我们所知，Fastify 是这一领域中最快的 web 框架之一，另外，取决于代码的复杂性，Fastify 最多可以处理每秒 3 万次的请求。
- **可扩展**： `Fastify` 通过其提供的钩子（`hook`）、插件和装饰器（`decorator`）提供完整的可扩展性。
- **基于 `Schema`**： 即使这不是强制性的，我们仍建议使用 `JSON Schema` 来做路由（route）验证及输出内容的序列化，Fastify 在内部将 schema 编译为高效的函数并执行。
- **日志**： 日志是非常重要且代价高昂的。我们选择了最好的日志记录程序来尽量消除这一成本，这就是 `Pino`!
- **对开发人员友好**： 框架的使用很友好，帮助开发人员处理日常工作，并且不牺牲性能和安全性。
- **支持 `TypeScript`**： 我们努力维护一个 TypeScript 类型声明文件，以便支持不断成长的 TypeScript 社区。

## 第二章 IOC 控制反转 DI 依赖注入

在学习 nestjs 之前需要先了解其设计模式

### IOC

`Inversion of Control`字面意思是控制反转，具体定义是高层模块不应该依赖低层模块，二者都应该依赖其抽象；抽象不应该依赖细节；细节应该依赖抽象。

### DI

`依赖注入（Dependency Injection）`其实和 IoC 是同根生，这两个原本就是一个东西，只不过由于控制反转概念比较含糊（可能只是理解为容器控制对象这一个层面，很难让人想到谁来维护对象关系），所以 2004 年大师级人物 `Martin Fowler`又给出了一个新的名字：“**依赖注入**”。 类 A 依赖类 B 的常规表现是在 A 中使用 B 的 instance。

**案例未使用控制反转和依赖注入之前的代码**

```
class A {
    name: string
    constructor(name: string) {
        this.name = name
    }
}


class B {
    age:number
    entity:A
    constructor (age:number) {
        this.age = age;
        this.entity = new A('小满')
    }
}

const c = new B(18)

c.entity.name
```

我们可以看到，**B 中代码的实现是需要依赖 A 的，两者的代码耦合度非常高**。当两者之间的业务逻辑复杂程度增加的情况下，维护成本与代码可读性都会随着增加，并且很难再多引入额外的模块进行功能拓展。

为了解决这个问题可以使用 IOC 容器

```
class A {
    name: string
    constructor(name: string) {
        this.name = name
    }
}


class C {
    name: string
    constructor(name: string) {
        this.name = name
    }
}
//中间件用于解耦
class Container {
    modeuls: any
    constructor() {
        this.modeuls = {}
    }
    provide(key: string, modeuls: any) {
        this.modeuls[key] = modeuls
    }
    get(key) {
        return this.modeuls[key]
    }
}

const mo = new Container()
mo.provide('a', new A('小满1'))
mo.provide('c', new C('小满2'))

class B {
    a: any
    c: any
    constructor(container: Container) {
        this.a = container.get('a')
        this.c = container.get('c')
    }
}

new B(mo)
```

其实就是写了一个中间件，来收集依赖，主要是为了解耦，减少维护成本

## 第三章 前置知识装饰器

### 1、什么是装饰器

装饰器是一种特殊的类型声明，他可以附加在类，方法，属性，参数上面

**装饰器写法 tips（需要开启一项配置）**

```
tsc --init //生成配置文件
```

<img src="https://i-blog.csdnimg.cn/blog_migrate/74be796abfdd60fc7eff63a37d649a51.png">

### 类装饰器

主要是通过@符号添加装饰器
他会自动把 class 的构造函数传入到装饰器的第一个参数 `target`

然后通过`prototype`可以自定义添加属性和方法

```
// 定义一个类装饰器，装饰器会自动接收到“被装饰的类本身”作为参数 target
function decotators (target:any) {

    // target 是类的构造函数（例如 Xiaoman）
    // target.prototype 是这个类的【原型对象】
    // 实例在访问属性时，会先从实例自身找，找不到就从原型（prototype）上找
    // 所以在 prototype 上添加属性 = 给所有实例都添加属性

    target.prototype.name = '小满';
    // 这里相当于：Xiaoman.prototype.name = "小满"
    // 所有 new Xiaoman() 的实例都能访问到这个属性
}

@decotators   // 使用类装饰器，装饰器接收到 Xiaoman 这个类作为 target

class Xiaoman {

    constructor () {
        // 类本身没有写 name 属性
    }

}

const xiaoman:any = new Xiaoman();

// 虽然实例本身没有 name，但它会从 Xiaoman.prototype 上找到
console.log(xiaoman.name); // 输出：小满

```

### 属性装饰器

同样使用@符号给属性添加装饰器

他会返回两个参数

1. 原形对象

2. 属性的名称

```
// 定义一个“属性装饰器”
// PropertyDecorator 的签名是 (target, key) => void
const currency: PropertyDecorator = (target: any, key: string | symbol) => {

    // target：对于【实例属性】来说，是类的 prototype（Xiaoman.prototype）
    //         不是实例本身，因为实例还没创建
    // key：   被装饰的属性名，这里是 "name"

    console.log(target, key);
    // 输出示例：
    // Xiaoman { constructor: f, getName: f }  "name"
    // 可以用于在类的原型上记录元数据、做校验、依赖注入等
};


class Xiaoman {

    // 使用属性装饰器，装饰器会在类定义阶段执行，
    // 并收到 (Xiaoman.prototype, "name")
    @currency
    public name: string; // 被装饰的属性

    constructor() {
        // 实例真正被创建时，这里才会执行
        this.name = '';
    }

    getName() {
        return this.name;
    }
}

```

<img src="https://i-blog.csdnimg.cn/blog_migrate/450863964476a5803cf36463c72f027c.png">

### 参数装饰器

同样使用@符号给属性添加装饰器

他会返回两个参数

1. 原形对象

2. 方法的名称

3. 参数的位置从 0 开始

```
// 定义一个“参数装饰器”
// 参数装饰器在方法参数被定义时执行，而不是在运行时执行
// 签名是 (target, key, parameterIndex)
const currency: ParameterDecorator = (
    target: any,              // target：对于实例方法来说，是类的 prototype（Xiaoman.prototype）
    key: string | symbol,     // key：被装饰的方法名，这里是 "getName"
    index: number             // index：参数在方法参数列表中的位置索引，从 0 开始
) => {

    console.log(target, key, index);
    // 输出示例：
    // Xiaoman { constructor: f, getName: f }  "getName"  1
    // 解释：
    //   target → Xiaoman.prototype
    //   key    → 方法名 "getName"
    //   index  → 1 （表示第二个参数 age 被装饰）
};


class Xiaoman {
    public name: string;

    constructor() {
        this.name = '';
    }

    // 参数装饰器只会装饰“age”这个参数
    // 执行时机：类定义阶段，而不是实例创建或方法调用时
    getName(name: string, @currency age: number) {
        return this.name;
    }
}

```

<img src="https://i-blog.csdnimg.cn/blog_migrate/9ec97f8a4d6d5e37d73203790d3d159b.png">

### 方法装饰器

同样使用@符号给属性添加装饰器

他会返回两个参数

1. 原形对象

2. 方法的名称

3. 属性描述符 可写对应`writable`，可枚举对应`enumerable`，可配置对应`configurable`

```
// 定义一个“方法装饰器”
// MethodDecorator 的签名：(target, key, descriptor)
const currency: MethodDecorator = (
    target: any,               // target：对于实例方法来说，是类的 prototype（Xiaoman.prototype）
    key: string | symbol,      // key：被装饰的方法名，这里是 "getName"
    descriptor: any            // descriptor：方法的属性描述符（value、writable、enumerable、configurable）
) => {

    console.log(target, key, descriptor);

    /* 输出示例：
       Xiaoman { constructor: f, getName: f } "getName" {
           value: f getName(name, age) {...},   // 被装饰的方法本体
           writable: true,                      // 能否被修改
           enumerable: false,                   // 是否可枚举
           configurable: true                   // 能否被 delete、重新定义
       }

       方法装饰器常用于：
       - 包装方法（如添加日志、权限校验、缓存）
       - 修改方法行为（重写 descriptor.value）
       - 给方法添加元数据（例如在 NestJS 使用 @Get/@Post）
    */
};


class Xiaoman {
    public name: string;

    constructor() {
        this.name = '';
    }

    // 使用方法装饰器，装饰的是整个 getName 方法
    @currency
    getName(name: string, age: number) {
        return this.name;
    }
}

```

<img src="https://i-blog.csdnimg.cn/blog_migrate/7f0d8df69494f3b5a448d7f541bd4443.png">

## 第四章 前置知识装饰器-实现一个 GET 请求

> 安装依赖`npm install axios -S`

### 定义控制器 `Controller`

```
class Controller {
    constructor() {

    }
    getList () {

    }

}
```

### 定义装饰器

这时候需要使用装饰器工厂

应为装饰器默认会塞入一些参数

定义 descriptor 的类型 通过 descriptor 描述符里面的 value 把 axios 的结果返回给当前使用装饰器的函数

```
const Get = (url: string): MethodDecorator => {
    return (target, key, descriptor: PropertyDescriptor) => {
        const fnc = descriptor.value;
        axios.get(url).then(res => {
            fnc(res, {
                status: 200,
            })
        }).catch(e => {
            fnc(e, {
                status: 500,
            })
        })
    }
}
```

完整代码 接口可以直接用允许跨越的

```
import axios from 'axios'

const Get = (url: string): MethodDecorator => {
    return (target, key, descriptor: PropertyDescriptor) => {
        const fnc = descriptor.value;
        axios.get(url).then(res => {
            fnc(res, {
                status: 200,
            })
        }).catch(e => {
            fnc(e, {
                status: 500,
            })
        })
    }
}

//定义控制器
class Controller {
    constructor() {

    }
    @Get('https://api.apiopen.top/api/getHaoKanVideo?page=0&size=10')
    getList (res: any, status: any) {
        console.log(res.data.result.list, status)
    }

}
```

<img src="https://i-blog.csdnimg.cn/blog_migrate/b47ce996cd0bd0902c4304d6290c5fb3.png">

## 第五章 nestjs cli

### 通过 cli 创建 nestjs 项目

```
npm i -g @nestjs/cli

nest new [项目名称]
```

启动项目 我们需要热更新 就启动`npm run start:dev`就可以了

```
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
```

### 目录介绍

#### main.ts

入口文件主文件 类似于 vue 的 main.ts
通过 `NestFactory.create(AppModule)` 创建一个 app 就是类似于绑定一个根组件 App.vue
`app.listen(3000);` 监听一个端口

```
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```

#### Controller.ts 控制器

你可以理解成 vue 的路由

private readonly appService: AppService 这一行代码就是依赖注入不需要实例化 appService 它内部会自己实例化的我们主需要放上去就可以了

```
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

//-----------------------------------------------------
//修改地址之后

import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('/get')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/hello')
  getHello(): string {
    return this.appService.getHello();
  }
}
```

<img src="https://i-blog.csdnimg.cn/blog_migrate/b5e5932953e13cebad43b0dda43a7549.png">

#### app.service.ts

这个文件主要实现业务逻辑的 当然 Controller 可以实现逻辑，但是就是单一的无法复用，放到 app.service 有别的模块也需要就可以实现复用

```
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
```

## 第六章 nestjs cli 常用命令

### nest --help 可以查看 nestjs 所有的命令

他的命令和 angular 很像
<img src="https://i-blog.csdnimg.cn/blog_migrate/e12fee3064a4fef12596c1fe134757f4.png">

### 案例生成一个用户模块

#### 生成 controller.ts

```
nest g co user
```

<img src="https://i-blog.csdnimg.cn/blog_migrate/d2fe6637290d27b18a8fb3db8652e72b.png">

#### 生成 module.ts

```
nest g mo user
```

#### 生成 service.ts

```
nest g s user
```

<img src="https://i-blog.csdnimg.cn/blog_migrate/d52eded02fa8516d824eda5cd1e6448e.png">

以上步骤一个一个生成的太慢了我们可以直接使用一个命令生成 CURD

```
 nest g resource xiaoman
```

<img src="https://i-blog.csdnimg.cn/blog_migrate/7152e7e063c2cdc638419d15fa16a62f.png">

第一次使用这个命令的时候，除了生成文件之外还会自动使用 npm 帮我们更新资源，安装一些额外的插件，后续再次使用就不会更新了。

<img src="https://i-blog.csdnimg.cn/blog_migrate/187c4e9b7126e830ac200b260e9adbc0.png">

生成了一套标准的 CURD 模板

## 第八章 nestjs 控制器

### Controller Request （获取前端传过来的参数）

nestjs 提供了方法参数装饰器 用来帮助我们快速获取参数 如下

| 装饰器                    | 对应对象/作用                                 |
| ------------------------- | --------------------------------------------- |
| `@Request()`              | `req`（整个请求对象）                         |
| `@Response()`             | `res`（响应对象）                             |
| `@Next()`                 | `next`（中间件调用函数）                      |
| `@Session()`              | `req.session`（会话对象）                     |
| `@Param(key?: string)`    | `req.params` / `req.params[key]`（路径参数）  |
| `@Body(key?: string)`     | `req.body` / `req.body[key]`（请求体参数）    |
| `@Query(key?: string)`    | `req.query` / `req.query[key]`（查询参数）    |
| `@Headers(name?: string)` | `req.headers` / `req.headers[name]`（请求头） |
| `@HttpCode`               | 设置响应状态码                                |

调试工具可以使用 postMan ApiFox 等

### 获取 get 请求传参

可以使用 Request 装饰器 或者 Query 装饰器 跟 express 完全一样
<img src="https://i-blog.csdnimg.cn/blog_migrate/cd91d4693ce09901dc9d6f47389a7303.png">

也可以使用 Query 直接获取 不需要在通过 req.query 了
<img src="https://i-blog.csdnimg.cn/blog_migrate/dc7a4d5bbf3c89eab1eb172dec36aa96.png">

```
import { Controller, Get, Post, Body, Patch, Param, Delete, Version, Request, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  find(@Query() query) {
    console.log(query)
    return { code: 200 }
  }
}
```

### post 获取参数

可以使用 Request 装饰器 或者 Body 装饰器 跟 express 完全一样
<img src="https://i-blog.csdnimg.cn/blog_migrate/a7c8027ad9f7aeebee44d5e782660dd9.png">

或者直接使用 Body 装饰器
<img src="https://i-blog.csdnimg.cn/blog_migrate/fbc8e88ebea665a067d60a07af4b5ecd.png">

也可以直接读取 key

 <img src="https://i-blog.csdnimg.cn/blog_migrate/07926d88bffd2f3b240f2228b8af7ac1.png">

```
import { Controller, Get, Post, Body, Patch, Param, Delete, Version, Request, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
 constructor(private readonly userService: UserService) { }

 @Get()
 find(@Query() query) {
   console.log(query)
   return { code: 200 }
 }

 @Post()
 create (@Body() body) {

   console.log(body)

   return {
      code:200
   }
 }
}
```

### 动态路由

可以使用 Request 装饰器 或者 Param 装饰器 跟 express 完全一样

 <img src="https://i-blog.csdnimg.cn/blog_migrate/37d045a9e18673e8d4ce814889f4fab2.png">

 <img src="https://i-blog.csdnimg.cn/blog_migrate/5963e45cee7d6d4d07d1f6dd99292cd9.png">

```
import { Controller, Get, Post, Body, Patch, Param, Delete, Version, Request, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
 constructor(private readonly userService: UserService) { }

 @Get()
 find(@Query() query) {
   console.log(query)
   return { code: 200 }
 }

 @Post()
 create (@Body('name') body) {

   console.log(body)

   return {
      code:200
   }
 }

 @Get(':id')
 findId (@Param() param) {

   console.log(param)

   return {
      code:200
   }
 }
}
```

### 读取 header 信息

 <img src="https://i-blog.csdnimg.cn/blog_migrate/78f61b60dfbbcb91f3e43d74af5ebc74.png">

```
import { Controller, Get, Post, Body, Patch, Param, Delete, Version, Request, Query, Ip, Header, Headers } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  find(@Query() query) {
    console.log(query)
    return { code: 200 }
  }

  @Post()
  create (@Body('name') body) {

    console.log(body)

    return {
       code:200
    }
  }

  @Get(':id')
  findId (@Headers() header) {

    console.log(header)

    return {
       code:200
    }
  }
}
```

### 状态码

使用 HttpCode 装饰器 控制接口返回的状态码
<img src="https://i-blog.csdnimg.cn/blog_migrate/22d8449d771c9f392a3e4afdf896e36a.png">

```
import { Controller, Get, Post, Body, Patch, Param, Delete, Version, Request, Query, Ip, Header, Headers, HttpCode } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  find(@Query() query) {
    console.log(query)
    return { code: 200 }
  }

  @Post()
  create (@Body('name') body) {

    console.log(body)

    return {
       code:200
    }
  }

  @Get(':id')
  @HttpCode(500)
  findId (@Headers() header) {
    return {
       code:500
    }
  }
}
```
