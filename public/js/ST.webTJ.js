/*
	desc:盛天统计中心通用统计脚本
	author:guiyujie@163.com
	lastModify:2012-10-11

	相关说明:
	setting设置
	{
		siteid: "",     							//网站ID 		          (必选项) 默认无
		tjurl: "",      							//统计服务器URL			  (可选项) 默认统计中心地址   
		field: ["NetBar.UserId"],         //统计系统信息字段  		(可选项) 默认["LocalMachine.Network.MACAddress", "NetBar.UserId"]
		additionData:[] 							//统计需要额外发送的额外信息  (可选项) 默认为无  其实说明:可接参数类型 Array Function
	}
	
	发送数据说明
	{
http://dssp.stnts.com:8888/opt=put&mq=webjs&data=tid=5&pid=0&opid=0&pv=1&uv=1&gid=0&showurl=urlencode(‘http://www.58kankan.cn’)&click=0&sid=0&btntxt=&linkdomain=
备注：详细数据说明参见dpsp数据文档
	}
*/
(function(setting) {
	if(!setting) return;
	var W = window,
        C = {},
        D = document,
        S = {
            siteid: "",     //网站ID
            tjurl: "http://dssp.stnts.com:8888/opt=put&mq=webjs&data=",      //统计服务器URL
            tjview:true,     //是否统计展示
            tjstay:true,	 //是否统计停留时间
            isLocal:false,  //是否是本地网页
            notPageUrl:false,  //不统计页面地址,用于广告统计
            field: ["NetBar.UserId"],       //统计
            rule:/((?:(?:[0-9]{1,3}\.){3}[0-9]{1,3})|[\w-]+\.(?:com|net|org|gov|cc|biz|info|cn|co|tv|de|edu|jp|kr|tw)(\.(?:cn|hk|uk|de|jp|kr|tw))*)$/i,
            additionData:[] //统计需要额外发送的信息接口
        };
    for (var i in S) {
        S[i] = (setting[i]!=undefined)?setting[i]:S[i];
    };
	function on(a, b, d) {
		b = b.replace(/^on/i, "").toLowerCase();
		a.attachEvent ? a.attachEvent("on" + b,function(b) {
			d.call(a, b)
		}) : a.addEventListener && a.addEventListener(b, d, !1)
	};
	if(!window.ST) window.ST={};
	ST.webTJ = {
        //指标
        order:["pid","opid","pv","uv","gid","showurl","click","sid","btntxt","linkdomain"],
        //指标默认值
        quota:{
            "pid":0,
            "opid":0,
            "pv":0,
            "uv":0,
            "gid":0,
            "showurl":"",
            "click":0,
            "sid":0,
            "btntxt":"",
            "linkdomain":""
        },  //保障循序 quota存储key
        //数据
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
			/*
            if (typeof value == "object") {
				value = this.Obj2str(value);
			}
			*/
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
        /*
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
		*/
		getAncestor: function(a, b) {
			for (a; a && a.tagName;) if (a.tagName.toLowerCase() == b) return a;
			else a = a.parentNode;
			return ! 1
		},
        getType:function(obj){
        	var type;
        	return (type=typeof(obj))=='object'?obj==null&&'null'||Object.prototype.toString.call(obj).slice(8,-1).toLowerCase():type;
    	},
		postData: function(em) {
			var t = this,tp,d=t.serData();
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
				b = b || W.event;
				var el = b.srcElement || b.target,
				url,
				mmId;
				if (b.button && b.button != 0) return;
				var a = t.getAncestor(el, "a");
				if (a) {
					url = a.href.match(/^http(?:s)?:\/\/([\w-\.]+)(?:\/|$)/i);
					mmId = a.getAttribute("ST_TJ");
					var isBtn = a.getAttribute("ST_BTN");
					if (!url && !mmId && !isBtn) return; //既不包含可统计的url 也不包含 统计的id 也不是Btn
					//保存统计
					var f=(/javascript:|#/.test(a.href)); //正则匹配是否是javascript脚本
                    if(mmId) t.data.sid = mmId;          //收集特定内容sid
                    if(isBtn) t.data.btntxt = encodeURIComponent(a.innerHTML);   //收集特定按钮文本
                    if(url[1]!="undefined" && !f){
                        var dd;
                        if(dd=url[1].match(S.rule)){
                            dd=encodeURIComponent(dd[1]);
                            t.data.linkdomain = dd || t.quota.linkdomain;   //收集链接domain
                        }
                    }
                    t.data.click = 1;
					t.postData(a);
                    t.data.click = t.quota.click;
                    t.data.sid   =  t.quota.sid;
                    t.data.btntxt =  t.quota.btntxt;
                    t.data.uv  =   t.quota.uv;
                    t.data.linkdomain = t.quota.linkdomain;
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
                            if (a[m]) {
                                t.data.gid =  encodeURIComponent(a[m].toString());       //搜集gid
                                //t.sysData.push(m + "[]=" + encodeURIComponent(a[m].toString()));
                            }
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
			var t = this,c,id=S.siteid,$d=new Date().getTime();
			if(!S.tjurl) throw new Error("未设置统计tjurl!");
			if(!S.siteid) throw new Error("未设置统计站点siteid!");
            //绑定页面点击事件,用于统计A链接点击
			on(D, "click", t.tch());
            t.gs();     //搜集gid
			//展示相关变量
			var st_url = encodeURIComponent(document.URL),  								//展示URL
                st_ref = encodeURIComponent(document.referrer.substr(0, 512)), //展示引用地址
                st_ed = new Date(), //当前时间
                st_now = parseInt(st_ed.getTime()), //当前时间毫秒
                st_a = (parseInt(t.gc("st_a_" + id)) + 1) || 1,     //访问次数
                st_rt = parseInt(t.gc("st_wjuv_" + id)) ? 0 : 1, //展示uv
                st_lt = parseInt(t.gc("st_wjlt_" + id)) || st_now; //展示上次访问时间

			t.data.showurl = st_url;
			//pid相关
			//有引用页 添加全局pid
			var a = st_url.match(/\/pid\/(\d+)/i);
				a = a?a[1]:t.qs("pid");
			//是否是本地
			if(S.isLocal){
				a && t.sc("st_wjpid_webtj",a);
			}else{
				if(st_ref){
					if(st_ref.split('/')[2]!=document.domain){
						if(a){
							t.sc("st_wjpid_tj",a); //保存pid
						}else{
							//针对外链过来,没有带pid的情况,删除记录的pid
							t.dc("st_wjpid_tj");	  //删除pid
						}
					}
					//针对无引用地址的静态页面访问
				}else{
					if(a){
						t.sc("st_wjpid_tj",a); //保存pid
					}else{
						//针对静态页面过来,没有带pid的情况,删除记录的pid
						t.dc("st_wjpid_tj");	  //删除pid
					}
				}
			}
            t.data.pid = t.gc("st_wjpid_tj"); //收集pid
			
			if(S.tjview) {
				//统计展示 相关计算
				/*
					2次访问时间对比 确定uv
				*/
				if (t.gc("st_wjlt_" + id) != null) {
					var dd = new Date(st_lt),
					d1 = st_ed.getDate(),
					d2 = dd.getDate();
					if (d2 != d1) st_rt = 1;
				}
				
				if (st_lt < 0) {
					st_rt = 0;
				}
				if (st_rt < 1) st_rt = 0;
                t.data.pv = 1;         //收集pv
                t.data.uv = st_rt;    //收集uv
				if(a)  t.data.opid = 1;//记录展示opid=1; 收集opid
                t.postData();//发送展示数据
                t.data.pv = t.quota.pv;         //恢复pv默认值
                t.data.uv = t.quota.uv;         //恢复uv默认值
                t.data.opid = t.quota.opid;    //恢复opid默认值

				var st_et = (86400 - st_ed.getHours() * 3600 - st_ed.getMinutes() * 60 - st_ed.getSeconds());
					st_ed.setTime(st_now + 1000 * (st_et - st_ed.getTimezoneOffset() * 60));
					
				document.cookie = "st_wja_" + id + "=" + st_a + ";expires=" + st_ed.toGMTString() + "; path=/";
				st_ed.setTime(st_now + 1000 * 86400 * 182);
				if (t.gc("st_wjuv_" + id) == null) {
					document.cookie = "st_wjuv_" + id + "=" + st_rt + ";expires=" + st_ed.toGMTString() + ";path=/";
				}
				document.cookie = "st_wjlt_" + id + "=" + st_now + ";expires=" + st_ed.toGMTString() + ";path=/";
			}
			delete this.init;
			return this;
		},
        /*
        *序列化     优化考虑是否一次执行
        * */
        serData:function(){
            var t=this,a= t.order,b=t.data,arr=[];
            if(typeof(S.serData)=="function"){
                arr = S.serData(b);
                //赋默认值
                for(var i in t.quota){
                    //存在0或""的转化
                    arr[i] = arr[i] || t.quota[i];
                }
            }else{
                //保障浏览器兼容顺序执行
                for(var i=0;i<a.length;i++){
                    arr.push(a[i]+"="+(b[a[i]] || t.quota[a[i]]));
                }
            }
            return arr;
        }
	};
	//基本容错处理
	try{
		ST.webTJ.init();
	}catch(e){
		ST.webTJ.debug(e.message);
	}
})(century_setting||"");

//order quota 指标和顺序可考虑外部配置