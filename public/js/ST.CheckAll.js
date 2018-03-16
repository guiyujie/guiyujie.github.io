/*
 全选插件
 created & last edited by ZS 2013-7-12
 var ST = require('ST');
 todo:待优化
* */
ST.CheckAll = function (id,ops) {
  var _config = {
    targets: '.fn_checkall_target',   //目标checkbox
    checkBtn: '.fn_checkall_ckall',   //全选按钮
    invertBtn: '.fn_checkall_invert', //反选按钮
    clearCache: true,                 //是否清除缓存
    isBound: true                     //是否双向绑定（若此项设为true，则目标checkbox选中数量将影响全选按钮选中状态）
  };
  //私有成员
  var _instance = {

  };
  return{
    init: function (id,conf) {
      var t = this;
      t.config = $.extend({}, _config);
      $.extend(t.config, conf);
      var c = t.config;
      t.Jid = $('#'+id);
      t.targets = $(c.targets).filter('input:checkbox');
      t.checkBtn = t.Jid.find(c.checkBtn);
      t.invertBtn = t.Jid.find(c.invertBtn);
      t.seled = [];
      if (c.clearCache) t.targets.attr('checked', false);
      t.checkBtn.bind('click.checkall', function () {
        var tp = $(this).attr('type').toUpperCase();
        if (tp == 'CHECKBOX' || tp == 'RADIO') {
          var f = !!$(this).attr('checked');
          f ? t.checkAll() : t.uncheckAll();
        } else {
          t.checkAll();
        }
        t.oncheck && t.oncheck(t.seled, this);
      });
      t.invertBtn.bind('click.checkall', function () {
        t.invert();
        t.oncheck && t.oncheck(t.seled, this);
      });
      t.targets.bind('click.checkall', function () {
        var f = !!$(this).attr('checked');
        f ? t.check(this) : t.uncheck(this);
        if (c.isBound) t.checkBtn.attr('checked', t.targets.filter(':checked').length == t.targets.length);
        t.oncheck && t.oncheck(t.seled, this);
      });
      delete t.init;
      return t;
    },
    //反选
    invert: function () {
      var t = this;
      t.targets.each(function () {
        var checked = $(this).attr('checked'), val = $(this).val();
        $(this).attr('checked', !checked);
        t.seled[checked ? 'remove' : 'push'](val);
      });
    },
    //全选
    checkAll: function () {
      var t = this;
      t.targets.attr('checked', true).each(function () {
        var val = $(this).val();
        if (t.seled.getIndex(val) == -1) t.seled.push(val);
      });
    },
    //取消全选
    uncheckAll: function () {
      var t = this;
      t.targets.attr('checked', false);
      t.seled = [];
    },
    //选择
    check: function (tar) {
      if (!tar) return;
      var t = this, $this = $(tar), val = $this.val();
      if (t.seled.getIndex(val) == -1) t.seled.push(val);
    },
    //取消选择
    uncheck: function (tar) {
      if (!tar) return;
      var t = this, $this = $(tar), val = $this.val();
      t.seled.remove(val);
    },
    oncheck: ''
  }.init(id,ops);
};