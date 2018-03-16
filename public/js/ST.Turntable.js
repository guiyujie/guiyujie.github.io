/*
*继承方式实现
*优点:一致性好,代码重用性高,利于扩展维护
*缺点:代码难读,来源不明确
ST.Truntable=$.createClass(ST.Lottery,function (_base) {
    return {
        init:function(id,ops){
            var t=this;
            $.log("truntable");
            _base.init.call(t,id,ops);
            return t.init;
            return t;
        },
        onstart:function(){
            $.log("truntable onstart");
        }

    }
});
*/

 /*
*  盛天抽奖转盘
*  实例方式实现,
*  优点:代码比较直观,方法更加趋向业务
*  缺点:一致性较差,维护性较差.
* */
ST.Truntable = function(id,ops){
    var require = ["ST.Lottery","ST.LRes"];
    var config={
        speed:1000
    }
    return  {
        init: function (id,ops) {
            var t = this;
            require&&ST.getJsList(require,function(){
                require = "";
                t.setup(id,ops);
            },function(){
                alert(ST.LRes.RequireFail);
            });
            delete t.init;
            return t;
        },
        setup:function(id,ops){
            var t = this;
            t.config= $.extend({},config,ops);   //单独配置
            t.$lottery = new ST.Lottery(id, ops);
            t.$rotate = t.$lottery.Jid.find(".rotate"); //缓存指针
            //注册各类接口处理
            t.$lottery.onstart  =  function(j){
                t.startHandle(j);
            };
            t.$lottery.onstop =  function(j){
                t.stopHandle(j);
            };
        },
        _deg:0,
        roll:function(deg){
            var t=this,c= t.config;
            t.timer&&window.clearInterval(t.timer);
            if(deg!=undefined){
                t._deg = 360+deg;
                var a= c.speed/1000;
                t.$rotate.css({
                    "transition":"all "+a+"s ease-out 0s",
                    "transform":"rotate("+t._deg+"deg)"
                });
            }else{
                t.timer=window.setInterval(function(){
                    t._deg += 360*10/c.speed;
                    if(t._deg>360) t._deg-=360;
                    t.$rotate.css({
                        "transition":"all 0s ease-out 0s",
                        "transform":"rotate("+t._deg+"deg)"
                    });
                },10)
            }
        },
        startHandle:function(j){
            var t=this;
            //开始旋转转盘
            t.roll();
        },
        stopHandle:function(j){
            var t=this;
            t.timer&&window.clearTimeout(t.timer);
            //根据返回值计算结果位置,并停止旋转转盘
            $.log("num:"+j.data);
            t.roll(j.data*36);
        },
        dispose:function(){
            var t = this;
            t.$lottery.dispose();
            //注销自身绑定操作等
        }
    }.init(id,ops)
};
