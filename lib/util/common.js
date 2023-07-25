const common = {
    baseURL: 'http://localhost:80',
    url: function (api) {
        console.log('api', api);
        //判断api是否以/开头
        if (api.indexOf('/') === 0) {
            return this.baseURL + api;
        }
        return this.baseURL + '/' + api;
    },

    /**
     * 获取token，如果传入token则保存token
     * @param {object} token
     * @returns
     */
    token: function (token) {
        //如果传入null则删除token
        if (token === null) {
            localStorage.removeItem('token');
            return;
        }

        //如果传入token则保存token
        if (token) {
            localStorage.setItem('token', JSON.stringify(token));
            return;
        }

        const localStorageToken = localStorage.getItem('token');
        //判断是否存在token
        if (!localStorageToken) {
            return null;
        }

        // 先判断token是否过期
        token = JSON.parse(localStorageToken);
        if (token && token.expireIn > Date.now()) {
            return token.accessToken;
        }

        // 如果token过期则删除token
        localStorage.removeItem('token');
        return null;
    },

    account: function (account) {
        //如果传入null则删除account
        if (account === null) {
            sessionStorage.removeItem('account');
            return;
        }

        //如果传入account则保存account
        if (account) {
            sessionStorage.setItem('account', JSON.stringify(account));
            return;
        }

        const sessionStorageAccount = sessionStorage.getItem('account');
        //判断是否存在account
        if (!sessionStorageAccount) {
            return null;
        }

        return JSON.parse(sessionStorageAccount);
    },

    /**
     * jquery ajax请求设置
     * @param {object} jquery
     * @returns
     */
    ajaxSetup: function (jquery) {
        if (!jquery) {
            return;
        }

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
            headers: {
                Authorization: this.token(),
            },
            dataType: 'json',
            success: function (res) {
                if (res.success) {
                    layer.msg(res.message, { icon: 1 });
                    return;
                }
                layer.msg(res.message, { icon: 2 });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                const progress = window.top.progress;
                if (progress) {
                    progress.error();
                }
                layer.msg(jqXHR.status + ' ' + jqXHR.responseJSON.message, { icon: 2 });
            },
            complete(xhr, status) {
                const progress = window.top.progress;
                if (progress) {
                    progress.end();
                }
            },
        });
    },

    getUrlParam: function (key) {
        const reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)');
        const r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    },
};

// 设置 common中的属性不能被修改
Object.freeze(common);
