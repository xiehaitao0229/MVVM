class Compiler{
    constructor(el,vm){
        this.el=this.isElementNode(el)?el:document.querySelector(el);
        this.vm=vm;
        // console.log(this.el)
        let fragment=this.node2fragment(this.el);
        // console.log(fragment);
        // 替换操作 (编译模板) 用数据来编译
        this.compile(fragment);

        // 把替换完的数据重新给网页
        this.el.appendChild(fragment)



    }
    // 判断一个属性是否是一个指令
    isDirective(attrName){
        return attrName.startsWith("v-");   //返回的是boolean值
    }

    // 编译元素节点
    compileElement(node){
        let attributes=node.attributes;   //得到某个元素的属性节点  是个伪数组
        // console.log(attributes)
        [...attributes].forEach(attr=>{
            let {name,value:expr}=attr;   //解构赋值
            // console.log(expr)
            if(this.isDirective(name)){
                // console.log(name+"是一个指令");  //v-model
                let [,directive]=name.split('-');
                // console.log(directive) //model，将v-去掉
                ComplierUtil[directive](node,expr,this.vm);
            }
        })

    }
    // 编译文本节点
    compileText(node){
        let content=node.textContent;
        let reg=/\{\{(.+?)\}\}/;
        //reg.test(content) 如果content满足我们写的正则，返回true，否则false
        if(reg.test(content)){
            ComplierUtil["text"](node,content,this.vm);
        }

    }
    // 编译
    compile(node){
        // childNodes并不包含li得到的仅仅是子节点
        // console.log(node.childNodes) [text, input, text, div, text, div, text, ul, text]
        let childNodes=node.childNodes; 
        // console.log(Array.isArray(childNodes))  //得到的childNodes是一个伪数组
        [...childNodes].forEach(child=>{  //[...childNodes]将伪数组childNodes转变为真正数组
            if(this.isElementNode(child)){
                // console.log(child+"是一个元素节点")
                this.compileElement(child);
                // 可能一个元素节点中嵌套其他的元素节点，还可能嵌套文本节点
                // 如果child内部还有其他节点，需要利用递归重新编译
                this.compile(child);
            }else{
                // console.log(child+"得到的是文本节点")
                this.compileText(child);
            }
        })


    }
    // 判断一个节点是否是元素节点
    isElementNode(node){
        return node.nodeType===1;
    }
    // 将网页的HTML移到文档碎片中
    node2fragment(node){
        // 创建一个文档碎片
        let fragment=document.createDocumentFragment();
        let firstChild;
        while(firstChild=node.firstChild){
            fragment.appendChild(firstChild);
        }
        return fragment;
    }
}



// 写一个对象{}，包含了不同的指令对应不同的处理方法
ComplierUtil={
    getVal(vm,expr){
        // console.log(expr.split("."))   // ["school","name"]
        // 第一次data是vm.$data即 school:{name:xx,age:xx}，current 是school
        // 第二次data是school，current是name 即return data[current]==> school[current]
        return expr.split(".").reduce((data,current)=>{
            return data[current];
        },vm.$data);
        
    },
    setVal(vm,expr,value){
        // console.log(expr.split("."))   // ["school","name"]
        // 第一次data是vm.$data即 school:{name:xx,age:xx}，current 是school，index是0，arr是["school","name"]
        // 第二次data是undefined（没有处理累加，默认是undefined），current是name，index是1，arr是["school","name"]
        expr.split(".").reduce((data,current,index,arr)=>{
            // console.log(data)
            if(index==arr.length-1){
                // console.log(current)
                // console.log(data)
                return data[current]=value;
                // console.log(data[current])
                // console.log(111)
            }
            return data[current];
            
        },vm.$data)
    },
    model(node,expr,vm){  //node是带指令的元素节点，expr是表达式，vm是vue对象
        let value=this.getVal(vm,expr)
        let fn=this.updater["modelUpdater"]
        // 给输入框添加一个观察者，如果后面数据发生改变了，就通知观察者
        new Watcher(vm,expr,(newVal)=>{
            fn(node,newVal);
        })
        // 给input添加一个input事件，
        node.addEventListener("input",(e)=>{
            let value=e.target.value;
            this.setVal(vm,expr,value);
        })
        fn(node,value)
        
    },
    html(){

    },
    // 得到新的内容
    getContentValue(vm,expr){
        return expr.replace(/\{\{(.+?)\}\}/g,(...args)=>{
            return this.getVal(vm,args[1])
        });
    },
    text(node,expr,vm){
        // console.log(node) //"{{school.name}}"
        // console.log(expr) //{{school.name}} {{school.age}}
        // console.log(vm)
        let content=expr.replace(/\{\{(.+?)\}\}/g,(...args)=>{
            // console.log(vm)
            // console.log(args)
            new Watcher(vm,args[1],()=>{
                fn(node,this.getContentValue(vm,expr));
            })
            return this.getVal(vm,args[1])  //baida 100
        })
        let fn=this.updater["textUpdater"];

        fn(node,content)

    },
    // 更新数据
    updater:{
        modelUpdater(node,value){
            node.value=value;
        },
        htmlUpdater(){

        },
        // 处理文本节点
        textUpdater(node,value){
            // textContent得到文本节点中内容
            node.textContent=value
        }

    }
}

