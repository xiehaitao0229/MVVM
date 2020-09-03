1.Observer：数据监听器，能够对数据对象的所有属性进行监听，如有变动可拿到最新值并通知订阅者，
内部采用Object.defineProperty的getter和Setter来实现的

2.Compile：模板编译，它的作用对每个元素节点的指令和文本节点进行扫描和解析，根据指令模板替换数据，以及绑定相应的更新函数。

3.Watcher：订阅者，作为连接Observer和Compile的桥梁，能够订阅并收到每个属性变动的通知，执行指令绑定的相应回调函数。

4.Dep：消息订阅器，内部定义了一个数组，用来收集订阅者（Watcher），数据变动触发notify函数，再调用订阅者的update方法。


当执行new Vue()时，Vue就进入了初始化阶段，一方面Vue会遍历data选项中的属性，并用Object.defineProperty将它们转换为getter/setter，
实现数据变化监听功能；另一方面，Vue的模板编译Compile对元素节点的指令和文本节点进行扫描和解析，初始化视图，
Object.defineProperty在get钩子中addSub订阅Watcher并添加到消息订阅器（Dep）中，初始化完成。
当数据发生变化时，Observer中的setter方法被触发，setter会立即调用Dep.notify()，Dep开始遍历所有的订阅者，并调用订阅者的update方法，
订阅者收到通知后对视图进行相应的更新。
