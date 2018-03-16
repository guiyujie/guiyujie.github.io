$(function () {
  $('.table-striped').find('tbody tr:odd').addClass('even');
});
$.extend(ST, {
  initTrigger: function () {
    $('#_demo').evProx({
      click: {
        '.fn_trigger': function () {
          var cmd = $(this).data('cmd');
          if (!cmd) return;
          var ds = $(this).data('source'), title = $('#' + ds).data('title') || '', code = $('#' + ds).html();
          var html = '<div style="height: 480px;overflow: auto"><pre class="prettyprint">' + code + '</pre></div>';
          return ST[cmd](title, html);
        }
      }
    });
  },
  showCode: function (title, code) {
    ST.hideMsg();
    var _b = ST.msgbox({
      title: '查看代码 - ' + title,
      content: code
    }, [
      {
        text: '复制',
        fun: function (a, e) {
          e.cancle = true;
        }
      },
      {
        text: '关闭',
        fun: function () {
          ST.hideMsg();
        }
      }
    ], 680, '', true);

    var btn = $('#' + 'st_msgbox_' + _b.ctrlId + '_btn_0'), clip,
      pre = $('#st_msgbox_cnt_' + _b.ctrlId).find('pre:first');
    btn.zclip({
      path: '../public/js/ZeroClipboard/ZeroClipboard.swf',
      copy: pre.text(),
      setCSSEffects: false,
      afterCopy: function () {
        ST.tipMsg("代码已复制到您的剪贴板！", 2000);
      }
    });

    prettyPrint();

    return false;
  }
});
ST.TODOLIST.push({method: 'initTrigger', pars: ''});