// 存储观察者的类Dep
class Dep{
    constructor(){
        this.subs = [];  //  在subs中存放所有的watcher
    }
    // 添加watcher即订阅
    addSub(watcher){
        this.subs.push(watcher)
    }
    // 通知 发布 通知subs容器中的所有观察者
    notify(){
        this.subs.forEach(watcher=>watcher.update())
    }
}