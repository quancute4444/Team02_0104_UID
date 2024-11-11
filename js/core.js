/*
 vnTRUST ;
 */
var vnTRUST = {

};

//check every thing;
vnTRUST.is_arr = function(arr) { return (arr != null && arr.constructor == Array) };

vnTRUST.is_str = function(str) { return (str && (/string/).test(typeof str)) };

vnTRUST.is_func = function(func) { return (func != null && func.constructor == Function) };

vnTRUST.is_num = function(num) { return (num != null && num.constructor == Number) };

vnTRUST.is_obj = function(obj) { return (obj != null && obj instanceof Object) };

vnTRUST.is_ele = function(ele) { return (ele && ele.tagName && ele.nodeType == 1) };

vnTRUST.is_exists = function(obj) { return (obj != null && obj != undefined && obj != "undefined") };

vnTRUST.is_json = function(){};

vnTRUST.is_blank = function(str) { return (vnTRUST.util_trim(str) == "") };

vnTRUST.is_phone = function(num) {
	//return (/^(0120|0121|0122|0123|0124|0125|0126|0127|0128|0129|0163|0164|0165|0166|0167|0168|0169|0188|0199|090|091|092|093|094|095|096|097|098|099)(\d{7})$/i).test(num);
	return (/^(01([0-9]{2})|09[0-9])(\d{7})$/i).test(num);
};

vnTRUST.isNumberKey  = function (evt) {
	var charCode = (evt.which) ? evt.which : event.keyCode;
	if (charCode > 31 && (charCode < 48 || charCode > 57))
		return false;
	return true;
};

vnTRUST.is_email = function(str) {return (/^[a-z-_0-9\.]+@[a-z-_=>0-9\.]+\.[a-z]{2,3}$/i).test(vnTRUST.util_trim(str))};

vnTRUST.is_username = function(value){ return (value.match(/^[0-9]/) == null) && (value.search(/^[0-9_a-zA-Z]*$/) > -1); }

vnTRUST.is_link = function(str){ return (/(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/).test(vnTRUST.util_trim(str)) };

vnTRUST.is_image = function(imagePath){
	var fileType = imagePath.substring(imagePath.lastIndexOf("."),imagePath.length).toLowerCase();
	return (fileType == ".gif") || (fileType == ".jpg") || (fileType == ".png") || (fileType == ".jpeg");
};

vnTRUST.is_ff  = function(){ return (/Firefox/).test(navigator.userAgent) };

vnTRUST.is_ie  = function() { return (/MSIE/).test(navigator.userAgent) };

vnTRUST.is_ie6 = function() { return (/MSIE 6/).test(navigator.userAgent) };

vnTRUST.is_ie7 = function() { return (/MSIE 7/).test(navigator.userAgent) };

vnTRUST.is_ie8 = function() { return (/MSIE 8/).test(navigator.userAgent) };

vnTRUST.is_chrome = function(){ return (/Chrome/).test(navigator.userAgent) };

vnTRUST.is_opera = function() { return (/Opera/).test(navigator.userAgent) };

vnTRUST.is_safari = function(){ return (/Safari/).test(navigator.userAgent) };


vnTRUST.show_loading = function (txt){
	txt = vnTRUST.is_str(txt) ? txt : 'Đang tải dữ liệu...';
	jQuery('.float_loading').remove();
	jQuery('body').append('<div class="float_loading">'+txt+'</div>');
	jQuery('.float_loading').fadeTo("fast",0.9);
	vnTRUST.update_position();
	jQuery(window).scroll(vnTRUST.updatePosition);
};

vnTRUST.update_position = function(){
	if (vnTRUST.is_ie()) {
		jQuery('.mine_float_loading').css('top', document.documentElement['scrollTop']);
	}
};

vnTRUST.hide_loading = function() {
	jQuery('.float_loading').fadeTo("slow",0,function(){jQuery(this).remove();});
};

//Working with something;
vnTRUST.util_trim = function(str) {return (/string/).test(typeof str) ? str.replace(/^\s+|\s+$/g, "") : ""};

vnTRUST.util_random = function(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a };

vnTRUST.get_ele = function(id) { return document.getElementById(id) };

vnTRUST.get_uuid = function() { return (new Date().getTime() + Math.random().toString().substring(2))};

vnTRUST.get_top_page = function() {
	if (vnTRUST.is_exists(window.pageYOffset)) {
		return window.pageYOffset;
	}
	if (vnTRUST.is_exists(document.compatMode) && document.compatMode != 'BackCompat') {
		return document.documentElement.scrollTop;
	}
	if (vnTRUST.is_exists(document.body)) {
		scrollPos = document.body.scrollTop;
	}
	return 0;
};


//halm: fade image to hide loading
vnTRUST.fadeImageLoading = function(obj, speed, width, height) {
	speed = speed ? speed : 400;
	jQuery(obj).fadeTo(speed,1,function(){
		if(width){
			jQuery(obj).parent().css({width:'auto'});
		}
		if(height){
			jQuery(obj).parent().css({height:'auto'});
		}
	});
};

// using to fix with for image;
vnTRUST.fix_width_element = function(obj, limit) {
	var width = jQuery(obj).width(),
		height = jQuery(obj).height(),
		max_width = limit || 468;
	if (width > max_width) {
		var ratio = (height / width );
		var new_width = max_width;
		var new_height = (new_width * ratio);
		jQuery(obj).height(new_height).width(new_width);
	}
};

//redirect to url
vnTRUST.redirect = function(url){window.location = url};


/* function core connect */
String.prototype.E = function() {return vnTRUST.get_ele(this)};
vnTRUST.join = function(str) {
	var store = [str];
	return function extend(other) {
		if (other != null && 'string' == typeof other ) {
			store.push(other);
			return extend;
		}
		return store.join('');
	}
};

vnTRUST.nextNumber = (function(){
	var i = 0;
	return function() {return ++i}
}());

vnTRUST.numberOnly = function(myfield, e){
	var key,keychar;
	if (window.event){key = window.event.keyCode}
	else if (e){key = e.which}
	else{return true}
	keychar = String.fromCharCode(key);
	if ((key==null) || (key==0) || (key==8) || (key==9) || (key==13) || (key==27)){return true}
	else if (("0123456789").indexOf(keychar) > -1){return true}
	return false;
};

vnTRUST.fix_png = function(id) {
	if (navigator.appVersion.match(/MSIE [0-6]\./)) {
		jQuery(id).each(function () {
			var background_image = jQuery(this).css("backgroundImage");
			if (background_image != 'none') {
				if (background_image.substring(4, 5) == '"') {
					var img_src = background_image.substring(5, background_image.length - 2)
				} else {
					var img_src = background_image.substring(4, background_image.length - 1)
				}
				jQuery(this).css({
					'backgroundColor': 'transparent',
					'backgroundImage': 'none',
					'filter': "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=crop, src='" + img_src + "')"
				})
			}
		})
	}
};


vnTRUST.goTopStart = function(){
	jQuery('body').append('<a href="javascript:void(0)" onclick="jQuery(\'html,body\').animate({scrollTop: 0},1000);" class="go_top" style="display:none"></a>');
	jQuery(window).scroll(function(){
		var top = $(window).scrollTop();
		if(top > 0){
			if (vnTRUST.is_ie6() || vnTRUST.is_ie7()) {
				top = top + jQuery(window).height() - 30;
				jQuery('.go_top').css('top', top);
			}
			jQuery('.go_top').show();
		}else{
			jQuery('.go_top').hide()
		}
	});
};


vnTRUST.timerObject = {
	obj: {},
	start: function(id, container, time){
		vnTRUST.timerObject.obj[id] = {id: id, c: container, time: time, now: TIME_NOW, clock_id: 0};
		vnTRUST.timerObject.countTime(id);
	},
	countTime:function(id){
		vnTRUST.timerObject.obj[id].now ++;
		if(vnTRUST.timerObject.displayTime(id)){
			vnTRUST.timerObject.obj[id].clock_id = setTimeout(function(){vnTRUST.timerObject.countTime(id)},1000);
		}else{
			clearTimeout(vnTRUST.timerObject.obj[id].clock_id);
		}
	},
	displayTime: function(id){
		var time = vnTRUST.timerObject.obj[id].time - vnTRUST.timerObject.obj[id].now;
		if(time > 0){
			var hour = Math.floor(time/(60*60)),
				min = Math.floor((time%(60*60))/60),
				sec = Math.floor(time - hour*60*60 - min*60),
				obj = vnTRUST.get_ele(vnTRUST.timerObject.obj[id].c);
			if(obj){
				obj.innerHTML = (hour>9?'':'0')+(hour>0?hour:0)+'h : '+(min>9?'':'0')+(min>0?min:0)+'p : '+((sec>9&&sec<60)?'':'0')+((sec>0&&sec<60)?sec:0)+'&quot;';
				return true;
			}
		}
		return false;
	}
};

vnTRUST.enter = function(id, cb){
	if(cb){
		jQuery(id).keydown(
			function(event) {
				if (event.keyCode == 13) cb();
			}
		);
	}
};

vnTRUST.numberFormat = function( number, decimals, dec_point, thousands_sep ){
	var n = number, prec = decimals;
	n = !isFinite(+n) ? 0 : +n;
	prec = !isFinite(+prec) ? 0 : Math.abs(prec);
	var sep = (typeof thousands_sep == "undefined") ? '.' : thousands_sep;
	var dec = (typeof dec_point == "undefined") ? ',' : dec_point;
	var s = (prec > 0) ? n.toFixed(prec) : Math.round(n).toFixed(prec); //fix for IE parseFloat(0.55).toFixed(0) = 0;
	var abs = Math.abs(n).toFixed(prec);
	var _, i;
	if (abs >= 1000) {
		_ = abs.split(/\D/);
		i = _[0].length % 3 || 3;
		_[0] = s.slice(0,i + (n < 0)) +
			_[0].slice(i).replace(/(\d{3})/g, sep+'$1');
		s = _.join(dec);
	} else {
		s = s.replace(',', dec);
	}
	return s;
};

vnTRUST.mixMoney = function (myfield){
	var thousands_sep = ',';
	myfield.value = vnTRUST.numberFormat(parseInt(myfield.value.replace(/,/gi, '')),0,'',thousands_sep);
};


vnTRUST.format_number  = function (num) {
	num = num.toString().replace(/\$|\,/g,'');
	if(isNaN(num))
		num = "0";
	sign = (num == (num = Math.abs(num)));
	num = Math.round(num*100+0.50000000001);
	num = Math.round(num/100).toString();
	for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
		num = num.substring(0,num.length-(4*i+3))+','+ num.substring(num.length-(4*i+3));
	return (((sign)?'':'-') + num);
}


vnTRUST.numberOnly = function (myfield, e){
	var key,keychar;
	if (window.event){key = window.event.keyCode}
	else if (e){key = e.which}
	else{return true}
	keychar = String.fromCharCode(key);
	if ((key==null) || (key==0) || (key==8) || (key==9) || (key==13) || (key==27)){return true}
	else if (("0123456789").indexOf(keychar) > -1){return true}
	return false;
};

vnTRUST.base64_encode = function(data) {

	var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
		ac = 0,
		enc = "",
		tmp_arr = [];

	if (!data) {
		return data;
	}

	do { // pack three octets into four hexets
		o1 = data.charCodeAt(i++);
		o2 = data.charCodeAt(i++);
		o3 = data.charCodeAt(i++);

		bits = o1 << 16 | o2 << 8 | o3;

		h1 = bits >> 18 & 0x3f;
		h2 = bits >> 12 & 0x3f;
		h3 = bits >> 6 & 0x3f;
		h4 = bits & 0x3f;

		// use hexets to index into b64, and append result to encoded string
		tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
	} while (i < data.length);

	enc = tmp_arr.join('');

	var r = data.length % 3;

	return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);

}

vnTRUST.base64_decode = function(data) {

	var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
		ac = 0,
		dec = "",
		tmp_arr = [];

	if (!data) {
		return data;
	}

	data += '';

	do { // unpack four hexets into three octets using index points in b64
		h1 = b64.indexOf(data.charAt(i++));
		h2 = b64.indexOf(data.charAt(i++));
		h3 = b64.indexOf(data.charAt(i++));
		h4 = b64.indexOf(data.charAt(i++));

		bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

		o1 = bits >> 16 & 0xff;
		o2 = bits >> 8 & 0xff;
		o3 = bits & 0xff;

		if (h3 == 64) {
			tmp_arr[ac++] = String.fromCharCode(o1);
		} else if (h4 == 64) {
			tmp_arr[ac++] = String.fromCharCode(o1, o2);
		} else {
			tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
		}
	} while (i < data.length);

	dec = tmp_arr.join('');

	return dec;
}

vnTRUST.selectAllText = function(obj){
	obj.focus();
	obj.select();
};

vnTRUST.echo = function(v){
	jQuery('body').append(prettyPrint(v));
};

vnTRUST.auto_scroll = function(anchor) {
	var target = jQuery(anchor);
	target = target.length && target || jQuery('[name=' + anchor.slice(1) + ']');
	if (target.length) {
		var targetOffset = target.offset().top;
		jQuery('html,body').animate({scrollTop: targetOffset},1000);
		return false;
	}
	return true;
};

vnTRUST.moveScrollTo= function (ob){
	if (ob.length) {
		var targetOffset = ob.offset().top;
		jQuery('html,body').animate({scrollTop: targetOffset},1000);
		return false;
	}
};

vnTRUST.vntTabs = function (obj) {

	$('#'+obj+' .tab-content').hide();
	$('#'+obj+' .tab-content:first').show();
	$('#'+obj+' .tab-nav li a:first').addClass('active');
	$('#'+obj+' .tab-nav li a').click(function () {
		var $string = $(this).attr("class");
		if ($string != "" && String($string) != "undefined") {
			if ($string.match(/active/gi) != "") {
				//console.log($string.match(/active/gi));
				return false;
			}
		}
		var id_content = $(this).attr("href");
		$('#'+obj+' .tab-content').hide();
		$(id_content).show();


		$('#'+obj+' .tab-nav li a').removeClass('active');
		$(this).addClass('active');
		return false;
	});
};

 

/** ZoomImage
 **************************************************************** **/
vnTRUST.ZoomImage = function() {


	$(document).ready(function(){
		var data_count = 0;
		$(".vnt_gallery_zoom img").each(function (e) {
			if(!$(this).parents().hasClass("ck_zoom_list_img")){
				if($(this).data("ck-zoom") != 'no'){
					$(this).wrap("<span class='zoom_wrap_img'></span>");
					$(this).attr("data_count",data_count);
					data_count += 1;
				}
			}
		});
		$(".ck_zoom_list_img").each(function(){
			var count = 0;
			$(this).find("img").each(function (e) {
				$(this).attr("data_count",count);
				count += 1;
			});
		});
		$(".vnt_gallery_zoom img").click(function (e) {
			if($(this).parents().hasClass("zoom_wrap_img")){
				$('body').append("<div id='vnt_zoom_screen'></div>");
				$('#vnt_zoom_screen').append("<div id='vnt_zoom_slider'></div>");
				$(".vnt_gallery_zoom .zoom_wrap_img img").each(function (e) {
					var data_src = $(this).attr('src');
					var data_desc = $(this).parent().find(".ck_desc_img").html();
					if (!data_desc){
						data_desc = $(this).attr('alt');
					}
					var data_content = '<div class="item" style="background-image: url('+ data_src +')"><img src="'+ data_src +'" />';
					if(data_desc){
						data_content += '<div class="i-content">'+data_desc+'</div>';
					}
					data_content += '</div>';
					$('#vnt_zoom_slider').append(data_content);
				});
			}else if($(this).parents().hasClass("ck_zoom_list_img")){
				$('body').append("<div id='vnt_zoom_screen'></div>");
				$('#vnt_zoom_screen').append("<div id='vnt_zoom_slider'></div>");

				$(this).parents(".ck_zoom_list_img").find( "a" ).click(function( event ) {
					event.preventDefault();
				});

				$(this).parents(".ck_zoom_list_img").find(".ck_zoom_item").each(function (e) {
					var data_src = $(this).data('img');
					if (!data_src){
						data_src = $(this).find("img").attr('src');
					}
					var data_desc = $(this).find(".ck_desc_img").html();
					if (!data_desc){
						data_desc = $(this).find("img").attr('alt');
					}
					var data_content = '<div class="item" style="background-image: url('+ data_src +')"><img src="'+ data_src +'" />';
					if(data_desc){
						data_content += '<div class="i-content">'+data_desc+'</div>';
					}
					data_content += '</div>';
					$('#vnt_zoom_slider').append(data_content);
				});
			}else{
				return false;
			}

			var vnt_zoom_title = $("#vnt_zoom_title").html() ;
			if (!vnt_zoom_title){
				vnt_zoom_title = 'Slide hình';
			}
			$('#vnt_zoom_screen').append("<div id='vnt_zoom_tool'></div>");
			var data_tool = "<div class='tool_title'>"+vnt_zoom_title+"</div>";
			data_tool += "<div class='tool_close'>Thoát</div>";
			data_tool += "<div class='tool_auto_play fa-play'>Tự động trình chiếu</div>";
			data_tool += "<div class='clear'></div>";
			$('#vnt_zoom_tool').append(data_tool);

			$('#vnt_zoom_slider').slick({
				slidesToShow: 1,
				slidesToScroll: 1,
				arrows: true,
				dots: false,
				autoplay: false,
				fade: true,
				autoplaySpeed: 2500,
				speed: 800
			});
			$("#vnt_zoom_tool .tool_auto_play").click(function (e) {
				if(!$(this).hasClass("pause")){
					$(this).addClass("pause").removeClass("fa-play").addClass("fa-pause");
					$('#vnt_zoom_slider').slick('slickPlay');
				}else{
					$(this).removeClass("pause").addClass("fa-play").removeClass("fa-pause");
					$('#vnt_zoom_slider').slick('slickPause');
				}
			});
			$("#vnt_zoom_tool .tool_close,#vnt_zoom_tool .tool_title").click(function(e){
				$("#vnt_zoom_screen").removeClass("active");
				$("#vnt_zoom_tool .tool_auto_play").removeClass("pause").addClass("fa-play").removeClass("fa-pause");
				$('#vnt_zoom_slider').slick('slickPause');
				$("#vnt_zoom_screen").remove();
			});

			var i_data_count = $(this).attr("data_count");
			$('#vnt_zoom_slider').slick('slickGoTo', i_data_count);
			$("#vnt_zoom_screen").addClass("active");
		});
	});


};
