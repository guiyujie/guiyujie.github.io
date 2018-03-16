ST.Verify = {
  init: function () {
    var t = this;
    t.config = {
      ts: ['input', 'select', 'textarea'],
      Common: {
        reg: /^[\w]$/,
        eStr: "请输入必填项！"
      },
      Fangle: {
        reg: /[\uFF00-\uFFFF]/,
        eStr: "输入包含全角字符!"
      },
      Vcode: {
        reg: /^\d{4}$/,
        eStr: "请输入4位数字验证码！"
      },
      Email: {
        reg: /^\w[\w\.-]*@[\w-]+(\.[\w-]+)+$/,
        eStr: "请输入正确的邮箱格式！"
      },
      Idcard: {
        reg: /^(\d{15}|\d{17}[\dx])$/,
        eStr: "请输入正确的身份证号！"
      },
      Chinese: {
        reg: /^[\u4E00-\u9FAF]+$/,
        eStr: "请输入正确的中文！"
      },
      TrueName: {
        reg: /^[\u4E00-\u9FAF]{2,4}$/,
        eStr: "请输入正确的中文名(2-4个中文汉字)！"
      },
      English: {
        reg: /^[A-Za-z]+$/,
        eStr: "请输入正确的英文！"
      },
      Number: {
        reg: /^\d+$/,
        eStr: "请输入数字"
      },
      Integer: {
        reg: /^-?(0|[1-9]\d*)$/,
        eStr: "请输入整数！"
      },
      Decimal: {
        reg: /^-?[0-9]+\.[0-9]+$/,
        eStr: "请输入小数"
      },
      Date: {
        reg: /((^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(10|12|0?[13578])([-\/\._])(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(11|0?[469])([-\/\._])(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(0?2)([-\/\._])(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([3579][26]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][13579][26])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][13579][26])([-\/\._])(0?2)([-\/\._])(29)$))/i,
        eStr: "请输入日期！"
      },
      Url: {
        reg: /^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/,
        eStr: "请输入正确的URL！"
      },
      QQ: {
        reg: /^[1-9]\d{4,10}$/,
        eStr: "请输入正确的QQ号！"
      },
      Phone: {
        reg: /^((((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?)|(\d{11}))$/,
        eStr: "请输入正确电话或手机号码！"
      },
      Mobile: {
        reg: /^(\d{1,4}\-)?(13|15|18){1}\d{9}$/,
        eStr: "请输入正确的手机号码！"
      },
      Symbol: {
        reg: /[`~!@#$%^&*()+=|{}':;',.<>/?~！@#￥%……&*（）——+|{}【】'；：""'。，、？]/,
        eStr: "包含特殊字符！"
      },
      password: {
        reg: /^\w+$/,
        eStr: "密码仅支持字母和数字"
      },
      unnumber: {
        reg: /\D/,
        eStr: "全为数字"
      },
      ip: {
        reg: /^((?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))))$/,
        eStr: "请输入正确的IP地址"
      },
      mac: {
        reg: /[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}/,
        eStr: "请输入正确的MAC地址"
      }
    }
    t.errormsg = ['请输入关键字！', '关键字包含非法字符！', '关键字包含空格字符！', '关键字不得超过32个字符！', '关键字不能为空！', '关键字必须为数字！', '关键字{0}到{1}之间！', '请输入{0}到{1}个字符！'];
    t.initPage();
    return t;
  },
  //获取页面所有需验证表单添加相关属性,事件
  //f 表单 els 验证元素 erroAray 错误信息
  initPage: function (a) {
    var t = this;
    if (!a) t.forms = [];
    var s = a ? "#" + a + " form" : "form";
    $(s).each(function () {
      if ($(this).attr('stverify')) t.forms.push({f: this, els: [], erroArray: [], subBtn: $(this).find("input[type='submit'],button[type='submit']")});
    });
    $.each(t.forms, function (i, v) {
      t.initForm(i);
    });
  },
  //@idx 表单下标
  initForm: function (idx) {
    var t = this, fs = t.forms;
    t.initVelms(idx);
    fs[idx].f.onsubmit = function () {
      if ($(this).attr('dynamicForm')) {
        t.initVelms(idx);
      }
      if (t.subForm(this)) {
        t.checkIEHolder(this);
        this.submit();
      }
      return false;
    }
  },
  initVelms: function (idx) {
    var t = this, fs = t.forms, ts = t.config.ts, cf = idx >= 0 ? fs[idx] : fs.getJson('f', idx);
    cf.els = [];
    cf.erroArray = [];
    cf.succArray = [];
    $(cf.f).find("*[name]").each(function (i, v) {
      var a;
      if (a = $(this), a.attr("opt") && t.inArray(ts, this.tagName)) {
        cf.els.push($(this));
        cf.succArray.push(false);
        //if($(cf.f).attr('erroappend') || $(cf.f).attr('errtar')){
        var o;
        var verifySucc = function () {
          if ($(cf.f).attr('verifySucc')) {
            for (var m = 0; m < cf.succArray.length; m++) {
              if (!cf.succArray[m]) {
                if (cf.subBtn.length) $(cf.subBtn).attr("disabled", "disabled").toggleClass("disSubmit", true);
                return;
              }
            }
            t.hideAllErro(cf.f);
            //验证成功后
            $(cf.subBtn).removeAttr("disabled").toggleClass("disSubmit", false);
            ST[$(cf.f).attr('verifySucc')] && ST[$(cf.f).attr('verifySucc')]();
          }
        };
        if (a.attr("etips")) {
          t.showTips(a, a.attr("etips"), "info");
        }
        if (a.attr('type') && a.attr('type').toUpperCase() == 'RADIO') {//radio
          o = $(cf.f).find('[name=' + a.attr('name') + '][opt][opt*=rdck]');
          if (o.size() > 0) {
            a.unbind('click.v').bind('click.v', function () {
              cf.succArray[i] = t.check(cf.f, o, true);
              verifySucc();
            });
          }
        } else if (a.attr('type') && a.attr('type').toUpperCase() == 'CHECKBOX') {//checkbox
          o = $(cf.f).find('[group][group=' + a.attr('group') + '][opt][opt*=partrq]');
          if (o.size() > 0) {
            a.unbind('click.v').bind('click.v', function () {
              cf.succArray[i] = t.check(cf.f, o, true);
              verifySucc();
            });
          }
        } else {
          a.unbind('focus.v').bind('focus.v', function () {
            a.toggleClass("highlight", true);
            if (a.attr("focusmsg")) {
              t.showTips(a, a.attr("focusmsg"), "info");
            }
          });
          a.unbind('blur').bind('blur', function () {
            a.toggleClass("highlight", false);
            cf.succArray[i] = t.check(cf.f, this, true);
            verifySucc();
          });
        }
        // }
        //修正 ie placeholder属性
        if ($.browser.msie) {
          if (a.attr("placeholder")) {
            if (a.val() == "") a.addClass("gray").val(a.attr("placeholder"));
            a.unbind('focus.ie').bind('focus.ie',function () {
              if (a.val().t() == a.attr("placeholder"))
                a.val("").removeClass("gray");
            }).unbind('blur.ie').bind('blur.ie', function () {
                if (a.val().t() == "")
                  a.val(a.attr("placeholder")).addClass("gray");
              })
          }
        }
        //maxlength字节长度 (mlimit="true")
        if (a.attr("maxlength") && a.attr('mlimit')) {
          var mx = parseInt(a.attr("maxlength"), 10);
          var fn = function () {
            var val = a.val(), l = val.length, n = 0, m = l;
            for (var j = 0, c; j < l, c = val.charAt(j); j++) {
              if (c.l() == 2) {
                n++;
              }
              if (j + n + 1 >= mx) {
                m = j + n + 1 == mx ? j + 1 : j;
                break;
              }
            }
            if (m < l) a.val(val.slice(0, m));
          }
          a.unbind('keyup.verf').bind('keyup.verf',function () {
            fn();
          }).unbind('paste.verf').bind('paste.verf', function () {
              setTimeout(fn, 50);
            });
        }
      }
    });
  },
  //添加需要验证的表单   id
  addVform: function (id) {
    var t = this, f = document.getElementById(id);
    if (t.forms.getJson("f", f)) return;
    t.forms.push({f: f, els: [], erroArray: [], subBtn: $(this).find("input[type='submit'],button[type='submit']")});
    t.initForm(t.forms.length - 1);
  },
  //@f 表单对象
  subForm: function (f) {
    //内存中获取当前form中所有可验证元素
    var t = this, cf = t.getFormInfo(f), objs = cf.els, a, flag;
    //try{p=(parent)?parent.ST:ST;}catch(e){}
    cf.erroArray = [];
    a = $(f).attr('beforeSubFun');
    if (a && !ST.todo(a)) {
      return false;
    }
    //循环遍历验证所有验证元素
    for (var i = 0, l = objs.length; i < l; i++) {
      if (!t.check(f, objs[i]) && !$(f).attr('erroappend')) {
        return false;
      }
    }
    if (cf.erroArray.length > 0) {
      return false;
    } else {
      if (t.isAjaxVerify) {
        ST.tipMsg('正在进行验证，请稍候！', 1500);
        return false;
      }
      var fn = function () {
        a = $(f).attr('SubFun');
        if (a && !ST.todo(a)) {
          return false;
        }
        if ($(f).attr("ajaxpost")) {
          t.checkIEHolder(f);
          ST.tipMsg('正在提交，请稍候！', 0, !0);
          ST.postForm({
            f: f,
            succ: function (j) {
              if (a = $(f).attr('afterSubFun')) {
                ST.todo(a, j);
              } else {
                j.data && window.setTimeout(function () {
                  if (j.data.url) {
                    location.href = j.data.url;
                  } else {
                    ST.reload();
                  }
                }, 1000);
              }
            },
            error: function (e) {
              if (a = $(f).attr('errorFun')) {
                ST.todo(a, e);
              }
            }
          });
          return false;
        }
        return true;
      };
      if ($(f).attr('confirm')) {
        ST.confirm(
          ST.JTE.fetch($(f).attr('conftmp') || 'form_confmsg_temp').getFilled({
            msg: $(f).attr('confmsg') || '确定提交吗？'
          }), "消息提示", function () {
            flag = fn();
          }, function () {
            return false;
          }, 405, 215);
        return flag;
      } else {
        return fn();
      }
    }
  },
  //获取表单需要验证信息
  getFormInfo: function (f) {
    var t = this;
    for (var i in t.forms) {
      if (f == t.forms[i].f) return t.forms[i];
    }
  },
  //IE下占位符验证
  checkIEHolder: function (f) {
    var t = this;
    if (!$.browser.msie) return;
    var els = $(f).find(':input').filter('[name][placeholder]'), holder, val;
    els.each(function () {
      holder = $(this).attr('placeholder').trim();
      val = $(this).val().trim();
      if (holder && val && holder == val) {
        $(this).val('');
      }
    });
  },
  //表单验证（不提交表单）
  checkForm: function (fid) {
    var t = this, f = document.getElementById(fid);
    if ($('#' + fid).attr('dynamicForm')) {
      t.initVelms(f);
    }
    var cf = t.getFormInfo(f), objs = cf.els;
    //内存中获取当前form中所有可验证元素
    cf.erroArray = [];
    a = $(f).attr('beforeSubFun');
    if (a && !ST.todo(a)) {
      return false;
    }
    //循环遍历验证所有验证元素
    for (var i = 0, l = objs.length; i < l; i++) {
      if (!t.check(f, objs[i]) && !$(f).attr('erroappend')) {
        return false;
      }
    }
    return !(cf.erroArray.length > 0);
  },
  //@f 指定的表单对象 o表单验证元素
  check: function (f, o, cancel) {
    var t = this, o = $(o), eno = -1, emsg = 0, key = o.val().replace('&nbsp;', '').t(), kl = key.l(), opts = o.attr("opt").t().split(" "), cf = t.getFormInfo(f), v1;
    if (o.attr("dval") && key == o.attr("dval")) {
      
	  return true;
    }//默认值
    if (o.attr("placeholder") && key == o.attr("placeholder")) {
      return false;
	  key = "";
    }
    var reg = new RegExp('[\/.]', 'g'), reg1 = new RegExp('[ |　]+', 'g');
    for (var i = 0, l = opts.length; i < l; i++) {
      switch (v1 = opts[i].toLowerCase()) {
        case"key_search"://关键词
          if (!o.attr('v') || key == o.attr('v') || !key) {
            emsg = o.attr("emsg") || t.errormsg[0];
          } else if (reg.test(key)) {
            emsg = t.errormsg[1];
          } else if (reg1.test(key)) {
            emsg = t.errormsg[2];
          } else if (kl > 32) {
            emsg = t.errormsg[3];
          }
          break;
        case"symbol"://特殊字符
          if (t.config.Symbol.reg.test(key)) {
            emsg = t.config.Symbol.eStr;
          }
          break;
        case"vcode"://验证码
          if (!t.config.Vcode.reg.test(key)) {
            emsg = t.config.Vcode.eStr;
          }
          break;
        case"rq"://必填
        case"require":
          if (!key)emsg = t.config.Common.eStr;
          break;
        case"nrq"://非必填
        case"notrequire":
          if (key == '') {
            t.msg = 0;
            if (key == "" && o.attr("etips")) {
              t.showTips(o, o.attr("etips"), "info");
            } else {
              t.hideErro(o);
            }
            return true;
          }
          break;
        case"ml"://字数范围
        case"maxlength":
          var byteml = o.attr('byteml');
          kl = byteml ? key.l() : key.length;
          var ml = o.attr("ml").split("-");
          if (kl < ml[0] || kl > ml[1]) {
            emsg = t.errormsg[7].f(ml[0], ml[1]);
          }
          break;
        case"int"://整数
          if (!t.config.Integer.reg.test(key)) {
            emsg = t.config.Integer.eStr;
          }
          break;
        case"dec"://小数（digits属性为小数位数，例：1-3或2）
          if (!t.config.Decimal.reg.test(key)) {
            emsg = t.config.Decimal.eStr;
            break;
          }
          var digits = o.attr("digits").split("-"), len = digits.length;
          if (!len) break;
          var d = key.length - key.charAt('.') - 1;
          if (len > 1) {
            if (d < digits[0] || d > digits[1]) emsg = '请输入' + digits[0] + '-' + digits[1] + '位小数';
          } else {
            if (d != digits[0]) emsg = '请输入' + digits[0] + '位小数';
          }
          break;
        case "min"://最小值
          if (!(t.config.Integer.reg.test(key) || t.config.Decimal.reg.test(key))) {
            emsg = '请输入数值';
            break;
          }
          var min = o.attr("min");
          if (!min) return;
          if (parseFloat(key) < parseFloat(min)) {
            emsg = '最小值为' + min;
          }
          break;
        case "max"://最大值
          if (!(t.config.Integer.reg.test(key) || t.config.Decimal.reg.test(key))) {
            emsg = '请输入数值';
            break;
          }
          var max = o.attr("max");
          if (!max) return;
          if (parseFloat(key) > parseFloat(max)) {
            emsg = '最大值为' + max;
          }
          break;
        case"range"://数值范围（包括边界值）
          if (!(t.config.Integer.reg.test(key) || t.config.Decimal.reg.test(key))) {
            emsg = '请输入数值';
            break;
          }
          var rl = o.attr("range").split("-");
          if (rl.length < 2)return false;
          if (parseFloat(key) < rl[0] || parseFloat(key) > rl[1]) {
            emsg = t.errormsg[6].f(rl[0], rl[1]);
            break;
          }
          break;
        case"url"://url
          if (!t.config.Url.reg.test(key)) {
            emsg = t.config.Url.eStr;
          }
          break;
        case"tel"://电话号码
        case"phone":
          if (!t.config.Phone.reg.test(key)) {
            emsg = t.config.Phone.eStr;
          }
          break;
        case"mail"://电子邮箱
          if (!t.config.Email.reg.test(key)) {
            emsg = t.config.Email.eStr;
          }
          break;
        case"qq"://qq
          if (!t.config.QQ.reg.test(key)) {
            emsg = t.config.QQ.eStr;
          }
          break;
        case"english"://英文字母
          if (!t.config.English.reg.test(key)) {
            emsg = t.config.English.eStr;
          }
          break;
        case"chinese"://汉字
          if (!t.config.Chinese.reg.test(key)) {
            emsg = t.config.Chinese.eStr;
          }
          break;
        case"number"://数字
          if (!t.config.Number.reg.test(key)) {
            emsg = t.config.Number.eStr;
          }
          break;
        case"truename"://真实姓名(2-4个汉字)
          if (!t.config.TrueName.reg.test(key)) {
            emsg = t.config.TrueName.eStr;
          }
          break;
        case"mobile"://手机号码
          if (!t.config.Mobile.reg.test(key)) {
            emsg = t.config.Mobile.eStr;
          }
          break;
        case"compare"://比较两个值
          var cp = $("#" + o.attr("compare")), cv = o.attr("compval"), ce;
          var op = o.attr('operator') || '==', flag;
          if (!cp.length) {
            if (!cv) break;
            ce = cv.t();
          } else {
            ce = cp.val().t();
          }
          flag = key != "" && ce != "";
          switch (op) {
            case '!=':
              if (flag && key == ce) {
                emsg = "等于" + ce;
              }
              break;
            case '>':
              if (flag && key <= ce) {
                emsg = "小于等于" + ce;
              }
              break;
            case '>=':
              if (flag && key < ce) {
                emsg = "小于" + ce;
              }
              break;
            case '<':
              if (flag && key >= ce) {
                emsg = "大于等于" + ce;
              }
              break;
            case '<=':
              if (flag && key > ce) {
                emsg = "大于" + ce;
              }
              break;
            default:
              if (flag && key != ce) {
                emsg = "不等于" + ce;
              }
          }
          break;
        case"tag"://标签
          var tags = key.replace(/[\s，、,]/g, ",");
          tags = tags.split(",");
          if (tags.length > 5) {
            emsg = "最多5个标签!";
            break;
          }
          for (var j = 0; j < tags.length; j++) {
            if (tags[j].l() > 16) {
              emsg = "单个标签不能超过16个字符!";
              break;
            }
          }
          break;
        case"ck"://选中
          if (!o.checked) {
            emsg = "未选中";
          }
          break;
        case"rdck"://单选
          var rdbtn = $(f).find('[name=' + o.attr('name') + ']'), flag = false;
          for (var j = 0; j < rdbtn.length; j++) {
            if (rdbtn[j].checked) {
              flag = true;
              break;
            }
          }
          if (!flag) {
            emsg = "请选择其中一个选项";
          }
          break;
        case"idcard"://身份证号码
          if (!t.config.Idcard.reg.test(key)) {
            emsg = t.config.Idcard.eStr;
          }
          break;
        case"same"://不同字符
          if (!key.length) break;
          var aaa = false;
          for (var j = 0; j < key.length; j++) {
            if (key[0] != key[j]) {
              aaa = true;
              j = key.length;
            }
          }
          if (!aaa) emsg = "不能为同一字符";
          break;
        case "partrq"://至少N项必填/选
          var num = o.attr('num'), gn = o.attr('group'), tp = o.attr('type').toUpperCase();
          var idx = 0, ckey = '';
          if (!gn) break;
          if (!num) num = 1;
          var os = $(cf.f).find(':input[group][group=' + gn + ']');
          os.each(function () {
            ckey = tp == 'CHECKBOX' ? $(this).attr('checked') : $(this).val();
            if (ckey) idx++;
          });
          if (idx < num) emsg = "至少填写" + num + "项";
          break;
        case "date"://日期
          if (!t.config.Date.reg.test(key)) {
            emsg = t.config.Date.eStr;
          }
          break;
        case "regexp"://自定义正则表达式（regexp属性中配置正则表达式）
          if (!o.attr('regexp')) return;
          if (!new RegExp(o.attr('regexp'), "i").test(key)) {
            emsg = '验证未通过';
          }
          break;
        default:
          if (!t.config[v1].reg.test(key)) {
            emsg = t.config[v1].eStr;
          }
          break;

      }
      if (emsg && eno == -1) {
        eno = i
      }
      //用于定义错误号 现实不同错误提示
      if (emsg) break;
    }
    if (emsg) {
      if (key && o.attr('ignore')) {//ignore属性为忽略列表，多值以空格隔开
        if (o.attr('ignore').split(' ').getIndex(key) > -1) return true;
      }
      if (o.attr("emsg")) {
        var _arr = o.attr("emsg").split(" ");
        if (_arr[eno]) emsg = _arr[eno];
      }
      //根据错误号 现实不同错误提示
      cf.erroArray.push(emsg);
      if ($(f).attr('erroappend')) {
        if ($('#ST_temp').size() == 0) {
          alert('需要引入通用模板文件！');
        }
        t.addErro(o, emsg, $(f).attr('errtmp'));
      } else if ($(f).attr('errtar')) {
        $("#" + $(f).attr('errtar')).html(emsg).css("visibility", "visible");
      } else {
        if (!cancel) ST.tipMsg(emsg, 3000);
      }
      return false;
    } else {
      if (o.attr('group') && !o.filter('[opt][opt*=partrq]').length) {
        $(f).find('[group][group=' + o.attr('group') + '][opt][opt*=partrq]').trigger('blur');
      }
      if ($(f).attr('errtar')) {
        $("#" + $(f).attr('errtar')).html("").css("visibility", "hidden");
      } else {
        if (key == "" && o.attr("etips")) {
          t.showTips(o, o.attr("etips"), "info");
        } else if (o.attr("succmsg")) {
          t.showTips(o, o.attr("succmsg"), "success");
        } else {
          t.hideErro(o);
        }
      }
      return true;
    }
  },
  inArray: function (a, nn) {
    for (var i = 0; i < a.length; i++) {
      if (nn.toLowerCase() == a[i])return true;
    }
    return false;
  },
  addErro: function (o, emsg, errtmp) {
    var pn = $(o).parent();
    var els = $(pn).find("div[verify]");
    errtmp = errtmp || 'form_erromsg_temp';
    if (o.attr('errtar')) els = $('#' + o.attr('errtar')).attr('verify', '1');
    if (els.length < 1) {
      var div = $('<div verify="1" class="inline">');
      div.appendTo(pn);
      ST.JTE.fetch(errtmp).toFill(div, {type: "error", msg: emsg})
    } else {
      if (o.attr('vno')) els.attr('vno', o.attr('vno'));
      els.show().html(ST.JTE.fetch(errtmp).getFilled({type: "error", msg: emsg}));
    }
  },
  hideAllErro: function (f) {
    $(f).find('div[verify="1"]').each(function () {
      $(this).hide().html("");
    });
  },
  showTips: function (o, msg, type) {
    var pn = $(o).parent();
    type = type || "success";
    var els = $(pn).find("div[verify=1]");
    if (els.length < 1) {
      var div = $("<div verify='1' class='inline'>");
      div.appendTo(pn);
      ST.JTE.fetch('form_erromsg_temp').toFill(div, {type: type, msg: msg})
    } else {
      els.show().html(ST.JTE.fetch("form_erromsg_temp").getFilled({type: type, msg: msg}));
    }
  },
  hideErro: function (o) {
    if ($(o).attr('errtar')) {
      var errtar = $('#' + $(o).attr('errtar'));
      if (!errtar.length) return;
      if (errtar.attr('vno') == $(o).attr('vno')) errtar.hide().html("");
    } else {
      var pn = $(o).parent();
      $(pn).find('div[verify="1"]').each(function () {
        $(this).hide().html("");
      });
    }
  }
}.init();