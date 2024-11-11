(function($) {
    $.fn.my_effect_scroll = function(options){
        var settings = $.extend({
            itemSelector : null,
            classItemVisible : null,
            height_per: 30,
            height_px: 200
        }, options );
        var $container = this;
        var container = $container[0];
        var isRoot = isRootContainer(container);
        itemVisible_true();
        $(window).scroll(function (e) {
            itemVisible_true();
        });
        $(window).resize(function (e){
            itemVisible_true();
        });
        $($container).scroll(function (e) {
            itemVisible_true();
        });
        $($container).resize(function (e){
            itemVisible_true();
        });
        function itemVisible_true(){
            if (settings.itemSelector != null){
                $container.find(settings.itemSelector).each(function (e) {
                    var offset_top = $(this).offset().top;
                    var height_item = $(this).innerHeight();
                    var main_scroll = $container.scrollTop();
                    var main_height = $container.innerHeight();
                    if(! isRoot){
                        offset_top = $(this).offset().top + main_scroll - $container.offset().top;
                    }
                    if(isRoot){
                        main_scroll = $(window).scrollTop();
                    }
                    if(isRoot){
                        main_height = $(window).innerHeight();
                    }
                    if( main_scroll >= offset_top && main_scroll <=  (offset_top + height_item)){
                        var tam = (height_item + offset_top - main_scroll);
                        if((tam*100/height_item) >= settings.height_per || (tam*100/main_height) >= settings.height_per || tam >= settings.height_px){
                            $(this).addClass(settings.classItemVisible);
                        }
                    }else{
                        if(main_scroll <= offset_top && (main_scroll + main_height) >= (offset_top + height_item)){
                            $(this).addClass(settings.classItemVisible);
                        }else{
                            if((main_scroll + main_height) >= offset_top && (main_scroll + main_height) <= (offset_top + height_item)){
                                var tam = main_height + main_scroll - offset_top;
                                if((tam*100/height_item) >= settings.height_per || (tam*100/main_height) >= settings.height_per || tam >= settings.height_px){
                                    $(this).addClass(settings.classItemVisible);
                                }
                            }
                        }
                    }
                });
            }
            return false;
        }
        function isRootContainer(container) {
            return (container == window || container == document || container == document.body);
        }
    };
})(jQuery);