class Observer {
  constructor(data) {
    this.observer(data);
  }

  // 把上面的数据变成响应式数据，把一个对象数据做出响应式
  observer(data) {
    if (data && typeof data == "object") {
      // for in 循环一个js对象
      for (let key in data) {
        this.defineReactive(data, key, data[key]);
      }
    }
  }

  defineReactive(obj, key, value) {
    //如果一个value是一个对象，还需要深度递归
    this.observer(value);
    //  创建不同的watcher放到不同的dep中
    let dep = new Dep();
    Object.defineProperty(obj, key, {
      get() {
        console.log(dep);
        Dep.target && dep.addSub(Dep.target);
        return value;
      },
      set: (newValue) => {
        if (newValue != value) {
          this.observer(newValue);
          value = newValue;
          //  值改变时候，通知观察者
          dep.notify();
        }
      },
    });
  }
}
