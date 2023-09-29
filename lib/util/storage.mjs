const ProjectStorage = {

    a:"aaa",

    /**
     * 获取token，如果传入token则保存token
     * @param {object} token
     * @returns
     */
    token: function (tokenEntity) {
        //如果传入null则删除token
        const path = '/';
        if (tokenEntity === null) {
            Cookies.remove('Authorization', { path });
            return;
        }

        if (tokenEntity) {
            const { token, expireAt } = tokenEntity;
            Cookies.set('Authorization', token, {
                path,
                expires: new Date(Number.parseInt(expireAt)),
            });
            return;
        }

        const token = Cookies.get('Authorization');
        if (token) {
            return token;
        }
        return null;
    },

    // 修改使用localStorage存储账号信息
    account: function (account) {
        //如果传入null则删除account
        if (account === null) {
            localStorage.removeItem('account');
            return;
        }

        //如果传入account则保存account
        if (account) {
            localStorage.setItem('account', JSON.stringify(account));
            return;
        }

        const StorageAccount = localStorage.getItem('account');
        //判断是否存在account
        if (!StorageAccount) {
            return null;
        }

        return JSON.parse(StorageAccount);
    },
};

export default ProjectStorage;
