$(function(){
    var letao = new Letao();
    letao.addHistory();
    letao.queryHistory();
    letao.deleteHistory();
    letao.clearHistory();
})
var Letao  = function(){

}
Letao.prototype = {
    //增加历史记录到本地库
    addHistory:function(){
        var that = this;
        //按钮添加点击事件拿到查询的文本
        $('.btn-search').on('tap',function(){
            //获取文本
            var search = $('.input-search input').val();
            $('.input-search input').val('');
            if(!search.trim()){
                alert('请输入查询内容');
                return;
            }
            // var oder = true;
            var historyList = JSON.parse(localStorage.getItem('history')) || [];
            for(var i = 0;i < historyList.length;i++){
                if(historyList[i].content == search){
                    // oder = false;
                    return;
                }
            }
                var id = 1;
                var searchObj = {
                id:id,
                content: search
                 }
                 if(historyList.length > 0){
                    searchObj.id = historyList[historyList.length - 1].id + 1;
                }
                historyList.push(searchObj);
                localStorage.setItem('history',JSON.stringify(historyList));
                that.queryHistory();
                location = './searchList.html'
                
        })
    },
    queryHistory:function(){
        var historyList = JSON.parse(localStorage.getItem('history')) || [];
        historyList = historyList.reverse();
        var html = template('historyTpl',{'rows':historyList});
        $('.history-content ul').html(html);
    },
    deleteHistory:function(){
        var that = this;
        //给每个X动态添加点击事件
        $('.history-content ul').on('tap','.delete',function(){
            //拿到点击对应的id
            var index = $(this).data('id');
            var historyList = JSON.parse(localStorage.getItem('history')) || [];
            for(var i = 0;i < historyList.length;i++){
                if(historyList[i].id == index){
                    historyList.splice(i,1);
                }
            }
            localStorage.setItem('history',JSON.stringify(historyList));
            that.queryHistory();
        })
    },
    clearHistory:function(){
        var that = this;
        $('.history-clear').on('tap',function(){
            localStorage.removeItem('history');
            that.queryHistory();
        })
    }
}