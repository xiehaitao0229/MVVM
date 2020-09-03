class Vue{
    constructor(options){
        this.$el = options.el;
        this.$data = options.data;
        //  如果$el存在，那么可以找到上面的HTML模块
        if(this.$el){
            // 把数据变成响应式 当 new Observer后，messgae就变成了响应式数据
            new Observer(this.$data);
            // 现在也需要让vm代理this.$data
            this.proxyVm(this.$data);
            // 需要找到模块中需要替换数据的元素，编译模板
            new Compiler(this.$el,this);
        }
    }
    // 让vm代理data
    proxyVm(data){
        for(let key in data){
            Object.defineProperty(this,key,{
                get(){
                    return data[key]
                }
            })
        }
    }
}