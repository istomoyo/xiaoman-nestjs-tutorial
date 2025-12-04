// ===============================
// 传统写法（强耦合）
// ===============================

// class A {
//   name: string;
//   constructor(name: string) {
//     this.name = name;
//   }
// }
// class B {
//   a: any;
//   constructor() {
//     // ❌ 强耦合：B 在内部自己创建依赖 A
//     // B 完全依赖 A 的构造方式，一旦 A 改了，B 也必须改
//     // B 无法注入 mock，也无法切换不同版本的 A
//     this.a = new A().name;
//   }
// }

// class C {
//   a: any;
//   constructor() {
//     // ❌ 同上：C 也死死绑定 A
//     // 新增 D/E/F 类也都得重复 new A()
//     this.a = new A().name;
//   }
// }



// ===============================
// IoC（控制反转）写法
// ===============================

class A {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

class C {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}


// IoC 容器：专门负责“保存”和“提供”依赖
class Container {
    mo:any;
    constructor() {
        this.mo = {};
    }

    get(key: string) {
        return this.mo[key];
    }

    provide(key: string, mo: any) {
      this.mo[key] = mo;
    }
}

const mo = new Container();

// 由容器统一管理依赖，而不是由 B/C 自己 new
mo.provide('a', new A('小满哈哈哈'));
mo.provide('c', new C('小满啪啪啪'));


class B{
    a:any;
    c:any;
    constructor() {
        // ✔ 这里没有再自己 new A，也不 new C
        // ✔ B 不关心 A/C 怎么产生，只关心自己能不能拿到
        // ✔ “创建依赖的控制权”从 B 内部，转移到了外部的 IoC 容器
        //   → 这就是“控制反转”（IoC）
        this.a = mo.get('a');
        this.c = mo.get('c');

        // 好处：
        // 1. B 不依赖 A 的具体实现（B 不关心 A 构造函数的参数怎么写）
        // 2. 想替换成别的实现？只需要改 provide()
        // 3. 想写单元测试？可以随便 mock
        // 4. 耦合度低，可维护性、可扩展性强
    }
}

