/*
*  盛天抽奖类组件基类
*
*
* */
ST.Lottery = $.createClass($.Coms,function (_base) {
    //相关配置
    var config = {
         //与服务端通信的接口定义
         Action:{
             setup:"",                //用于服务端获取初始化信息
             start:"",               //用于服务端开始抽奖动作通知
             stop:"",                //用于服务端停止抽奖动作通知
             goon:"",                //用于服务端继续抽奖动作通知
             reset:"",               //用于服务端重置抽奖动作通知
             lotter:"",              //用于指向型抽奖动作
             random:""               //用于随即型抽奖动作
         },
         /*
         * 抽奖的规则,需由具体的抽奖方法扩展实现 ,
         * 会在抽奖动作上进行匹配验证,返回true或者flase
         * */
         Rule:function(){
            return true;
         }
    };
    //静态实例句柄
    var _instance=function(a,data){
        var t=this;
        if(!t.isEnable) return;
        if(!t.isShown) return;
        var action = t.config.Action;
        if(action[a]){
            ST.getJSON(action[a],data,function(j){
                t.changeState(a);
                t["on"+a] && t["on"+a](j);
            },function(){
                 ST.tipMsg("操作失败!");
            });
        }
    };
    return{
        id:"",
        name:"",
        //结果集合
        result:[],
        //初始化方法
        init: function (id,ops) {
            var t = this;
            t.config = $.extend({},config,ops);
            _base.init.call(t,id,ops);
            t.id = id;
            t.name= ops.name;
            delete t.init;
            return t;
        },
        isWorking:false,  //默认状态为停止
        changeState:function(a){
             var t=this;
             switch(a){
                 case "start":
                 case "goon":
                     t.isWorking = true;
                 break;
                 case "stop":
                 case "reset":
                     t.isWorking = false;
                  break;
             }
        },
        start:function(){
            var t=this;
            if(t.isWorking){
                _instance.call(this,"stop");
            }else{
                _instance.call(this,"start");
            }
        },
        stop:function(){
            if(this.isWorking)
                _instance.call(this,"stop");
        },
        goon:function(){
            if(!this.isWorking)
                 _instance.call(this,"goon");
        },
        reset:function(){
            _instance.call(this,"reset");
        },
        random:function(){
            _instance.call(this,"random");
        },
        lotter:function(id){
            _instance.call(this,"lotter",{id:id});
        },
        //销毁该组件
        dispose:function(){
             var t=this;
             //清空缓存
             //注销相关绑定事件
             t.hide();
        },
        //事件接口on+事件名 需由各自的示例去实现
        onstart:"",
        onstop:"",
        ongoon:"",
        onreset:"",
        onlotter:"",
        onrandom:""
    }
});