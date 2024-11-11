// Get from query hash
String.prototype.getQueryHash = function (name, defaultVal) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\#&$]" + name + "=([^&#]*)"),
		results = regex.exec(this);
	return results == null ? (defaultVal == undefined ? "" : defaultVal) : decodeURIComponent(results[1].replace(/\+/g, " "));
};


function cityChange(city_value,lang)
{
	var mydata =  "city="+city_value+'&lang='+lang;
	$.ajax({
		async: true,
		url: ROOT+"modules/dealer/ajax/ajax.php?do=option_state",
		type: 'POST',
		data: mydata ,
		success: function (html) {
			$("#state").html(html) ;
		}
	});
}

function stateChange(state_value,lang)
{
	var city_value = $("#dealer_city").val();
	searchStore (city_value,state_value,'');
	return false ;
}



vnTDealer = {

	SuggestKeyword:function(obj)
	{
		var o = $(obj).val().replace(/:|;|!|@@|#|\$|%|\^|&|\*|'|"|>|<|,|\.|\?|\/|`|~|\+|=|_|\(|\)|{|}|\[|\]|\\|\|/gi, "") ;
		var keyword = o.trim().toLowerCase();

		if (keyword.length < 2) {
			$(".search-suggestion-wrapper").html('');
			return false ;
		}

		//alert('currID = '+currID+' | keyword = '+keyword)
		$.ajax({
			async: true,
			dataType: 'json',
			url:  ROOT_MOD+"/ajax/suggest_keyword.html" ,
			type: 'POST',
			data: "keyword="+keyword,
			success: function (data) {
				if(data.ok==1){
					$(".search-suggestion-wrapper").html(data.html)
				}else{
					$(".search-suggestion-wrapper").html('');
				}

			}
		});


		return false ;
	},

	selectItemSuggest:function(id)
	{
		var obj = $(".search-suggestion-list #key_"+id);
		var city = parseInt(obj.attr("data-city")) ;
		var state =parseInt(obj.attr("data-state"));
		var text = obj.attr("data-title");

		$("#key_search").val(text);
		if(city>0 && (city != $("#city").val()) ){
			$("#city").val(city).trigger("change");
			if(state>0){
				setTimeout(function () {
					$("#state").val(state);
				},100)

			}
		}



		$(".search-suggestion-wrapper").html('');
		return false ;
	},


	initFilter : function ()
	{


		$(".list-filters li").click( function() {

			var obj = $(this).closest('.list-filters') ;
			data = []; text = '';
			if($(this).hasClass("checked")) {
				$(this).removeAttr("class");
			} else {
				$(this).addClass("checked");
			}
			obj.find('li').each(function(i, e){
				if($(this).hasClass("checked")) {
					id = $(this).attr('data-id');
					data.push(id);
					if(text!=''){		text += '; ';	}
					text += $(this).attr('data-text');
				}
			});
			data.join();
			obj.find('.input-value').val(data);

			$(this).closest('.div_auto_complete').find('.chosen-value').val(text);

		});


		$('#btn_list').click(function () {
			var $this = $(this);
			if ($this.hasClass('active')) {
				$this.removeClass();
				$('ul.list-filters').css({
					"display": "none"
				});
			} else {
				$this.addClass('active');
				$('ul.list-filters').css({
					"display": "block"
				});
			}
		});

		$("#key_search").keyup(function () {
			vnTDealer.SuggestKeyword($(this));
		});


		$(window).bind("click", function (e) {
	    var $clicked = $(e.target);

	    if (!$clicked.parents().hasClass("search-suggestion-wrapper")) {
	      $(".search-suggestion-wrapper").html("");
	    }
	    	     
	  });

		return false;
	},

	init:function () {
		vnTDealer.initFilter();
		$('#slider-dealer').slick({
			dots: false,
			arrows: true,
			speed: 1000,
			autoplay: true,
			autoplaySpeed: 3000,
			slidesToShow: 1,
			slidesToScroll: 1
		});
	}

};

$(document).ready(function () {
	vnTDealer.init();
});
