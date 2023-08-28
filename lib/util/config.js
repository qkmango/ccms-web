function config() {
    if (layui) {
        ajaxSetup(layui.jquery);
    }
}

function ajaxSetup(jquery) {
    if (!jquery) {
        return;
    }

    const baseURL = this.baseURL;
    // jquery.ajaxPrefilter((options) => {
    //     //判断是否以 /api 或者 api 开头
    //     if (options.url.indexOf('/api/') === 0) {
    //         options.url = baseURL + options.url;
    //     } else if (options.url.indexOf('api/') === 0) {
    //         options.url = baseURL + '/' + options.url;
    //     }
    // });

    jquery.ajaxPrefilter((options) => {
        //判断是否以 / 开头
        if (options.url.indexOf('/') !== 0) {
            options.url = '/' + options.url;
        }
        console.log('%c>>>>>> ' + options.url, 'color: blue');
    });

    jquery.ajaxSetup({
        xhrFields: {
            withCredentials: true,
        },
        beforeSend: function (xhr) {
            const progress = window.top.progress;
            if (progress) {
                progress.start();
            }
        },
        // headers: {
        //     Authorization: this.token(),
        // },
        dataType: 'json',
        success: function (res) {
            if (res.success) {
                if (layer && res.message) {
                    layer.msg(res.message, { icon: 1 });
                }
                return;
            }
            if (layer && res.message) {
                layer.msg(res.message || '', { icon: 2 });
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            const progress = window.top.progress;
            if (progress) {
                progress.error();
            }
            console.log(jqXHR, textStatus, errorThrown);
            if (layer) {
                // layer.msg(jqXHR.statusText, { icon: 2 });
                layer.msg('请求失败', { icon: 2 });
            }
        },
        complete(xhr, status) {
            const progress = window.top.progress;
            if (progress) {
                progress.end();
            }
        },
    });
}

config();
