const common = {
    baseURL: 'http://localhost:80',
    url: function (api) {
        //判断api是否以/开头
        if (api.indexOf('/') === 0) {
            return this.baseURL + api;
        }
        return this.baseURL + '/' + api;
    },
};

// 设置 common中的属性不能被修改
Object.freeze(common);
