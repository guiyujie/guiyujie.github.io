/*
	省市选择插件ST.CitySelect
	last modified by ZS 2013-04-09
*/
ST.CitySelect = function(ops) {
	//默认配置
	var config = {
		id: '',
		data: ST.cityData,
		readOnly:false,
    templ:'common_citySel_temp'
	}
	return {
		//初始化
		init: function() {
			var t = this;
			t.setting = config;
			$.extend(t.setting, ops);
			var s = t.setting;
			t.Jid = $('#' + s.id);
			if (t.Jid.length == 0 || !s.data) return;
			t.valIpt = $('#' + s.id + '_val');
			if (t.valIpt.length == 0) {
				t.Jid.append('<input type="hidden" id="' + s.id + '_val" name="city" value="" />');
			}
			t.$c = {
				'plist': $('#' + s.id + '_plist'),
				'clist': $('#' + s.id + '_clist'),
				'btn': $('#' + s.id + '_btn')
			};
			t.show();
			if(t.valIpt.val()){
				var _val=t.valIpt.val();
				t.filter(_val);
				t.vals=_val.split(',');
			}else{
        t.vals = [];
      }
			t.initEvents();
			delete t.init;
			return t;
		},
		//初始化事件
		initEvents: function() {
			var t = this, s = t.setting, c = t.$c;
			t.Jid.bind('click.citysel', function(e) {
				var em = $(e.target), method = em.data('method');
				if (!method) return;
				var pars = em.data('pars'), oPars = { em: em };
				if (pars) {
					pars = pars.split(',');
					for (var i = 0, l = pars.length, d; i < l, d = pars[i]; i++) {
						d = d.split(':');
						oPars[d[0]] = d[1];
					}
				}
				t[method] && t[method].call(t, oPars);
			});
			c.btn.bind('click.citysel', function() {
				t.filter();
			});
			t.bindChkEvent('plist');
			t.bindChkEvent('clist');
		},
		/*
			显示选项：载入数据
			@pars
				type 类型(plist/clist)
				data 数据
		*/
		show: function(type, data) {
			var t = this, s = t.setting;
			if (!type) type = 'plist';
			if (!data) data = t.formatData(type);
			ST.JTE.fetch(s.templ||'common_citySel_temp').toFill(s.id + '_' + type, {
				type: type, data: data ,readOnly:s.readOnly
			});
		},
		/*
			数据格式化
			@pars
				type 类型(plist/clist)
			@return
				格式化后的数据
		*/
		formatData: function(type) {
			var t = this, s = t.setting;
			if (!type) type = 'plist';
			var data = s.data, dlist = data[type], _data = [], pn = 0, j = 0;
			$.each(dlist, function(k, dl) {
        k = k+'';
        var d = type=='plist'?data['alist'].getJson('id',k): t.getPvsById(k);
        if(!d) return false;
				_data[j] = {
					id: d.id,
					name: d.name,
					data: dl||[]
				};
				if(type == 'plist') pn+=_data[j].data.length;
				j++;
			});
			if(type == 'plist') t.plist_num = pn + j;
			return _data;
		},
		/*
			筛选：根据选中值或选中项
			@pars
				vals 选中值
			@return
				格式化后的数据
		*/
		filter: function(vals) {
			var t = this, s = t.setting, c = t.$c,
				_data, data = [], cn=0, flag = vals?true:false;
			if (!t.citydata) t.citydata = t.formatData('clist');
			_data = t.citydata.slice(0);
			if(!vals){
				vals = [];
				var chk = c['plist'].find('input[data-pid]:checked');
				chk.each(function() {
					vals.push($(this).data('id')+'');
				});
			}else{
				var _arr=[],_vals=vals.split(',');
				for (var j = 0, jl = _vals.length, jd; j < jl, jd = _vals[j]; j++) {
					var p=t.getPvsBycid(jd);
					if(p) _arr.push(p.id);
				}
				vals=_arr;
			}
			for (var i = 0, l = _data.length, d; i < l, d = _data[i]; i++) {
				if (vals.getIndex(d.id+'') > -1) {
					if(flag&&_vals&&_vals.length>0){
						var _d=[];
						for(var k=0, kl = d.data.length, kd; k < kl, kd = d.data[k]; k++){
							_d.push({
								id:kd.id,name:kd.name,
								checked:_vals.getIndex(kd.id)>-1?'true':''
							});
						}
						data.push({id:d.id,name:d.name,data:_d});
					}else{
						data.push(d);
					}
					if(d.data) cn+=d.data.length;
				}
			}
			if(data.length==0) return;
			t.show('clist',data);
			if(!flag) t.valIpt.val('');
			t.clist_num = cn + data.length;
			t.bindChkEvent('clist');
		},
		/*
			检测是否全选：根据选中项数量
			@pars
				em 全选项jq对象
				type 类型(plist/clist)
		*/
		isChkAll: function(em,type){
			var t = this, s = t.setting, c = t.$c,flag = false;
			if(!type) type='plist';
      flag = em.attr('id')!='chkall_'+type;
      if(flag){
        var chkall=$('#chkall_'+type),pid=em.data('pid');
        if(pid){
          var p=c[type].find('input[data-id][data-id='+pid+']'),_num=parseInt(p.data('num'),10);
          var subchks=c[type].find('input[data-pid][data-pid='+pid+']').filter(':checked');
          p.attr('checked',subchks.length==_num);
        }
        var chks=c[type].find('input:checkbox:not(:first)').filter(':checked');
        chkall.attr('checked',chks.length==t[type+'_num']);
        if(type=='clist') t.onpvsSelect && t.onpvsSelect(pid||em.data('id'),pid?subchks.length==_num:!!(em.attr('checked')));
      }else{
        if(type=='clist') t.onpvsSelect && t.onpvsSelect('',!!(em.attr('checked')));
      }
		},
		/*
			绑定检测全选事件
			@pars
				type 类型(plist/clist)
		*/
		bindChkEvent:function(type){
			var t = this, s = t.setting, c = t.$c;
			if(!type) type='plist';
			var chks=c[type].find('input:checkbox');
			chks.change(function(e){
				var em=$(e.target);
				t.isChkAll(em,type);
			});
		},
		/*
			全选:仅完成勾选功能
			@pars{
				em 全选项jq对象
				type 类型（clist/plist,默认:plist）
				id 全选项id（可选）
			}
		*/
		chkAll: function(pars) {
			var t = this, s = t.setting, c = t.$c;
			if (!pars) return;
			var em = pars.em,type = pars.type || 'plist',id = pars.id,chks,flag;
			flag=em.attr('checked')?true:false;
			chks = c[type].find('input' + (id || id == 0 ? '[data-pid][data-pid=' + id + ']': '') + ':checkbox');
			chks.each(function() {
				if (this !== em.get(0)) {
					$(this).attr('checked',flag);
				}
			});
			return chks;
		},
		/*
			全选值：完成全选及值选中功能
			@pars{
				em 全选项jq对象
				id 全选项id（可选）
			}
		*/
		selAll: function(pars) {
			var t = this,s = t.setting,c = t.$c;
			if (!pars) return;
			var em = pars.em,id = pars.id, chks, vals = [];
			pars.type = 'clist';
			chks = t.chkAll(pars).filter('[data-pid]');
			chks.each(function() {
				if (this !== em.get(0)) {
					vals.push($(this).val());
				}
			});
			t.setValue(vals, em.attr('checked'));
		},
		/*
			单选值:选中城市
			@pars{
				em 城市选项jq对象
			}
		*/
		selCity: function(pars) {
			var t = this, s = t.setting;
			if (!pars || !pars.em) return;
			var em = pars.em;
			t.setValue([em.val()], em.attr('checked'));
		},
		/*
			由省id获取对应的大区
			@pars
				pid 省id

		*/
		getAreaBypid: function(pid) {
			var t = this, s = t.setting,plist = s.data.plist,
				alist = s.data.alist, aid = '1';
			$.each(plist, function(key, value) {
				if (value.getJson('id', pid)) {
					aid = key;
					return false;
				}
			});
			return s.data.alist.getJson('id', aid);
		},
		/*
			由城市id获取对应的省
			@pars
				pid 城市id
		*/
		getPvsBycid: function(cid) {
			var t = this, s = t.setting, clist = s.data.clist,
				plist = s.data.plist, pid = '1', p, v;
			$.each(clist, function(key, value) {
				if (value.getJson('id', cid)) {
					pid = key;
					return false;
				}
			});
			$.each(plist, function(key, value) {
				if (v = value.getJson('id', pid), v) {
					p = v;
					return false;
				}
			});
			return p;
		},
    /*
     由省id获取对应的省
     @pars
     id 省id
     */
    getPvsById:function(id){
      var t = this, s = t.setting, plist = s.data.plist,p;
      $.each(plist, function(k, v) {
        if (v && (p = v.getJson('id', id))) {
          return false;
        }
      });
      return p;
    },
		/*
			填充选中值
			@pars
				vals 值数组
				flag true（增加）/false（删除）

		*/
		setValue: function(vals, flag) {
			var t = this, s = t.setting, _vals = [], valStr='';
			if (flag) {
				t.vals = t.vals.concat(vals);
				vals = _vals;
			}
			for (var i = 0, l = t.vals.length, d; i < l, d = t.vals[i]; i++) {
				if (vals.getIndex(d) < 0) {
					_vals.push(d);
				}
			}
			t.vals = _vals;
			valStr=t.vals.join(',');
			t.valIpt.val(valStr);
			t.onChange&&t.onChange(valStr);
		},
    /*
      清空选中值
    */
    clearSel:function(){
      var t=this;
      t.vals=[];
      t.valIpt.val('');
    },
		//接口
    onpvsSelect:'',//省份选中值改变后触发
		onChange:''//选中值改变后触发
	}.init(ops)
};