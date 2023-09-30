const common = {
    baseURL: (function () {
        if (window.top.location.hostname === 'localhost') {
            return 'http://localhost:80';
        }
        return '';
    })(),

    url: function (api) {
        console.log('api', api);
        //判断api是否以/开头
        if (api.indexOf('/') === 0) {
            return this.baseURL + api;
        }
        return this.baseURL + '/' + api;
    },

    getUrlParam: function (key) {
        const reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)');
        const r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    },
    urlLocation: function (href) {
        return {
            // 提取 url 路径
            pathname: (function () {
                let pathname = href
                    ? (function () {
                          let str = (href.match(/\.[^.]+?\/.+/) || [])[0] || '';
                          return str.replace(/^[^\/]+/, '').replace(/\?.+/, '');
                      })()
                    : location.pathname;
                return pathname.replace(/^\//, '').split('/');
            })(),

            // 提取 url 参数
            search: (function () {
                let obj = {};
                let search = (
                    href
                        ? (function () {
                              let str = (href.match(/\?.+/) || [])[0] || '';
                              return str.replace(/\#.+/, '');
                          })()
                        : // : location.search
                          decodeURIComponent(location.search)
                )
                    .replace(/^\?+/, '')
                    .split('&'); // 去除 ?，按 & 分割参数

                // 遍历分割后的参数
                search.forEach(function (item) {
                    let _index = item.indexOf('=');
                    let key = (function () {
                        if (_index < 0) {
                            return item.substr(0, item.length);
                        } else if (_index === 0) {
                            return false;
                        } else {
                            return item.substr(0, _index);
                        }
                    })();
                    if (key) {
                        obj[key] = decodeURIComponent(_index > 0 ? item.substr(_index + 1) : null);
                    }
                });

                return obj;
            })(),

            // 提取 Hash
            hash: (function () {
                if (href) {
                    let hashMatch = href.match(/#.+/);
                    return hashMatch ? hashMatch[0] : '/';
                } else {
                    return location.hash;
                }
            })(),
        };
    },
};

// 设置 common中的属性不能被修改
Object.freeze(common);
