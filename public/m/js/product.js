$(function(){
    var letao = new Letao();
    letao.mainSlide();
    letao.productData();
    letao.selectSize();
    letao.addBuyCar();
})
var Letao = function(){

}
Letao.prototype = {
    id:'',
    mainSlide:function(){
            mui('.mui-scroll-wrapper').scroll({
                // scrollY: true, //是否竖向滚动
                // scrollX: false, //是否横向滚动
                // startX: 0, //初始化时滚动至x
                // startY: 0, //初始化时滚动至y
                indicators: false, //是否显示滚动条
                deceleration: 0.0006, //阻尼系数,系数越小滑动越灵敏
                bounce: true //是否启用回弹
            })
    },
    initSlide:function(){
        var gallery = mui('.mui-slider');
        gallery.slider({
          interval:1000//自动轮播周期，若为0则不自动播放，默认为0；
        })
    },
    productData:function(){
        var that = this;
        var str = location.search;
        var index = str.indexOf('=') + 1;
        var str =decodeURI(str.substring(index));
        that.id = str,
        $.ajax({
            url:'/product/queryProductDetail',
            data:{id:str},
            success:function(obj){
                var slideHtml = template('slideTpl',obj);
                $('#slide').html(slideHtml);
                that.initSlide();
                var minSize = obj.size.split('-')[0];
                var maxSize = obj.size.split('-')[1];
                var size = [];
                for(var i = minSize;i <= maxSize;i++){
                    size.push(parseInt(i));
                }
                obj.size = size;
                var detailHtml = template('productDetail',obj);
                $('#product-detail').html(detailHtml);
                mui('.mui-numbox').numbox()
            }
        })
    },
    //点击尺码变色
    selectSize:function(){
        //获取所有动态生成的尺码
        $('#product-detail').on('tap','.product-size .size',function(){
                $(this).addClass('active').siblings().removeClass('active');
        })
    },
    //添加到购物车
    addBuyCar:function(){
        var that = this;
        $('.btn-buyCar').on('tap',function(){
            //获取选择的尺码
            var size = $('.product-size .size.active').data('size');
            if(!size){
                mui.toast('请选择尺码',{ duration:'1000', type:'div' }) ;
                return false;
            }
            var num = mui('.mui-numbox').numbox().getValue();
            if(!num){
                mui.toast('请选择数量',{ duration:'1000', type:'div' }) ;
                return false;
            }
            $.ajax({
                type:'post',
                url:'/cart/addCart',
                data:{productId: that.id,num:num,size:size},
                success:function(obj){
                    if(obj.error){
                        location = 'login.html?returnURL= product.html?productId=2 ';
                    }else{
                         //已登录到购物车页面
                         //确认框
                         mui.confirm( '添加购物车成功,需要到页面查看吗?', '温馨提示', ['是','否'], function callback(e){
                            if(e.index==0){
                                location.href = 'cart.html';
                            }else{
                                mui.toast('放弃查看,继续购买!',{ duration:'1000', type:'div' }) 
                            }
                            
                         })
                    }   
                   

                    
                }
            })
        })
        
    }
   
    }