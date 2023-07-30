let $, layer;

let app = new Vue({
    el: '#app',
    data: {
        locale: Cookies.get('locale') || 'zh_CN',
        account: {
            id: '1',
            password: '1',
        },
        tipEnable: {
            id: false,
            password: false,
        },
        language: {
            zh_CN: {
                title: '登陆系统',
                account: '账号',
                password: '密码',
                role: '角色',
                login: '登陆',
                user: '用户',
                admi: '管理员',
                pos: '刷卡机',
                account_tip: '账号为10位数字',
                password_tip: '密码为8-16位大小写字母数字特殊字符',
                logining: '登陆中',
            },
            en_US: {
                title: 'Sign in to System',
                account: 'account',
                password: 'password',
                role: 'role',
                login: 'Sign in',
                user: 'user',
                admin: 'admin',
                pos: 'pos',
                account_tip: 'account is 10 digits',
                password_tip: 'password is 8-16 digits, including uppercase and lowercase letters, numbers and special characters',
                logining: 'signing in',
            },
        },
    },
    methods: {
        changeLocale(locale) {
            Cookies.set('locale', locale, { expires: 7 });
            this.locale = locale;
        },
        systemLogin() {
            layer.msg(this.language[this.locale].logining, {
                icon: 16,
                shade: 0.01,
            });

            const { id, password } = this.account;
            $.ajax({
                url: 'account/system-login.do',
                headers: {},
                data: { id, password },
                type: 'post',
                success: function (res) {
                    if (res.success) {
                        common.token(res.data);
                        layer.msg(res.message, { icon: 1 }, (end) => (window.location.href = '/index.html'));
                        return;
                    }
                    layer.closeAll();
                    layer.msg(res.message, { icon: 2 }, (end) => (isAjax = false));
                },
            });
        },
        accessLogin(accessCode) {
            layer.msg(this.language[this.locale].logining, {
                icon: 16,
                shade: 0.01,
            });

            $.ajax({
                url: 'account/access-login.do',
                headers: {},
                data: { accessCode },
                type: 'post',
                success: function (res) {
                    if (res.success) {
                        common.token(res.data);
                        layer.msg(res.message, { icon: 1 }, (end) => (window.location.href = '/index.html'));
                        return;
                    }
                    layer.closeAll();
                    layer.msg(res.message, { icon: 2 }, (end) => (isAjax = false));
                },
            });
        },
        authorize(platform) {
            $.get(`auth/${platform}/authorize.do`, (res, status) => {
                if (res.success) {
                    window.open(res.data);
                    return;
                }
                layer.msg(res.message, { icon: 2 });
            });
        },
        check(item) {
            const { id, password } = this.account;
            if (item == 'id') {
                this.tipEnable.id = !/^\d{10}$/.test(id);
            }

            if (item == 'password') {
                this.tipEnable.password = !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~!@&%#_])[a-zA-Z0-9~!@&%#_]{8,16}$/.test(password);
            }
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
