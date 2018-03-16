ST.Switch=function(ops){
    return {
        debug:function(e){
            ST.tipMsg({error:e},5000,true);
        },
        //初始化
        init:function(ops){
            var t=this,
                s={
                    ctrlId:"",
                    evType:"click",
                    dir:0,    //0 1
                    step:1,          //步长
                    time:200,            //默认800毫秒
                    activeCss:"current", //激活后样式
                    effect:"swing"		,  //效果种类
                    data:[],         //数据
                    auto:false,      //自动播放
                    autotime:3000,   //默认3秒
                    mode:"",         //模式 loop 循环模式
                    toggle:false,    //是否开关
                    num:8,           //
                    rollmode:0,      //默认为0 组滚动模式 1 溢出滚动模式 2单项滚动模式
                    selected:0,  	//默认选中
                    noAn:0,    //是否具备动画效果
                    bgtag:"",  //背景标签
                    btnRollOnly:false,
                    lr:"bg",    //定义左右按钮在哪个上面
                    onactive:""
                };
            t.setting=s;
            //填充参数
            $.extend(s,ops);
            t.Jid=$(s.ctrlId);

            if(t.Jid.length<1)
                t.debug(t.LRes.initError);

            $.extend(s,{
                containerwrap:t.Jid.find(".switch_container_wrap"), //切换容器包
                container:t.Jid.find(".switch_container"),          //切换容器
                ctrlarea:t.Jid.find(".switch_ctrlarea"),   //控制区域
                ctrls:t.Jid.find(".switch_ctrl"),          //切换控制器
                items:t.Jid.find(".switch_item"),          //切换项
                lbtn:t.Jid.find(".switch_prev"),           //切换左按钮
                rbtn:t.Jid.find(".switch_next"),           //切换右按钮
                title:t.Jid.find(".switch_title"),         //切换标题
                tlink:t.Jid.find(".switch_tlink"),         //切换链接
                left:t.Jid.find(".switch_left"),           //图片左按钮
                right:t.Jid.find(".switch_right"),          //图片右按钮
                bg:t.Jid.find(".switch_bg")                //切换背景
            });

            t.curIdx=s.selected;								 //当前位置
            t.curPage=(s.selected/s.num)|0;         //当前页
            t.curPos=t.curPage%s.num + (t.curPage>1?t.curPage-1:0)*s.num;//当前位置
            t.activedId=0;                           //当前激活

            if(!s.items.length) s.items=s.ctrls;

            t.itemInfo=t.getWH(s.items[0]);         //获取项高宽信息
            t.containerWrapInfo = t.getWH(s.containerwrap);//获取容器包裹信息
            t.containerInfo = t.getWH(s.container);//获取容器高宽信息

            t.initEvent(); //初始化事件
            t.onactive=s.onactive;
            t.onhide= s.onhide;
            ~s.selected&&t._active(s.selected);
            //hack个数不够
            if(s.mode=="loop"){
                if(s.items.length< s.num) {
                    s.mode="";
                    s.left.hide();
                    s.right.hide();
                }else if(s.items.length<s.num*2){
                    s.container.find(".switch_item").clone().appendTo(s.container);
                    s.items=t.Jid.find(".switch_item");
                }
            }
            //if(s.items.length<s.num) {s.lbtn.hide();s.rbtn.hide()};

            delete t.init;
            return t;
        },
        //初始化事件
        initEvent:function(){
            var t=this,s=t.setting;
            //左按钮
            if(s.lbtn.size()>0){
                s.lbtn.bind("click",function(e){
                    if(s.container.length>0){
                        t[s.btnRollOnly?"_btnSwitch":"_switch"](-1);
                    }else{
                        t._active(--t.curIdx);
                    }
                });
            }
            //右按钮
            if(s.rbtn.size()>0){
                s.rbtn.bind("click",function(e){
                    if(s.container.length>0){
                        t[s.btnRollOnly?"_btnSwitch":"_switch"](1);
                    }else{
                        t._active(++t.curIdx);
                    }
                });
            }
            //控制区域
            if(s.ctrlarea.size()>0){
                //mousemove click
                s.ctrlarea.bind(s.evType,function(e){
                    var em=e.target;
                    //包含a标签
                    if(em&&em.tagName.contains(/^(a|li)$/i)&&$(em).data('idx')!=undefined||(em=em.parentNode,em.tagName.contains(/^(a|li)$/i))){
                        var idx = $(em).data('idx'),cancel=$(em).data('cancle');
                        if(cancel) return;
                        if(idx=="undefined") return;
                        if(idx==t.curIdx) {
                            if(s.toggle){
                                t.onhide&&t.onhide(idx);
                            }
                            return;
                        }
                        var dir = idx > t.curIdx ? 1 : -1;
                        var step = Math.abs(idx-t.curIdx);
                        if(s.container.length>0){
                            if(s.btnRollOnly) {t.curIdx = idx; t._active(idx);}
                            else t._switch(dir,step);
                        }else{
                            t.curIdx = idx;
                            t._active(idx);
                        }
                    }
                });
            }
            if(s.left.length){
                // $.log("test");
                t.Jid.hover(function(){
                    s.left.stop().animate({
                        left:0
                    },200);
                    s.right.stop().animate({
                        right:0
                    },200,"swing");
                },function(){
                    s.left.stop().animate({
                        left:-60
                    },200);
                    s.right.stop().animate({
                        right:-60
                    },200,"swing");
                });
                s.left.bind("click",function(e){
                    if(s.container.length>0){
                        t[s.btnRollOnly?"_btnSwitch":"_switch"](-1);
                    }else{
                        t._active(t.curIdx--);
                    }
                });
                s.right.length&&s.right.bind("click",function(e){
                    if(s.container.length>0){
                        t[s.btnRollOnly?"_btnSwitch":"_switch"](1);
                    }else{
                        t._active(t.curIdx++);
                    }
                });
            }
            //项
            //自动
            if(s.auto){
                t._autoPlay();
                t.Jid.bind("mouseover",function(e){
                    if($.isMouseLeaveOrEnter(e,this)){
                        t._stopPlay();
                    }
                }).bind("mouseout",function(e){
                        if($.isMouseLeaveOrEnter(e,this)){
                            t._autoPlay();
                        }
                    });
            }
        },
        _autoPlay:function(){
            var t=this,s=t.setting;
            t.ap&&window.clearInterval(t.ap);
            t.ap=window.setInterval(function(){
                if(s.mode=="loop"){
                    t._loopFix(1);
                    t._switch(1);
                }else{
                    if(t.curIdx>=s.items.length-1){
                        t._switch(-1,10000);//设置一个很大的值
                    }else{
                        t._switch(1);
                    }
                }
            },s.autotime);
        },
        _stopPlay:function(){
            var t=this;
            t.ap&&window.clearInterval(t.ap);
        },
        //计算位置,多种滚动模式
        _calPos:function(b,dir){
            var t=this,s=t.setting;
            if(s.rollmode==1){
                //0  溢出滚动模式
                if(( b < t.curPos+s.num && b >= t.curPos)) {
                    return;
                }else{
                    var _v=t.curIdx>1?t.curIdx+1:0;
                    if(dir==1){
                        t.curPos += _v-t.curPos-s.num ;
                    }else{
                        t.curPos -= s.step;
                    }
                }
            }else if(s.rollmode==2){
                // 2单项滚动模式
                t.curPos = t.curIdx>s.items.length-s.num?s.items.length-s.num:t.curIdx;
            }
        },
        //按钮切换
        _btnSwitch:function(dir){
            var t=this,c,d,
                s=t.setting;
            switch(s.rollmode){
                case 1:
                case 2:
                    d=s.step;
                    break;
                default:
                    d=s.num
                    break;
            }
            if(dir==1)t.curPos+=d;
            else t.curPos-=d;

            if(t.curPos<0) t.curPos=0;
            if(t.curPos>s.items.length-s.num) t.curPos=s.items.length-s.num;

            c=t.curPos*t[!s.rollmode?"containerWrapInfo":"itemInfo"][s.dir?"h":"w"];
            t._roll(c);
            t.updateBtn();
        },
        //切换
        _switch:function(dir,step){
            var t=this,s=t.setting;
            var ss=step||s.step;
            var a,b,c;
            if(s.container.length && t.rolling) return;
            if(s.mode=="loop"){
                t._loopFix(dir==1?1:0);
            }
            switch(dir){
                case -1:
                    b = (t.curIdx-ss)>0?t.curIdx-ss:0;
                    a = (b/s.num)|0;
                    c = (s.rollmode?t.curPos-ss:a) * t[!s.rollmode?"containerWrapInfo":"itemInfo"][s.dir?"h":"w"];
                    c = (c>t.containerInfo[s.dir?"h":"w"]-t.containerWrapInfo[s.dir?"h":"w"])?t.containerInfo[s.dir?"h":"w"]-t.containerWrapInfo[s.dir?"h":"w"]:c;
                    break;
                case 1:
                    b = ((t.curIdx+ss)>s.items.length-1)?s.items.length-1:t.curIdx+ss;
                    a = (b/s.num)|0;
                    c = (s.rollmode?(t.curPos+ss>s.items.length-s.num?s.items.length-s.num:t.curPos+ss):a) * t[!s.rollmode?"containerWrapInfo":"itemInfo"][s.dir?"h":"w"];
                    c = (c>t.containerInfo[s.dir?"h":"w"]-t.containerWrapInfo[s.dir?"h":"w"])?t.containerInfo[s.dir?"h":"w"]-t.containerWrapInfo[s.dir?"h":"w"]:c;
                    break;
            }
            t._active(b);//激活选中
            t._calPos(t.curIdx,dir); //计算位置,多种滚动模式
            //激活元素
            t._roll(c);
        },
        /*
         滚动
         */
        _roll:function(c){
            var t=this,s=t.setting;
            if(!s.noAn){
                t.rolling=true;
                var setting=s.dir?{"margin-top":"-"+c+"px"}:{"margin-left":"-"+c+"px"};
                s.container.stop(true,true).animate(setting, s.time,s.effect,function(){
                    t.rolling=false;
                });
            }else{
                s.container.css(s.dir?"marginTop":"marginLeft","-"+c+"px");
            }
        },
        changeBg:function(idx){
            var t=this,s=t.setting,imgs=s.bg.find(s.bgtag||"a");
            if(imgs.size()==0){
                s.bg.href=s.data.length?s.data[idx].bg:$(s.items[idx]).find("img").attr('bsrc');
            }else{
                var img = imgs.eq(idx);
                if(!t.$lastIndex) t.$lastIndex=2;
                img.css({"z-index":t.$lastIndex++,"opacity":0}).stop(true,true).animate({
                    "opacity":1
                }, 500);
                /*
                 imgs.each(function(i){
                 $(this).stop(true,true).animate({
                 "z-index":(i==idx)?"2":"1",
                 "opacity":(i==idx)?"1":"0"
                 }, 1000);
                 })
                 */
            }
        },
        //激活
        _active:function(idx){
            var t=this,s=t.setting,em;
            var _cs = s.ctrls.length?s.ctrls:s.items;
            em=_cs.removeClass(s.activeCss).eq(idx).addClass(s.activeCss);
            s.bg && t.changeBg(idx);
            t.onactive&&t.onactive(idx,em);
            t.curIdx=idx;
            //更改按钮样式
            t.updateBtn();
        },
        reset:function(){
            var t=this,s=t.setting;
            var _cs = s.ctrls.length?s.ctrls:s.items;
            _cs.removeClass(s.activeCss)
            t.curIdx=-1;
        },
        /*更新按钮样式*/
        updateBtn:function(){
            var t=this,s=t.setting;
            s.lbtn.toggleClass("gray",t.curPos<=0);
            s.rbtn.toggleClass("gray",t.curPos>=s.items.length-s.num);
        },
        resizeHandle:function(){
            var t=this,
                s=t.setting;
            s.ctrls=t.Jid.find(".switch_ctrl");
            if(s.ctrls.length<1) return;
            //重置当前页
            t.containerInfo = {"w":s.container.width(),"h":s.container.height()}
            t.containerWrapInfo = t.getWH(s.containerwrap);//获取容器包裹信息
            //$.log("curWidth:"+s.container.width()+",curHeight:"+s.container.height());
            if(t.curIdx>s.ctrls.length-1){
                t._switch(-1,Math.abs(s.ctrls.length-1-t.curIdx))
            }else{
                t._active(t.curIdx);
            }
        },
        _loopFix:function (dir) {
            var t=this,s=t.setting,a=(s.dir?"marginTop":"marginLeft");
            if(dir) {
                if(t.curIdx+s.step>s.num) {
                    s.container.find(".switch_item:lt("+s.step+")").appendTo(s.container);
                    s.container.css(a,"0px");
                    t.curIdx=0;
                    t.curPos=0;
                    s.items=t.Jid.find(".switch_item");
                }
            }else{
                if(t.curIdx-s.step<0) {
                    s.container.find(".switch_item:gt("+(s.items.length-s.step-1)+")").prependTo(s.container);
                    s.container.css(a,"-"+s.step*t.itemInfo[s.dir?"h":"w"]+"px");
                    t.curIdx=s.step;
                    t.curPos+=s.step;
                    s.items=t.Jid.find(".switch_item");
                }
            }
        },
        getSelected:function(){
            var t=this,s=t.setting;
            return s.ctrls[this.curIdx];
        },
        //获取高宽
        getWH:function(el){
            var t=this;
            var itemInfo={"w":0,"h":0},tmp=$(el);
            if(tmp.size()>0){
                itemInfo={"w":tmp.outerWidth(true),"h": tmp.outerHeight(true)}
            }
            return itemInfo;
        },
        //获取语言信息
        LRes:(function(k){
            $.extend(ST.LRes,{
                initError:{'zh-CHS':'slider初始化失败'}[k]
            });
            return ST.LRes;
        }('zh-CHS')),
        ondrag:null,
        ondragend:null,
        onactive:null,
        onhide:null
    }.init(ops);
};