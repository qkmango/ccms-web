// import common from '/lib/util/common.js';
let $, layer, auth;

layui.use(function () {
    $ = layui.jquery;
    layer = layui.layer;
    common.ajaxSetup($);

    //是否正在执行ajax，防止过次点击执行
    let isAjax = false;

    const id = document.querySelector('#id');
    const password = document.querySelector('#password');
    const button = document.querySelector('#login_btn');
    let role = document.querySelector('#role');
    const id_error_tip = document.querySelectorAll('.tip')[0];
    const pwd_error_tip = document.querySelectorAll('.tip')[1];

    id.onblur = checkId;
    password.onblur = checkPassword;

    //检查ID
    function checkId() {
        const result = layui_verify_config.id(id.value);
        console.log(result);
        if (result === false) {
            id_error_tip.style.display = 'none';
            return true;
        }
        id_error_tip.style.display = 'block';
        return false;
    }

    //检查密码
    function checkPassword() {
        const result = layui_verify_config.password(password.value);
        console.log(result);
        if (result === false) {
            pwd_error_tip.style.display = 'none';
            return true;
        }
        pwd_error_tip.style.display = 'block';
        return false;
    }

    //登陆按钮绑定监听时间 登陆
    button.onclick = function () {
        login();
        return;
    };

    const locale = Cookies.get('locale');
    if (locale === 'en_US') {
        document.querySelector('#en_US').className = 'this_locale_btn';
    } else {
        document.querySelector('#zh_CN').className = 'this_locale_btn';
    }

    //登陆
    function login() {
        $.ajax({
            url: common.url('account/login.do'),
            async: false,
            headers: {},
            data: {
                id: id.value.trim(),
                password: password.value.trim(),
            },
            type: 'post',
            success: function (res) {
                if (res.success) {
                    common.token(res.data);
                    layer.msg(res.message, { icon: 1 }, (end) => (window.location.href = '../../index.html'));
                    return;
                }
                layer.msg(res.message, { icon: 2 }, (end) => (isAjax = false));
            },
        });
    }

    // 认证，传入认证地址
    auth = function (platform) {
        $.get(common.url(`auth/${platform}/authorize.do`), (res, status) => {
            if (res.success) {
                // console.log(res.data);
                window.location.href = res.data;
                return;
            }
            layer.msg(res.message, { icon: 2 });
        });
    };
});

/**
 * 更改语言
 */
function changeLocale(locale) {
    Cookies.set('locale', locale, { expires: 7 });
    window.location.reload();
}
