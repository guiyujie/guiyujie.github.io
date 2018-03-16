var ST = /**@lends ST#*/{
    /**
     * 资源路径
     * @namespace
     *
     */
  PATH: {
        /**JS路径*/
    JS: "Public/resource/js/",           //JS路径
        /**JS模板路径*/
    JSTMP: "Public/resource/jsTemplate/",//JS模板路径
        /**图片路径*/
    IMAGE: "Public/resource/images/",    //图片路径
        /**CSS路径*/
    CSS: "Public/resource/css/",         //CSS路径
        /**todo*/
    PUBLIC: "Public/resource/",
        /**网站根目录*/
    ROOT: "",                          //网站根目录
        /**验证码（演示暂用58gou）*/
    VCODE: "http://www.58gou.cn/frontend/Image/CAPTCHA",//验证码（演示暂用58gou）
        /**百度编辑器CSS样式路径*/
    EDITORCSS:''          //百度编辑器CSS样式路径
  },
    /**
     * 数据缓存
     * @namespace
     */
  CACHE: {},
    /**
     * JS模板
     * @namespace
     */
  JSTMP:{},
    /**
     * 服务端使用的URL
     * @namespace
     */
  ACTION: {
    /**上传地址*/
    UPLOAD: "",
    /**百度编辑器上传地址*/
    UPLOADUEDITOR: "",
    UCENTERURL:"",
        /**检测用户登录状态接口，58game的userModel.js有用到*/
    ENTERINFO: "",
        /**获取用户信息的接口，58game的userModel.js有用到*/
    GETINFO: "",
        /**单点登录接口，58game的userModel.js有用到*/
    CROSSLOGIN: "",
        /**单点登录登出接口，58game的userModel.js有用到*/
    CROSSLOGOUT: "",    //登出链接
    CLEARCACHE: "",
    CLEARCOOKIE: "",
    LOGIN: "",
        /**58game网站获取用户积分接口*/
    GETSCORE: "",
        /**单点登录注册接口，58game的userModel.js有用到*/
    REGISTERURL:""
    },
    /**
     * 百度编辑器对象
     * @namespace
     */
  EDITORS:[],
    /**
     * 服务端输出的数据，一些必须从服务器提供给前端变量会放在这里
     * @namespace
     */
  PHPDATA: {},
  /**初始化后执行的方法（ST.todoList()前执行）*/
  TODOLIST: [],
  /**页面空方法（用于HTML中执行ST方法，调用：ST.todo('方法名',参数1,...,参数N)）*/
  todo: function () {
  }
};