// import common from '/lib/util/common.js';
let $, layer;

let app = new Vue({
    el: '#app',
    data: {
        locale: Cookies.get('locale') || 'zh_CN',
        id: '1',
        password: '1',
    },
    methods: {
        changeLocale: function (locale) {
            Cookies.set('locale', locale, { expires: 7 });
            window.location.reload();
        },
        systemLogin: function () {
            const { id, password } = this;
            $.ajax({
                url: common.url('account/system-login.do'),
                // async: false,
                headers: {},
                data: { id, password },
                type: 'post',
                success: function (res) {
                    if (res.success) {
                        common.token(res.data);
                        layer.msg(res.message, { icon: 1 }, (end) => (window.location.href = '/index.html'));
                        return;
                    }
                    layer.msg(res.message, { icon: 2 }, (end) => (isAjax = false));
                },
            });
        },
        accessLogin: function (accessCode) {
            $.ajax({
                url: common.url('account/access-login.do'),
                headers: {},
                data: { accessCode },
                type: 'post',
                success: function (res) {
                    if (res.success) {
                        common.token(res.data);
                        layer.msg(res.message, { icon: 1 }, (end) => (window.location.href = '/index.html'));
                        return;
                    }
                    layer.msg(res.message, { icon: 2 }, (end) => (isAjax = false));
                },
            });
        },
        authorize: function (platform) {
            $.get(common.url(`auth/${platform}/authorize.do`), (res, status) => {
                if (res.success) {
                    window.open(res.data);
                    return;
                }
                layer.msg(res.message, { icon: 2 });
            });
        },
    },
});

layui.use(function () {
    $ = layui.jquery;
    layer = layui.layer;
    common.ajaxSetup($);
});

//信道通信
let channel = new BroadcastChannel('auth');
channel.onmessage = (e) => {
    console.log(e.data);
    if (e.data.success) {
        app.accessLogin(e.data.accessCode);
        return;
    } else {
        layer.msg(e.data.message, { icon: 2 });
    }
};
