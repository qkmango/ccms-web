import QrScanner from '/lib/qr-scanner/qr-scanner.min.js';
QrScanner.WORKER_PATH = '/lib/qr-scanner/qr-scanner-worker.min.js';

const video = document.getElementById('qr-video');
const flashToggle = document.getElementById('flash-toggle');
const flashState = document.getElementById('flash-state');
// ####### Web Cam Scanning #######

//扫描到二维码
//在index.js中定义了scanner对象，这里直接使用
scanner = new QrScanner(
    video,
    (result) => {
        app.qrcode = result;
        console.log('扫描到二维码: ' + result);
        app.toPayingPage();
    },
    (error) => {
        app.qrcode = error;
    }
);

window.scanner = scanner;
//添加canvas扫描区域
document.querySelector('#qr-canvas').appendChild(scanner.$canvas);

// 开始扫描，页面初始化加载时不调用
// scanner.start();
