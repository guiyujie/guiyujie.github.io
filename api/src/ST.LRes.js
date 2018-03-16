/*
 静态语言资源包
 注意表单使用全角
 */
$.extend(ST.LRes, (function (k) {
  return/**@lends ST.LRes*/{
    /**扩展表单错误验证*/
    FormErrorCommon: {'zh-CHS': '验证失败!'}[k],
      /**todo*/
    FormErrorMaxLength: {'zh-CHS': '长度{0}到{1}之间！'}[k],
      /**todo*/
    FormErrorRange: {'zh-CHS': '范围{0}到{1}之间！'}[k],
      /**todo*/
    FormErrorNumber: {'zh-CHS': '请输入数值！'}[k],
      /**todo*/
    FormErrorTagNumber:{'zh-CHS':'最多{0}个标签！'}[k],
      /**todo*/
    FormErrorTagLength:{'zh-CHS':'单个标签不能超过{0}个字符！'}[k],
      /**todo*/
    FormErrorRadio:{'zh-CHS':'请至少选择其中一项！'}[k],
      /**todo*/
    FormErrorChecked:{'zh-CHS':'未选中！'}[k],
      /**todo*/
    FormErrorLeast:{'zh-CHS':'至少填写{0}项！'}[k]
  }
}(ST.Language)));