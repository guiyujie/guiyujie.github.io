/*
	desc:盛天统计中心通用统计脚本
	author:guiyujie@163.com
	lastModify:2012-7-18
	
	相关说明:
	setting设置
	{
		siteid: "",     							//网站ID 		          (必选项) 默认无
		tjurl: "",      							//统计服务器URL			  (可选项) 默认统计中心地址   
		field: ["LocalMachine.Network.MACAddress", "NetBar.UserId"],         //统计系统信息字段  		(可选项) 默认["LocalMachine.Network.MACAddress", "NetBar.UserId"] 
		additionData:[], 							//统计需要额外发送的额外信息  (可选项) 默认为无  其实说明:可接参数类型 Array Function
	}
	
	发送数据说明
	{
		tid: siteid									//被统计站点id   @eg  id=999
		pv: 1                                       //pageview      @eg  pv=1                           备注:仅用于展示
		uv: 0||1                                    //独立访问       @eg  rt=1         					备注:仅用于展示
		systeminfo:                                 //统计系统信息    @eg  UserId[]=1045    
		pageurl: 									//统计当前页的URL @eg pageURL=http://www.baidu.com
		pid:										//统计入口id      @eg  pid=123     					备注:pid pid规则见代码注释部分 ,隐患:javascript执行的页面跳转会导致不准确
		linkurl                                     //统计a链接 href  @eg  linkurl="http://www.baidu.com" 备注:  javascript:; 不会被统计
		sid:                                        //统计a链接 广告   @eg  sid=123                     备注: 获取 a链接中 ST_TJ属性, 由人工加入
		opid                                        //统计pid入口页标识 @eg opid=1                       备注：如果是pid带入第一个页面则有此参数     
	}
	
*/
(function(setting) {
	if(!setting) return;
	var W = window,
	C = {},
	D = document,
	N = navigator,
	S = {
		siteid: "",     //网站ID
		tjurl: "",      //统计服务器URL
		tjview:true,     //是否统计展示
		tjstay:false,	 //是否统计停留时间
		isLocal:false,  //是否是本地网页
		notPageUrl:false,  //不统计页面地址,用于广告统计
		field: ["LocalMachine.Network.MACAddress", "NetBar.UserId"],       //统计
		additionData:[] //统计需要额外发送的信息接口
	};
	for (var i in S) {
		S[i] = (setting[i]!=undefined)?setting[i]:S[i];
	};
	function on(a, b, d) {
		b = b.replace(/^on/i, "").toLowerCase();
		a.attachEvent ? a.attachEvent("on" + b,
		function(b) {
			d.call(a, b)
		}) : a.addEventListener && a.addEventListener(b, d, !1)
	};
	if(!window.ST) window.ST={};
	ST.TJ2 = {
        _data:[],  //保障循序 _data存储key
        data:{},   //保障循序 data存储val
		debug:function(msg){
			console&&console.log(msg);
		},
		qs: function(a) {
			return (document.location.search.match(new RegExp("(?:^\\?|&)" + a + "=(.*?)(?=&|$)")) || ['', null])[1];
		},
		gc: function(n) {
			var a = document.cookie.match(new RegExp("(^| )" + n + "=([^;]*)(;|$)"));
			return a ? escape(a[2]) : a;
		},
		dc:function(n,d,p){
			var t=this;
			t.sc(n,"",-10000,d,p); 
		},
		sc: function(name, value, hour, domain, path) {
			if (typeof value == "object") {
				value = this.Obj2str(value);
			}
			var sc = name + '=' + (value + '');
			hour = Number(hour) || 12;
			path = path || '/';
			var date = new Date();
			date.setTime(date.getTime() + hour * 3600 * 1000);
			sc += ';expires=' + date.toGMTString();
			if (domain) sc += ';domain=' + domain;
			sc += ';path=' + path;
			document.cookie = sc;
		},
		Obj2str: function(o) {
			var t = this;
			if (o == undefined) {
				return "";
			}
			var r = [];
			if (typeof o == "string") return "\"" + o.replace(/([\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";
			if (typeof o == "object") {
				if (!o.sort) {
					for (var i in o) r.push("\"" + i + "\":" + t.Obj2str(o[i]));
					if ( !! document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
						r.push("toString:" + o.toString.toString());
					}
					r = "{" + r.join() + "}"
				} else {
					for (var i = 0; i < o.length; i++) r.push(t.Obj2str(o[i])) 
					r = "[" + r.join() + "]";
				}
				return r;
			}
			return o.toString().replace(/\"\:/g, '":""');
		},
		getAncestor: function(a, b) {
			for (a; a && a.tagName;) if (a.tagName.toLowerCase() == b) return a;
			else a = a.parentNode;
			return ! 1
		},
        getType:function(obj){
        	var type;
        	return (type=typeof(obj))=='object'?obj==null&&'null'||Object.prototype.toString.call(obj).slice(8,-1).toLowerCase():type;
    	},
		postData: function(d,em) {
			if(typeof d == "string") d=d.split("&");   //参数为字符串时转化为数组
			var t = this,tp;
			//添加系统信息
			if (t.sysData) {
				for (var i = 0; i < t.sysData.length; i++) {
					d.push(t.sysData[i]);
				}
			}
			//添加pid 用于统计入口网站
			if (t.pid) {
				d.push("pid=" + t.pid);
			} 
			//添加页面URL 用于统计访问页面URL
			if(!S.notPageUrl) d.push("pageurl=" + encodeURIComponent(t.pageURL));

			//附加数据
			if(S.additionData){
				var _data;
				if(tp=t.getType(S.additionData),tp=="array"){
					_data=S.additionData;
				}else if(tp=="function"){
					_data = S.additionData(em);
				}
				for (var i = 0; i < _data.length; i++) d.push(_data[i]);
			}
			(new Image(1, 1)).src = S.tjurl + 'tid=' + S.siteid + "&" + d.join("&") + "&r__d=" + (new Date).getTime();
		},
		tch: function() {
			var t = this;
			return function(b) {
				var b = b || W.event,
				el = b.srcElement || b.target,
				g = el,
				arr = [],
				href,
				url,
				mmId,
				dd;
				if (b.button && b.button != 0) return;
				a = t.getAncestor(el, "a");
				if (a) {
					url = a.href.match(/^http(?:s)?:\/\/([\w-\.]+)(?:\/|$)/i);
					mmId = a.getAttribute("ST_TJ");
					var isBtn = a.getAttribute("ST_BTN");
					if (!url && !mmId && !isBtn) return; //既不包含可统计的url 也不包含 统计的id 也不是Btn
					//保存统计
					var f=(/javascript:|#/.test(href=a.href)); //正则匹配是否是javascript脚本
					if(href!="undefined" && !f) arr.push("linkurl=" + encodeURIComponent(a.href)); //记录链接
					if(mmId) arr.push("sid=" + mmId); //如果存在特定内容
					if(isBtn) arr.push("btn=" + encodeURIComponent(a.innerHTML)); //如果为按钮,统计按钮文本
					t.postData(arr,a);
				}
			}
		},
		//获取systeminfo
		gs: function() {
			var t = this,
			a = window.sysinfo,
			b;
			var gd = function(a, b) {
				for (var i = 0,
				m; i < b.length, m = b[i]; a = a[m], i++) {
					if ((typeof a == "object") && a.length > 0) {
						for (var j = 0; j < a.length; j++) {
							gd(a[j], [m]);
						}
					} else {
						if (i == b.length - 1) {
							if (a == "" || a == undefined) return;
							if (a[m]) t.sysData.push(m + "[]=" + encodeURIComponent(a[m].toString()));
						}
					}
				}
			};
			if (a && S.field.length > 0) {
				t.sysData = [];
				for (var i = 0; i < S.field.length, b = S.field[i]; i++) {
					gd(a, b.split("."));
				}
			}
		},
		init: function() {
			var t = this,id=S.siteid,$d=new Date().getTime();
			if(!S.tjurl) throw new Error("未设置统计tjurl!");
			if(!S.siteid) throw new Error("未设置统计站点siteid!");
            //绑定页面点击事件,用于统计A链接点击
			on(D, "click", t.tch());
			t.gs();
			//展示相关变量
			var st_data = [],    //展示
                st_url= escape(document.URL),  								//展示URL
                st_ref = escape(document.referrer.substr(0, 512)), //展示引用地址
                st_lg = escape(navigator.systemLanguage),          //展示系统语言
                st_bn = (navigator.userAgent.match(/(IE|WebKit|Opera|Gecko)/) || [])[0],   //展示浏览器
                st_bv = navigator.userAgent.replace(/.+(?:ox|ion|sie|ra|me)[\/:\s]([\d\.]+).*$/i, '$1'), //展示浏览器版本
                st_screen = screen.width + 'x' + screen.height,  //展示分辨率
                st_ed = new Date(), //当前时间
                st_now = parseInt(st_ed.getTime()), //当前时间毫秒
                st_a = (parseInt(t.gc("st_a_" + id)) + 1) || 1,     //访问次数
                st_rt = parseInt(t.gc("st_uv_" + id)) ? 0 : 1, //展示uv
                st_lt = parseInt(t.gc("st_lt_" + id)) || st_now, //展示上次访问时间
                st_st = parseInt((st_now - st_lt) / 1000);          //展示间隔时间
			
			
			t.pageURL = st_url; //记录当前页面URL
			//pid相关
			//有引用页 添加全局pid
			var a = st_url.match(/\/pid\/(\d+)/i);
				a = a?a[1]:t.qs("pid");
			//是否是本地
			if(S.isLocal){
				a && t.sc("st_pid_tj",a);
			}else{
				if(st_ref){
					if(st_ref.split('/')[2]!=document.domain){
						if(a){
							t.sc("st_pid_tj",a); //保存pid
						}else{
							//针对外链过来,没有带pid的情况,删除记录的pid
							t.dc("st_pid_tj");	  //删除pid
						}
					}
					//针对无引用地址的静态页面访问
				}else{
					if(a){
						t.sc("st_pid_tj",a); //保存pid
					}else{
						//针对静态页面过来,没有带pid的情况,删除记录的pid
						t.dc("st_pid_tj");	  //删除pid
					}
				}
			}
			t.pid=t.gc("st_pid_tj"); //记录pid
			
			if(S.tjview) {
				//统计展示 相关计算
				/*
					2次访问时间对比 确定uv
				*/
				if (t.gc("st_lt_" + id) != null) {
					var dd = new Date(st_lt),
					d1 = st_ed.getDate(),
					d2 = dd.getDate();
					if (d2 != d1) st_rt = 1;
				}
				
				if (st_lt < 0) {
					st_rt = 0;
				}
				if (st_rt < 1) st_rt = 0;
				st_data.push("pv=1");//记录pv
				st_data.push("uv=" + st_rt);//记录uv
				if(a)  st_data.push("opid=1");//记录展示opid=1;
				t.postData(st_data);//发送展示数据
				
				var st_et = (86400 - st_ed.getHours() * 3600 - st_ed.getMinutes() * 60 - st_ed.getSeconds());
					st_ed.setTime(st_now + 1000 * (st_et - st_ed.getTimezoneOffset() * 60));
					
				document.cookie = "st_a_" + id + "=" + st_a + ";expires=" + st_ed.toGMTString() + "; path=/";
				st_ed.setTime(st_now + 1000 * 86400 * 182);
				if (t.gc("st_uv_" + id) == null) {
					document.cookie = "st_uv_" + id + "=" + st_rt + ";expires=" + st_ed.toGMTString() + ";path=/";
				}
				document.cookie = "st_lt_" + id + "=" + st_now + ";expires=" + st_ed.toGMTString() + ";path=/";
			}
			if(S.tjstay){
				 on(W, "unload", function(){
					 var stay = new Date().getTime();
					 stay -= $d;
					 t.postData(["stay="+stay]);//发送停留时长数据
				 });
			}
			delete this.init;
			return this;
		}
	};
	//基本容错处理
	try{
		ST.TJ2.init();
	}catch(e){
		ST.TJ2.debug(e.message);
	}
})(century_setting||"");