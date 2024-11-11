$(document).ready(function(){
    // vnTRUST.goTopStart();
    // SELECT J
    $(".select-j .title").click(function(){
        if(!$(this).parents(".select-j").hasClass("active")){
            $(this).parents(".select-j").addClass("active");
            $(this).parents(".select-j").find(".content").stop().slideDown();
        }
        else{
            $(this).parents(".select-j").removeClass("active");
            $(this).parents(".select-j").find(".content").stop().slideUp();
        }
    });
    // SELECT P
    $(".div_auto_complete .chosen-value").focus(function (e) {
        $(this).parents(".div_auto_complete").addClass("active");
        $(this).parents(".div_auto_complete").find(".dropdown_select").scrollTop(0);
    });
    $(".div_auto_complete .chosen-value").keyup(function(e){
        checkval($(this));
    });
    $(".div_auto_complete .chosen-value").blur(function (e) {
        $(this).parents(".div_auto_complete").removeClass("active");
        $(this).parents(".div_auto_complete").find(".dropdown_select li").removeClass("closed");
    });
    $(".div_auto_complete .dropdown_select li").click(function(e){
        $(this).parents(".div_auto_complete").find(".chosen-value").val($(this).find(".text").html());
    });
    function checkval(_this){
        var $text = _this.val();
        if ($text.length > 0) {
            _this.parents(".div_auto_complete").find(".dropdown_select li").each(function(e){
                var $choose_text = $(this).find("> .text").html();
                if (!($text.substring(0, $text.length).toLowerCase() === $choose_text.substring(0, $text.length).toLowerCase())) {
                    $(this).addClass("closed");
                } else {
                    $(this).removeClass("closed");
                }
            });
            _this.parents(".div_auto_complete").find(".dropdown_select li").each(function(e){
                if($(this).find("li").size() != $(this).find("li.closed").size()){

                    $(this).removeClass("closed");
                }
            });
        } else {
            _this.parents(".div_auto_complete").find(".dropdown_select li").removeClass("closed");
        }
    }
});
