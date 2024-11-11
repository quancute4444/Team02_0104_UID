vnTNews = {

    loadMore : function ()
    {
        var catID = $("#morelist").attr("catID");
        var pageId = $("#morelist").attr("pageid");
        var pageNext = parseInt(pageId)+1 ;
        if(pageId=='undefined'){	pageId = 0;	}
        var filterParam =  $("#morelist").attr("filterparam");
        var leftRecord = parseInt($("#morelist .num").text());

        $("#more-loading").css("display", "inline-block");
        $("#morelist").css("display", "none");
        var mydata =  "catID="+catID ;
        if(filterParam)	mydata += filterParam ;
        mydata += '&p='+pageNext+'&leftRecord='+leftRecord ;
        $.ajax({
            async: true,
            dataType: 'json',
            url:  ROOT_MOD+"/ajax/load_more.html" ,
            type: 'POST',
            data: mydata ,
            success: function (data) {
                $("#more-loading").css("display", "none");
                $("#morelist").css("display", "inline-block");
                if(data.ok)
                {

                    $('#ListItem').append(data.html);


                    if(data.leftRecord>0){
                        $("#morelist").attr("pageid", pageNext);
                        $("#morelist .num").html(data.leftRecord)
                    }else{
                        $(".div-more-list").remove();
                    }

                    var sUrl = window.location.href;
                    if(sUrl.indexOf('/?')!=-1)
                    {
                        sUrl = sUrl.substr(0, sUrl.indexOf('/?'));
                    }
                    if (window.history.replaceState) {
                        new_url = sUrl+'/?p='+pageNext;
                        if(filterParam) new_url += filterParam
                        window.history.replaceState('', '', new_url);
                        //cap nhat lai href cho viewmore
                        //$('#morelist').attr("href", sUrl + "?p=" + pageNext );
                    }

                }
            }
        });

        return false;


    },

    init:function () {

        $(document).ready(function(){
            $(".lateNews").mnfixed({
                limit : "#vnt-main",
                break: 991
            });
        });
    }

};

$(document).ready(function () {
    vnTNews.init();
});