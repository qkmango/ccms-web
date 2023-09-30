// 子页面需要引入的js

const SubPage = {
    assertTopPage: function (title) {
        if (self === top) {
            if (!title) {
                title = '<未定义标题>';
            }
            let html = `<h1 class="title"
                style="line-height: 56px;padding-left: 16px;color: #00965e;background-color: #e5f4ef;">${title}
                <img style="height: 40px;float: right;margin: 8px 16px auto auto;" src="/image/logo.svg">
            </h1>`;
            document.getElementsByTagName('body')[0].insertAdjacentHTML('afterbegin', html);
        }
    },
};

Object.freeze(SubPage);
// export default subPage;
