$(function(){
    var letao = new Letao();
    letao.initPullRefresh();
    letao.editCart();
    letao.deleteCate();
    letao.countCart();
})
var Letao = function(){

}
Letao.prototype = {
    page:1,
    pageSize:5,
    initPullRefresh: function(){
        var that = this ;
        mui.init({
            pullRefresh : {
                //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
              container:"#refreshContainer",
              down : {
                  //可选,默认false.首次加载自动下拉刷新一次
                auto: true,
                  //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                callback :function(){
                    setTimeout(function(){
                        that.page = 1;
                        that.getQueryData(function(obj){
                            var html = template('productListTpl',obj)
                            $('.mui-scroll .mui-table-view').html(html);
                            mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
                            mui('#refreshContainer').pullRefresh().refresh(true);
                        })
                        // $.ajax({
                        //     url:'/cart/queryCartPaging',
                        //     data:{page:that.page,pageSize:that.pageSize},
                        //     success:function(obj){
                        //         var html = template('productListTpl',obj)
                        //        $('.mui-scroll .mui-table-view').html(html);
                        //        mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
                        //        mui('#refreshContainer').pullRefresh().refresh(true);
                        //     }
                           
                        // }) 
                    },1000)
                } 
              },
              up : {
                  //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                callback :function(){
                    setTimeout(function(){
                        that.page++;
                        that.getQueryData(function(obj){
                            if(obj instanceof Array){
                                mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
                            }else{
                                    var html = template('productListTpl',obj)
                                    $('.mui-scroll .mui-table-view').append(html);
                                    mui('#refreshContainer').pullRefresh().endPullupToRefresh();
                            }
                        })
                        // $.ajax({
                        //     url:'/cart/queryCartPaging',
                        //     data:{page:that.page,pageSize:that.pageSize},
                        //     success:function(obj){
                        //         if(obj instanceof Array){
                        //             mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
                        //         }else{
                        //                 var html = template('productListTpl',obj)
                        //                 $('.mui-scroll .mui-table-view').append(html);
                        //                 mui('#refreshContainer').pullRefresh().endPullupToRefresh();
                        //         }
                           
                        //     }
                        // })  
                    },1000)
                } 
              }
            }
          });
    },
    getQueryData:function(callback){
        var that = this;
        $.ajax({
            url:'/cart/queryCartPaging',
            data:{page:that.page,pageSize:that.pageSize},
            success:function(obj){
                callback && callback(obj);
            }
        })  
    },
    //编辑页面
    editCart:function(){
        $('.cartList').on('tap','.btn-edit',function(){
            var li = this.parentNode.parentNode;
            var product = {
                productSize:$(this).data('product-size'),
                size:$(this).data('size'),
                productNum:$(this).data('product-num'),
                num:$(this).data('num'),
                id:$(this).data('id'),
            }
            var minSize = product.productSize.split('-')[0];
            var maxSize = product.productSize.split('-')[1];
            var size = [];
            for(var i = minSize;i <= maxSize;i++){
                size.push(parseInt(i));
            }
            product.productSize = size;
            var html = template('editCart',product);
            html = html.replace(/[\r\n]/g, "");
            mui.confirm( html, '编辑商品', ['确认','取消'], function(e){
                if(e.index==0){
                    var seletSize = $('.sizeSelect.active').data('size');
                    var seletNum = mui('.mui-numbox').numbox().getValue();
                    $.ajax({
                        type:'post',
                        url:'/cart/updateCart',
                        data:{id:product.id,size:seletSize,num:seletNum},
                        success:function(obj){
                           if(obj.success){
                            $(li).find('.mui-media-body .size span').html(seletSize);
                            $(li).find('.mui-media-body .num span').html(seletNum);
                            $(li).find('.btn-edit').data('size',seletSize);
                            $(li).find('.btn-edit').data('num',seletNum);
                            mui.swipeoutClose(li);
                           }else{
                            window.location.href = 'login.html?=returnUrl=cart.html';
                           }
                        }
                    }) 
                }else{
                    mui.swipeoutClose(li)
                }
                
            })
            $('.sizeSelect').on('tap',function(){
                $(this).addClass('active').siblings().removeClass('active');
            })
            mui('.mui-numbox').numbox();
        })
    },
    deleteCate:function(){
        $('.cartList').on('tap','.btn-delete',function(){
            var li = this.parentNode.parentNode;
            var id = $(this).data('id');
            mui.confirm( '确认删除吗?', '温馨提示', ['确认','取消'], function(e){
                if(e.index==0){
                    $.ajax({
                        url:'/cart/deleteCart',
                        data:{id:id},
                        success:function(obj){
                            if(obj.success){
                                $(li).remove();
                                mui.swipeoutClose(li);
                            }else{
                                window.location.href = 'login.html?=returnUrl=cart.html';
                            }
                        }
                    })
                }else{
                    mui.swipeoutClose(li);
                }
                
            })
        })
    },
    //累加和
    countCart:function(){
        //没一个复选框添加change事件
        $('.mui-scroll').on('change','.mui-pull-left input[type="checkbox"]',function(){
            var checkedList = $('.mui-pull-left input:checked');
            var sum = 0;
            checkedList.each(function(index,ele){
                 var price = $(ele).parent().siblings().find('.price .newPrice').html();
                 var num = $(ele).parent().siblings().find('.num span').html();
                 sum += price * num;
                 
            })
            sum = sum.toFixed(2);
            $('#count>span').html(sum);
            
        })
    }


}