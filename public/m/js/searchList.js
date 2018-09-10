$(function(){
    var letao = new Letao();
    letao.initpullRefresh();
    letao.productList();
    letao.tapSearch();
    letao.productSort();
})
var Letao = function(){

}
Letao.prototype = {
    search:'',
    page:'1',
    pageSize:'2',
    initpullRefresh:function(){
        var that = this;
        mui.init({
            pullRefresh : {
              container:"#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
              down : {
                  //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                callback :function(){
                    setTimeout(function(){
                        that.page = 1;
                        $.ajax({
                            url:'/product/queryProduct',
                            data:{'page':that.page,'pageSize':that.pageSize,'proName':that.search},
                            success:function(obj){
                                var html = template('productsTpl',obj);
                                $('.productsList .mui-row').html(html); 
                                mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
                                mui('#refreshContainer').pullRefresh().refresh(true); 
                            }
                        }) 
                    },1000)
                } 
              },
              up : {
                  //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                callback :function(){
                    setTimeout(function(){
                        that.page ++;
                        $.ajax({
                            url:'/product/queryProduct',
                            data:{'page':that.page,'pageSize':that.pageSize,'proName':that.search},
                            success:function(obj){
                                if(obj.data.length>0){
                                    var html = template('productsTpl',obj);
                                    $('.productsList .mui-row').append(html); 
                                    mui('#refreshContainer').pullRefresh().endPullupToRefresh();
                                }else{
                                    mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
                                }
                                
                                
                            }
                        })  
                    },1000)
                } 
              }
            }
          });
    },
    productList:function(){
        var that = this;
        that.page = 1;
        // var str = location.search;
        // var index = str.indexOf('=') + 1;
        // that.search =decodeURI(str.substring(index));
        that.search = that.getQueryString('key');
        $.ajax({
            url:'/product/queryProduct',
            data:{'page':that.page,'pageSize':that.pageSize,'proName':that.search},
            success:function(obj){
                var html = template('productsTpl',obj);
                $('.productsList .mui-row').html(html); 
                mui('#refreshContainer').pullRefresh().refresh(true);
            }
        })    
        
    },
    tapSearch:function(){
        var that = this;
        that.page = 1;
        $('.btn-search').on('tap',function(){
            //获取输入内容
             that.search = $('.input-search input').val();
            if(!that.search.trim()){
                alert('请输入关键字!')
                return;
            }
            $.ajax({
                url:'/product/queryProduct',
                data:{'page':that.page,'pageSize':that.pageSize,'proName':that.search},
                success:function(obj){
                    var html = template('productsTpl',obj);
                    $('.productsList .mui-row').html(html); 
                    mui('#refreshContainer').pullRefresh().refresh(true);
                }
            }) 
        })
    },
    productSort:function(){
        var that = this;
        $('.sift ul>li').on('tap',function(){
            var type = $(this).data('type');
            var sort = $(this).data('sort');
            sort = sort == 1 ? 2:1;
            // console.log(sort);
            
            $(this).data('sort',sort);
            if (type=='price') {
                $.ajax({
                    url:'/product/queryProduct',
                    data:{'page':that.page,'pageSize':that.pageSize,'proName':that.search,'price':sort},
                    success:function(obj){
                        var html = template('productsTpl',obj);
                        $('.productsList .mui-row').html(html); 
                        mui('#refreshContainer').pullRefresh().refresh(true);
                    }
                }) 
            }else if(type=='num'){
                $.ajax({
                    url:'/product/queryProduct',
                    data:{'page':that.page,'pageSize':that.pageSize,'proName':that.search,'num':sort},
                    success:function(obj){
                        var html = template('productsTpl',obj);
                        $('.productsList .mui-row').html(html); 
                        mui('#refreshContainer').pullRefresh().refresh(true);
                    }
                })
            }
             
            
        })
    },
    getQueryString:function (name) { 
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
        var r = window.location.search.substr(1).match(reg); 
        if (r != null) return decodeURI(r[2]); return null; 
  }
  
    }