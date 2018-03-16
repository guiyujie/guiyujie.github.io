var ST = {
    // 资源路径
    PATH: {
        JS: "../public/js/",
        JSTMP: "../public/jsTemplate/",
        IMAGE: "../public/images/",
        CSS: {},
        PUBLIC: "../public/",
        ROOT: "",
        SUFFIX: '.html',
        VCODE: "/Check/Code",
        EDITORCSS:''          //百度编辑器CSS样式路径
    },
    // 数据缓存
    CACHE: {},
    // JS模板
    JSTMP:{},
    // 服务端使用的URL
    ACTION: {
        //上传地址
        UPLOAD: "",
        //百度编辑器上传地址
        UPLOADUEDITOR: ""
    },
    //百度编辑器对象
    EDITORS:[],
    //新增
    Effect:{},
    AJAXDATA:{},
    // 服务端输出的数据
    PHPDATA: {},
    // 初始化后执行的方法（ST.todoList()前执行）
    TODOLIST: [],
    // 页面空方法（用于HTML中执行ST方法，调用：ST.todo('方法名',参数1,...,参数N)）
    todo: function () {
    }
};