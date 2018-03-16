$.extend(ST, {
  /**
   * swfobject上传按钮外观配置
   */
  upbtnConfig: {
    btnimg: ST.PATH.IMAGE + "upbtn_66x30.png",
    btnwidth: "66",
    btnheight: "30",
    btntext: " "
  },
  /**
   * 时间日期范围配置
   */
  CalRange: {
    'beginYear': 2012,  //配置默认开始年份
    'endYear': 2020     //配置默认结束年份
  },
  /**
   * 重写ST库文件的ddlist（具体配置及用法见在线api）
   *
   * @desc 自动选取容器下第一个select作为数据源（2013-8-26新增）
   *
   * @param id    目标容器id
   * @param data  数据（格式:[{text:'',value:''}……]）
   * @param selFn 选中后回调方法
   * @param h     每一项的高度（通常无需配置此项，使用默认值即可）
   *
   * @returns     $.Widget.DropDownList对象
   */
  ddList: function (id, data, selFn, h) {
    var $this = $('#' + id), $dts = $this.find('select:first'), ddl;
    if (!data && $dts.length > 0) {
      var options = $dts.find('option');
      data = [];
      options.each(function () {
        data.push({text: $(this).html(), value: $(this).val()});
      });
    }
    ddl = new $.Widget.DropDownList(id, h);
    ddl.onselected = function (o, e) {
      $.Lang.isMethod(selFn) && selFn(o, e);
    };
    if (data) ddl.changeData(data);
    return ddl;
  },
  /**
   * 两级联动
   * @param options
   */
  ddList2: function (options) {
    var options = options || {};
    var c = {
      pid: options.pid || '_ddlist_p',        //父容器id
      cid: options.cid || '_ddlist_c',        //子容器id
      pdata: options.pdata || ST.ddlData.p,  //父数据
      cdata: options.cdata || ST.ddlData.c, //子数据
      pfn: options.pfn,                      //父回调
      cfn: options.cfn                       //子回调
    };
    var pIpt = $('#' + c.pid + '_val'), cIpt = $('#' + c.cid + '_val');
    //child ddlist
    var ddlist_c = ST.ddList(c.cid, [], function (o) {
      c.cfn && c.cfn(o);
    });
    //parent ddlist
    var ddlist_p = ST.ddList(c.pid, c.pdata,function (o) {
      if (!ST.page_inited) {
        ST.page_inited = true;
      } else {
        cIpt.val('');
      }
      ddlist_c.changeData(c.cdata[o.value] || []);
      if (c.cdata[o.value] && c.cdata[o.value][0]) {
        ddlist_c.selByValue(cIpt.val() || c.cdata[o.value][0].value);
      }
      c.pfn && c.pfn(o);
    }).selByValue(pIpt.val() || c.pdata[0].value);
  },
  /**
   * 执行Ajax操作
   * @param options
   */
  execAJAX: function (options) {
    var config = $.extend({
      url: '',           //服务端请求地址
      method: 'POST',    //提交方法（GET|POST）
      params: {},        //发送到服务端的参数（如：{myparam:1}）
      massage: '',       //提示信息（仅hasconfirm为true时有用）
      hasconfirm: true,  //提交前是否显示确认框
      succFun: '',       //成功后的回调方法
      erroFun: ''        //失败后的回调方法
    }, options);
    var sendRequest = function () {
      ST.tipMsg("正在执行操作,请稍后", 0, 0);
      ST.getJSON(config.url, config.params || '', function (j) {
        config.succFun && config.succFun(j);
      }, function (j) {
        config.erroFun && config.erroFun(j);
      }, config.method);
    };
    if (config.hasconfirm) {
      ST.hideMsg();
      ST.confirm(ST.JTE.fetch('common_exec_temp').getFilled({msg: config.massage || ''}), "操作提示", function () {
        sendRequest();
      }, function () {
        //if canceled
      }, 400);
    } else {
      sendRequest();
    }
  },
  /**
   * 关闭弹窗
   */
  closeFb: function () {
    if (!parent || !parent.ST.$Fb) return;
    parent.ST.$Fb.hide();
  },
  /**
   * 在弹窗页面中刷新父窗口
   */
  reloadFb: function () {
    if (!parent)return;
    parent.ST.reload();
  },
  /**
   * 添加日期范围
   * @param options
   * @returns {b: ST.Calender对象, e: ST.Calender对象}
   */
  addDateRange: function (options) {
    var config = $.extend({
      bid: 'beginTime',                 //开始时间id
      eid: 'endTime',                   //结束时间id
      beginYear: ST.CalRange.beginYear, //最小年份
      endYear: ST.CalRange.endYear,     //最大年份
      isequal: false,                   //是否允许开始与结束时间相同
      timePicker: false,                //是否需要时间选择（需引入ST.Timepicker.js）
      showSeconds: false                //是否显示秒
    }, options);
    var $Input = {
      'b': $('#' + config.bid),
      'e': $('#' + config.eid)
    };
    var $Calender = {
      'b': new ST.Calender(config.bid, "", config.beginYear, config.endYear),
      'e': new ST.Calender(config.eid, "", config.beginYear, config.endYear)
    };
    //处理timePicker
    if (config.timePicker) {
      $Calender['b'].timePicker = $Calender['e'].timePicker = true;
      if (config.showSeconds) {
        $Calender['b'].showSeconds = $Calender['e'].showSeconds = true;
      }
    }
    //处理回调
    var evHandler = function (tp, c) {
      var cdt = config.timePicker ? c.date.split(' ')[0] : c.date, arr = cdt.split('-');
      if (!config.isequal) {
        arr = ST[tp == 'e' ? 'getNextDate' : 'getPrevDate'](arr).slice(0);
        cdt = arr.join('-');
      }
      $Calender[tp][tp == 'e' ? 'minDate' : 'maxDate'] = cdt;
      if ((tp == 'e' && $Calender['e'].curDate < cdt) || (tp == 'b' && $Calender['b'].curDate > cdt)) {
        $Calender[tp].curDate = cdt;
        $Calender[tp].curYear = arr[0];
        $Calender[tp].curMonth = arr[1];
        $Calender[tp].curDay = arr[2];
      }
    };
    $Calender['b'].onselected = function (c) {
      evHandler('e', c);
    };
    $Calender['e'].onselected = function (c) {
      evHandler('b', c);
    };
    var curDate = {
      'b': $Input['b'].val(),
      'e': $Input['e'].val()
    };
    if (curDate['b']) evHandler('e', {date: curDate['b']});
    if (curDate['e']) evHandler('b', {date: curDate['e']});
    return $Calender;
  },
  getNextDate: function (dt) {
    var _dt = new Date(parseInt(dt[0], 10), parseInt(dt[1], 10) - 1, parseInt(dt[2], 10));
    var time = _dt.getTime() + 86400000;
    _dt.setTime(time);
    return this.getDateArray(_dt);
  },
  getPrevDate: function (dt) {
    var _dt = new Date(parseInt(dt[0], 10), parseInt(dt[1], 10) - 1, parseInt(dt[2], 10));
    var time = _dt.getTime() - 86400000;
    _dt.setTime(time);
    return this.getDateArray(_dt);
  },
  getDateArray: function (dt) {
    var y = dt.getFullYear(), m = dt.getMonth() + 1, d = dt.getDate();
    if (m < 10) m = '0' + m;
    if (d < 10) d = '0' + d;
    return [y + '', m + '', d + ''];
  },
  getToday: function () {
    var dt = new Date(), ty = dt.getFullYear(), tm = dt.getMonth() + 1, td = dt.getDate();
    if (tm < 10) tm = '0' + tm;
    if (td < 10) td = '0' + td;
    return [ty + '', tm + '', td + ''];
  },
  /**
   * 百度编辑器填充方法
   * @desc 在form表单中配置 beforeSubFun="fillEditor"
   */
  fillEditor: function () {
    for (var i = 0, dl; i < ST.EDITORS.length, dl = ST.EDITORS[i]; i++) {
      if (dl["editor"]) {
        $("#" + dl["id"]).val(dl["editor"].getContent());
      }
    }
    return true;
  },
  /**
   * 填充input:file
   * @desc 在input:file中配置  onchange="ST.todo('fileFilling',this);"
   */
  fileFilling: function (file) {
    if (!file) return;
    var $file = $(file), p = $($file).parent(), dsp_input = p.find('input:text:first');
    dsp_input.val($file.val());
    $file.trigger('blur');
  },
  /**
   * 逗号分隔ID（纯数字）
   * @desc  1.规则：（1）任何非数字字符转为半角逗号（2）多个连续的半角逗号转为一个半角逗号；2.配置：在input|textarea中配置  onkeyup="ST.todo('splitBycomma',this)" onpaste="ST.todo('splitBycomma',this,true)"
   */
  splitBycomma:function(node,delay){
    if(!node) return;
    var $this =$(node);
    var fn=function(){
      $this.val($this.val().replace(/[^0-9]/g,',').replace(/,{2,}/,','));
    };
    if(delay){
      setTimeout(fn,50);
    }else{
      fn();
    }
  }
});