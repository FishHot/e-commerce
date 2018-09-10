$(function(){
    var letao = new Letao();
    letao.doRegister();
    letao.getvCode();
})
var Letao = function(){

}
Letao.prototype = {
    vCode:'',
    doRegister:function(){
        var that = this ;
        $('.btn-register').on('tap',function(){
            var username = $('.username').val();
            var password1 = $('.password1').val();
            var password2 = $('.password2').val();
            var mobile = $('.mobile').val();
            var vCode = $('.vCode').val();
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
                    if(password1 != password2){
                        mui.toast('两次输入的密码不一致',{ duration:'1000', type:'div' }) ;
                        return false;
                    }
                    if(vCode != that.vCode){
                        mui.toast('验证码错误',{ duration:'1000', type:'div' }) ;
                        return false;
                    }
                    $.ajax({
                        type:'post',
                        url:'/user/register',
                        data:{username:username,password:password1,mobile:mobile,vCode:vCode},
                        success:function(obj){
                            if(obj.error){
                                mui.toast(obj.message,{ duration:'1000', type:'div' }) ;
                                return false;
                            }
                            location = "login.html?returnURL= index.html"
                            
                        }
                    })
                }
        })
    },
    getvCode:function(){
        var that = this;
        $('.btn-getvCode').on('tap',function(){
            $.ajax({
                url:'/user/vCode',
                success:function(obj){
                    that.vCode = obj.vCode;
                    console.log(that.vCode);
                    
                }
            })
        })
    }
   
}