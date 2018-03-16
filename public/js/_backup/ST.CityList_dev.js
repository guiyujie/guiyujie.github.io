ST.CityList=function(ops){
	//静态数据 实际数据需要从服务端获取
	var CityData={plist:"",clist:"",xlist:""};
	//静态实例
	var _instance={
		//获取省份数据
		getPvs:function(){
			var t=this,
				a=[],
				s=t.config;
			if(s.nodefault) a.push({text:s.pText,value:-1});	
            $.each(CityData.plist,function(i,v){
                a.push({text:v.name,value:v.id});
            });
            return a;
        },
		//获取省份数据根据城市id
		getPvsByCity:function(c){
			var p=1;
			if(c){
                $.each(CityData.clist,function(i,v){
					if(v.getJson("id",c)){
						p=i;
						return false;
					}
                });
            }
			p = CityData.plist.getJson("id",p);
			//对应
			return {
				text:p.name,
				value:p.id
			};
		},
		//根据区域获取城市
		getCityByArea:function(c){
			var p=1;			
			if(c){
                $.each(CityData.xlist,function(i,v){
					if(v.getJson("id",c)){
						p=i;
						return false;
					}
                });
            }
			var a;
			for(var i in CityData.clist){
				if(a=CityData.clist[i].getJson("id",p)){
					p=a;
					break;
				}
			}
			//对应
			return {
				text:p.name,
				value:p.id
			};
		},
		//获取城市数据数据根据城市id
        getCity:function(c){
		   var t=this,
				a=[],
				s=t.config;
			if(s.nodefault) a.push({text:s.cText,value:-1});	
            if(c){
				if(CityData.clist[c]) $.each(CityData.clist[c],function(i,v){
                    a.push({text:v.name,value:v.id});
                });
            }
            return a;
        },
		//获取地区数据数据根据区域id
		getArea:function(c){
			 var t=this,
				a=[],
				s=t.config;
			if(s.nodefault) a.push({text:s.xText,value:-1});	
            if(c){
				if(CityData.xlist[c]) $.each(CityData.xlist[c],function(i,v){
                    a.push({text:v.name,value:v.id});
                });
            }
            return a;
		}
	}
	return {
		//变更城市内容
		setCityData:function(data){
			var t=this;
			t.$co.changeData(data);
			var cf=t.$co.data[0];
			t.$co.setText(cf.text);
			t.$co.scrollToTop();
			t.cid.val(cf.value);
			if(t.config.x){
				t.setAreaData(_instance.getArea.call(t,cf.value));
			}else{
				t.onChange&&t.onChange({p:t.pid.val(),c:t.cid.val(),x:t.xid.val()});
			}
		},
		//变更区域内容
		setAreaData:function(data){
			var t=this;
			t.$xo.changeData(data);
			var cf=t.$xo.data[0];
			t.$xo.setText(cf.text);
			t.$xo.scrollToTop();
			t.xid.val(cf.value);
			t.onChange&&t.onChange({p:t.pid.val(),c:t.cid.val(),x:t.xid.val()});
		},
		//初始化方法
		init:function(ops){
			var  t=this;
			 	 t.config={
				 	p:ops.p,   //省份选择div
					c:ops.c,   //城市选择div
					x:ops.x,   //县选择div
					pText:ops.pText||"请选择省份",
					cText:ops.cText||"请选择城市",
					xText:ops.xText||"请选择区域",
					data:ops.data,
					nodefault:ops.nodefault||false //无默认值
				 };
		
			var  c=t.config,pn,cn,bp=!1,cname,
			 	 pid=$("#"+c.p+"_val"),
				 cid=$("#"+c.c+"_val"),
				 xid=$("#"+c.x+"_val");
			t.pid = pid	 
			t.cid = cid;
			t.xid = xid;
			if(!pid.length) throw new Error("pid has not found!");
			if(!cid.length) throw new Error("cid has not found!");
			if(c.x&&!xid.length) throw new Error("xid has not found!");
			if(c.data) CityData = c.data;
			//初始化省份下拉框
			t.$po=ST.ddList(c.p,_instance.getPvs.call(t),function(e){
				pid.val(e.value); 
				t.setCityData(_instance.getCity.call(t,e.value));//变更城市数据
			});
			t.$co=ST.ddList(c.c,_instance.getCity.call(t,pn),function(e){
				 cid.val(e.value);
				 if(c.x){
				 	t.setAreaData(_instance.getArea.call(t,e.value));//变更区域数据
				 }else{
				 	t.onChange&&t.onChange({p:t.pid.val(),c:t.cid.val(),x:t.xid.val()});
				 }
			});
          	if(c.x){
				t.$xo=ST.ddList(c.x,_instance.getArea.call(t,cn),function(e){
					 xid.val(e.value);
					 t.onChange&&t.onChange({p:t.pid.val(),c:t.cid.val(),x:t.xid.val()});
				});	
			}
			
			if(!c.nodefault){
				//初始化城市选中值
				var cv,cd,pv,pd;
				if(xid.length && xid.val()!=''){					
					cd = _instance.getCityByArea(xid.val())//根据区域获取城市
				}else if(cv=cid.val() || cd){                    
					pd = _instance.getPvsByCity(cd?cd.value:cv);//根据城市获取省份
				}else if(pv=pid.val() || pd){
					pd = pd || {value:pv};
				}
				//初始化城市选中值
				if(cid.length && t.$co.data.length>0){
					if(!cd) cd=t.$co.data[0];
					t.$co.selByValue(cd.value);
				}
				//初始化省份选中值
				if(pid.length && t.$po.data.length>0){
					if(!pd) {
						pd=t.$po.data[0];
						t.$po.selByValue(pd.value);
					}else{
						t.$po.setText(pd.text);
						t.$po.setVal(pd.value);
					}
				}
			}else{
				t.$po.setText(c.pText);
				t.$co.setText(c.cText);
				pid.val("");
				cid.val("");
				if(c.x){
					t.$xo.setText(c.xText);
					xid.val("");
				}
			}
			delete t.init;
			return t;	
		},
		//隐藏控件
        hide:function(t){
            t=this;
            if(t.$po)t.$po.hide();
            if(t.$co)t.$co.hide();
			if(t.$xo)t.$xo.hide();
        },
		//销毁控件
        dispose:function(t){
            t=this;
            if(t.$po)t.$po.dispose();
            if(t.$co)t.$co.dispose();
			if(t.$xo)t.$xo.dispose();
        },
		//注册变更方法		
		onChange:""
	}.init(ops)
}
