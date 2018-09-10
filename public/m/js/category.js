$(function () {
    var letao = new Letao();
    letao.mainSlide();
    letao.getCate();
    letao.getContent();
})
var Letao = function () {

}
Letao.prototype = {
    mainSlide: function () {
        mui('.mui-scroll-wrapper').scroll({
            scrollY: true, //是否竖向滚动
            scrollX: false, //是否横向滚动
            startX: 0, //初始化时滚动至x
            startY: 0, //初始化时滚动至y
            indicators: false, //是否显示滚动条
            deceleration: 0.0006, //阻尼系数,系数越小滑动越灵敏
            bounce: true //是否启用回弹
        })
    },
    getCate: function () {
        $.ajax({
            url: '/category/queryTopCategory',
            success: function (obj) {
                var html = template('cateTpl', obj)
                $('.cate-slide').children('ul').html(html);

            }
        })
    },
    getContent: function () {
        this.getData(1);
        var that = this;
        $('.cate-slide ul').on('click', 'li a', function () {
            id = $(this).data('id');
            that.getData(id);
            $(this).parent().addClass('active').siblings().removeClass('active');
        })
    },
    getData: function (id) {
        //拿到点击对应a的id
        // console.log($(this).data('id'));
        $.ajax({
            url: '/category/querySecondCategory',
            data: { 'id': id },
            success: function (obj) {
                var html = template('contentTpl', obj);
                $('.cate-content .mui-row').html(html);
            }
        })

    }

}