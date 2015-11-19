window.onload = function (){

	var i, a, b, c, itm1, itm2, itm3;

	var dbody = document.body,
		page_y,
		wn,
		win_w,
		win_h,
		bt_event,
		lg,
		mobile,
		cur_layout,
		div,
		li,
		span;

	var dur = 350, // animation
	 	dur2 = 600, // layout
		in_out = "easeInOutQuart",
		_out = "easeOutQuart",
		in_ = "easeInQuart";

	var root = location.origin;
	var path = location.pathname.split('/');

	for(i=0; i<path.length-1; i++){
		root += path[i] + '/';
	}

	console.log( "ROOT: " + root );

	var colors = {
		bg1:'#212733', // map bg
		bg2:'#2d3340', // bt bg
		bg3:'#262c38', // bt hover
		blue:'#6cadd9',
		wt:'#fff',
		hub:['#d87d7d','#adcc8f'],
		sig:['#adcc8f','#9e8fcc'],
		dom:[0, 13]
	}

	var scale_hub = d3.scale.linear().domain(colors.dom).range(colors.hub).interpolate(d3.interpolateHcl);
	var scale_sig = d3.scale.linear().domain(colors.dom).range(colors.sig).interpolate(d3.interpolateHcl);

	console.log(">>>> " + scale_hub(5));

	//////////////////////////////// OBJECTS ////////////////////////////////

	function get(id){ return document.getElementById(id)};
	function reg(id){ window[id] = get(id) }

	reg('menu');
	reg('menu_bt');
	reg('menu_close');
	reg('email');
	reg('twitter');
	reg('github');
	reg('fbook');

	reg('container');

	reg('home');
	reg('intro');
	reg('explore');
	reg('credit_who');
	reg('credit_what');

	reg('header');
	reg('language');
	reg('update_logo');

	reg('map');
	reg('legend');
	reg('legend_title');
	reg('zoom');
	reg('zoom_in');
	reg('zoom_out');

	reg('control');
	reg('help');
	reg('map_help');

	reg('control_left');
	reg('control_hub_lb');
	reg('control_sig');
	reg('control_sig_lb');

	reg('control_center');
	reg('score');
	reg('score_nb');
	reg('score_lb');
	reg('map_bt');
	reg('list_bt');
	reg('search');
	reg('search_input');
	reg('search_x');

	reg('control_right');
	reg('control_filters');
	reg('filters');
	reg('filters_lb');
	reg('filters_nb');
	reg('trash');

	//////////////////////////////// MOBILE ////////////////////////////////

	var isMobile = {
		Android: function() {
			return navigator.userAgent.match(/Android/i);
		},
		BlackBerry: function() {
			return navigator.userAgent.match(/BlackBerry/i);
		},
		iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
		Opera: function() {
			return navigator.userAgent.match(/Opera Mini/i);
		},
		Windows: function() {
			return navigator.userAgent.match(/IEMobile/i);
		},
		any: function() {
			return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		}
	};

	if( isMobile.any() ){
		mobile = true;
		$(dbody).addClass('mobile');
		bt_event = 'touchstart';
	}else{
	    mobile = false;
		bt_event = 'click';
	}

	console.log( "MOBILE: " + mobile );

	//////////////////////////////// HEADER ////////////////////////////////

	menu.open = false;

	$(menu_bt).on( bt_event, function (){
		open_menu();
	});

	$(menu_close).on( bt_event, function (){
		close_menu();
	});

	if(!mobile){
		$(menu).on('mouseleave', function (){
			close_menu();
		});
	}

	function open_menu(){
		menu.open = true;
		$(menu_bt).fadeOut(dur/2);
		$(menu).animate({left:0}, dur, _out);
		$(container).animate({left:$(menu).width()/5, opacity:.3}, dur, _out);
	}

	function close_menu(){
		menu.open = true;
		$(menu_bt).fadeIn(dur/2);
		$(menu).animate({left:-1*$(menu).width()}, dur, _out);
		$(container).animate({left:0, opacity:1}, dur, _out);
	}

	// LOGO

	$(update_logo).on(bt_event, function(){
		set_layout('home');
	});

	// LG

	var lgs = [
		{lg:"_pt", lb:"PT"},
		{lg:"_es", lb:"ES"},
		{lg:"_en", lb:"EN"}
	];

	function set_lg(_lg){
		for( i in lgs ){
			if( lgs[i].lg != _lg ) $(lgs[i].li).removeClass('selected');
			else $(lgs[i].li).addClass('selected');
		}
		sessionStorage.setItem('lg', _lg);
		console.log('set_lg: ' + sessionStorage.getItem('lg'));
		// update text
	}

	for( i in lgs ){
		li = document.createElement('li');
		li.lg = lgs[i].lg;
		li.innerHTML = lgs[i].lb;
		li.className = "lang";
		lgs[i].li = li;
		language.appendChild(li);
		$(li).on(bt_event, function(){
			set_lg(this.lg);
		});
		if( i < lgs.length-1){
			li = document.createElement('li');
			li.className = "lg_sep";
			language.appendChild(li);
		}
	}

	if( !sessionStorage.getItem('lg')) set_lg('_pt'); // defaut lang
	else  set_lg(sessionStorage.getItem('lg'));

	//////////////////////////////// WINDOW ////////////////////////////////

	function resize(){
		win_w = $( window ).width();
		win_h = $( window ).height();
		if(mobile){
			if(win_w < win_h) $(dbody).addClass('port');
			else $(dbody).addClass('land');
		}
		if(filters.open) $(filters).css({height:win_h - 80, top:-win_h + 80});
		else $(filters).css({height:win_h - 80, top:0 });
	}

	window.onresize = resize;
	resize();

	//////////////////////////////// LAYOUTS ////////////////////////////////

	cur_layout = 'home';
	$(map).css({backgroundSize:'100%', opacity:.2});

	function set_layout(lay){
		cur_layout = lay;

		switch(lay){

			case 'home':
				$(home).delay(dur2/3).fadeIn(dur2/3);
				$(update_logo).animate({top:-28}, dur2, in_out);
				$(control).animate({bottom:-80}, dur2, in_out);
				$(legend).animate({left:-400}, dur2, in_out);
				$(zoom).animate({right:-50}, dur2, in_out);
				$(map).animate({backgroundSize:'100%', opacity:.2}, dur2, in_out);
			break;

			case 'map':
				$(home).delay(dur2/3).fadeOut(dur2/3);
				$(update_logo).animate({top:28}, dur2, in_out);
				$(control).animate({bottom:0}, dur2, in_out);
				$(legend).animate({left:30}, dur2, in_out);
				$(zoom).animate({right:25}, dur2, in_out);
				$(map).animate({backgroundSize:'45%', opacity:1}, dur2, in_out);
			break;

			case 'list':

			break;
		}
	}

	//////////////////////////////// HOME ////////////////////////////////

	$(intro).on(bt_event, function(){
		console.log('INTRO!');
	})

	$(explore).on(bt_event, function(){
		set_layout('map');
	})


	//////////////////////////////// MAP ////////////////////////////////

	// legend

	// zoom

	// target

	function set_target(tg){
		console.log(tg);
		switch(tg){
			case "hub":
				$(control_hub).animate({backgroundColor:colors.bg3, opacity:1}, dur/2, _out);
				$(flap_hub).animate({height:4}, dur/2, _out);
				$(control_sig).animate({backgroundColor:colors.bg2, opacity:.3}, dur/2, _out);
				$(flap_sig).animate({height:0}, dur/2, _out);
			break;
			case "sig":
				$(control_sig).animate({backgroundColor:colors.bg3, opacity:1}, dur/2, _out);
				$(flap_sig).animate({height:4}, dur/2, _out);
				$(control_hub).animate({backgroundColor:colors.bg2, opacity:.3}, dur/2, _out);
				$(flap_hub).animate({height:0}, dur/2, _out);
			break;
		}
		$(map).fadeOut(dur, function(){ $(map).css({ backgroundImage:'url(layout/bg_map_'+ tg +'.png)' }).fadeIn(dur); })
	}

	$(control_hub).on(bt_event, function(){
		set_target('hub');
	});

	$(control_sig).on(bt_event, function(){
		set_target('sig');
	});

	// filters

	filters.open = false;

	function open_filters() {
		filters.open = true;
		$(filters).animate({top:-win_h + 80}, dur, in_out);
		$(control_filters).css({backgroundImage:'url(layout/minus.png)'});
	}

	function close_filters() {
		filters.open = false;
		$(filters).animate({top:0}, dur, in_out);
		$(control_filters).css({backgroundImage:'url(layout/plus.png)'});
	}

	$(control_filters).on( bt_event, function(){
		if(filters.open){
			close_filters();
		}else{
			open_filters();
		}
	})


	//////////////////////////////// LIST ////////////////////////////////


	//////////////////////////////// INIT ////////////////////////////////

	set_target('sig')


}


var json = {

	"initiatives":{
		"hubs":0
	}

}
