let layer;
//扫码器
let scanner;

layui.use('layer', function () {
    layer = layui.layer;
});

let app = new Vue({
    el: '#app',
    data: {
        qrcode: {
            code: '1234567890',
            account: '1234567890',
        },
        //界面状态 0:收银 1:扫描二维码 2:支付中 3:支付成功 4:支付失败 5:加载中 6:菜单
        state: 6,
        //金额字符串
        amount: '0',
        account: null,
    },
    computed: {
        amountNum() {
            return Number.parseInt(Amount.multi(this.amount, 2));
        },
        deviceAccount() {
            console.log(this.account);
            return this.account ? this.account.id : '未登录';
        },
    },
    methods: {
        //到收银界面
        toCashierPage() {
            this.state = 0;
            this.amount = '0';
            scanner.stop();
        },
        //到扫码界面
        toQrPage() {
            const isAmount = Amount.isAmount(app.amount);
            if (!isAmount) {
                layer.msg('金额不正确');
                return;
            }

            if (app.amountNum <= 0) {
                layer.msg('金额不能为0');
                return;
            }
            scanner.start();
            this.state = 1;
        },
        //到支付中界面
        toPayingPage() {
            scanner.stop();
            this.state = 2;
        },
        //到扫码成功界面
        toQrSuccessPage() {
            scanner.stop();
            this.state = 3;
            this.amount = 0;
        },
        //到扫码失败界面
        toQrFailPage() {
            scanner.stop();
            this.state = 4;
            this.amount = 0;
        },
        toLoadingPage() {
            scanner.stop();
            this.state = 5;
        },
        toMenuPage() {
            scanner.stop();
            this.state = 6;
            this.amount = 0;
        },
        //退出系统
        exitSystem() {},
        //支付记录
        trade() {},
    },
    beforeMount() {
        this.account = common.account();
        if(!this.account) {
            window.location.href = '/page/common/login/index.html';
        }
    },
});
