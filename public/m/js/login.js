$(function(){
    var letao = new Letao();
    letao.login();
    letao.register();
})
var Letao = function(){

}
Letao.prototype = {
    //登录添加点击事件
    login:function(){
        var that = this;
        $('.btn-login').on('tap',function(){
            
            var username = $('.username').val();
            var password = $('.password').val();
            var check = true;
            mui(".mui-input-row input").each(function() {
                //若当前input为空，则alert提醒 
                if(this.value.trim() == "") {
                    var label = this.previousElementSibling;
                    mui.toast('请输入' + label.innerText,{ duration:'1000', type:'div' }) ;
                    check = false;
                    return false;
                }
                }); //校验通过，继续执行业务逻辑 
                if(check){
                    $.ajax({
                        type:'post',
                        url:'/user/login',
                        data:{username:username,password:password},
                        success:function(obj){
                            if(obj.error){
                                mui.toast(obj.message,{ duration:'1000', type:'div' }) ;
                                return false;
                            }
                          location = that.getQueryString('returnURL');
                        }
                    })
                }

            
        })
    },
    register:function(){
        $('.btn-register').on('tap',function(){
            location = 'register.html'
            
        })
    },
    getQueryString:function (name) { 
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
        var r = window.location.search.substr(1).match(reg); 
        if (r != null) return decodeURI(r[2]); return null; 
  }
}