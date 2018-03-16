//使用方式,参数格式待优化
ST.Effect={
    flash:function(o,ops){
        //css3 suppout
        //js done
        $(o).clearQueue("flash");
        var _queen=[
            function(){$(o).animate({opacity:'0.3'},50,fn)},
            function(){$(o).animate({opacity:'1'},100,fn)},
            function(){$(o).animate({opacity:'0.3'},100,fn)},
            function(){$(o).animate({opacity:'1'},100,fn)},
            function(){$(o).animate({opacity:'0.3'},100,fn)},
            function(){$(o).animate({opacity:'1'},50,function(){
                ops.callback&& ops.callback();//效果完成回调
            })}
        ];
        var fn=function(){
            $(o).dequeue("flash");
        };
        $(o).queue("flash",_queen);
        fn();
    },
    shake:function(o,ops){
        //css3 suppout
        //js done
        $(o).clearQueue("shake");
        var _queen=[
            function(){$(o).animate({left:'-=50px'},50,fn)},
            function(){$(o).animate({left:'+=100px'},100,fn)},
            function(){$(o).animate({left:'-=100px'},100,fn)},
            function(){$(o).animate({left:'+=100px'},100,fn)},
            function(){$(o).animate({left:'-=50px'},50,function(){
                ops.callback&& ops.callback();//效果完成回调
            })}
        ];
        var fn=function(){
            $(o).dequeue("shake");
        }
        $(o).queue("shake",_queen);
        fn();
    }
}
//函数劫持方式
for(var i in ST.Effect){
    ST.AOP.hook(ST.Effect,i,{
        before:function(){
            //todo
            var args = Array.prototype.slice.call(arguments);
            //检测参数是否合法
            $.log(args);
            //根据配置决定效果根据什么方式, 克隆 or Wrap or none

            return true;
        },
        after:function(){

        }
    })
}