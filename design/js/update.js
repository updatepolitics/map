window.onload = function (){

	var i, a, b, c, d, itm1, itm2, itm3;

	var dbody = document.body,
		page_y,
		wn,
		win_w,
		win_h,
		bt_event,
		lg,
		mobile,
		delay,
		cur_layout,
		cur_target,
		div,
		li,
		span;

	var dur = 350, // animation
	 	dur2 = 550, // layout
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
		dom:[0, 8]
	}

	var scale_hub = d3.scale.linear().domain(colors.dom).range(colors.hub).interpolate(d3.interpolateHcl);
	var scale_sig = d3.scale.linear().domain(colors.dom).range(colors.sig).interpolate(d3.interpolateHcl);


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
	reg('legends');
	reg('legend_sig_title');
	reg('legend_hub_title');
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
	reg('control_score_pos');
	reg('score');
	reg('score_nb');
	reg('score_lb');
	reg('ico_map');
	reg('ico_list');
	reg('search');
	reg('search_str');
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
		$(menu).animate({left:0}, dur, _out);
		$(container).animate({left:$(menu).width()/5, opacity:.3}, dur, _out);
	}

	function close_menu(){
		menu.open = true;
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
		lg = _lg;
		// update text
	}

	for( i in lgs ){
		li = document.createElement('li');
		li.lg = lgs[i].lg;
		$(li).html(lgs[i].lb);
		$(li).addClass("lang");
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
		$(filters).css({height:win_h - 80});
		$(list).css({height:win_h - 160});

		if(cur_layout == 'home') $(control).css({top:win_h});
		if(cur_layout == 'map') $(control).css({top:win_h - 80});
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
				if(filters.open){
					close_filters();
					delay = dur;
				} else {
					delay = 0;
				}
				setTimeout( function(){
					$(home).delay(dur2/3).fadeIn(dur2/3);
					$(update_logo).animate({top:-32}, dur2, in_out);
					$(control).animate({top:'100%'}, dur2, in_out);
					$(control_score).css({backgroundImage:'url(layout/up.png)', backgroundPosition:'top'});
					$(ico_map).addClass('selected');
					$(ico_list).removeClass('selected');
					$(control_score_pos).text('LISTA');
					$(legends).animate({left:-400}, dur2, in_out);
					$(zoom).animate({right:-50}, dur2, in_out);
					$(map).animate({backgroundSize:'100%', opacity:.2}, dur2, in_out);
					$(list).animate({ top:'100%' }, dur2, in_out);
				}, delay);
			break;
			case 'map':
				if(filters.open){
					close_filters();
					delay = dur;
				} else {
					delay = 0;
				}
				setTimeout( function(){
					$(filters).css({top:0, height:win_h - 80});
					$(home).delay(dur2/3).fadeOut(dur2/3);
					$(update_logo).animate({top:32}, dur2, in_out);
					$(legends).animate({left:30}, dur2, in_out);
					$(zoom).animate({right:25}, dur2, in_out);
					$(map).animate({backgroundSize:'45%', opacity:1}, dur2, in_out);
					$(control).animate({top:win_h-80}, dur2, in_out);
					$(filters).css({top:0, height:win_h - 80});
					$(list).animate({ top:'100%' }, dur2, in_out);
					setTimeout( function(){
						$(control_score).css({backgroundImage:'url(layout/up.png)', backgroundPosition:'top'});
						$(ico_map).addClass('selected');
						$(ico_list).removeClass('selected');
						$(control_score_pos).text('LISTA');
					}, dur2/2);
					$(flap_hub).fadeOut(dur2/2, function(){ $(flap_hub).css({ bottom:'inherit', top:0 })});
					$(flap_sig).fadeOut(dur2/2, function(){ $(flap_sig).css({ bottom:'inherit', top:0 })});
					if(cur_target == 'hub') $(flap_hub).fadeIn(dur2/2);
					if(cur_target == 'sig') $(flap_sig).fadeIn(dur2/2);
				}, delay);
			break;
			case 'list':
				if(filters.open){
					close_filters();
					delay = dur;
				} else {
					delay = 0;
				}
				setTimeout( function(){
					$(filters).css({top:160, height:win_h - 160})
					$(control).animate({top:80}, dur2, in_out);
					$(filters).css({top:160, height:win_h - 160})
					$(list).animate({ top:160 }, dur2, in_out);
					setTimeout( function(){
						$(control_score).css({backgroundImage:'url(layout/down.png)', backgroundPosition:'bottom'});
						$(ico_map).removeClass('selected');
						$(ico_list).addClass('selected');
						$(control_score_pos).text('MAPA');
					}, dur2/2);
					$(map).animate({ opacity:0}, dur2, in_out);
					$(flap_hub).fadeOut(dur2/2, function(){ $(flap_hub).css({ bottom:0, top:'inherit' }) });
					$(flap_sig).fadeOut(dur2/2, function(){ $(flap_sig).css({ bottom:0, top:'inherit' }) });
					if(cur_target == 'hub') $(flap_hub).fadeIn(dur2/2);
					if(cur_target == 'sig') $(flap_sig).fadeIn(dur2/2);
				}, delay);
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
		console.log('target: ' + tg);
		cur_target = tg;
		switch(tg){
			case "hub":
				$(control_hub).addClass('selected');
				$(control_sig).removeClass('selected');
				$(list_hub).fadeIn(dur, in_out);
				$(list_sig).hide();
				$(control_hub_lb).animate({opacity:1}, dur, in_out);
				$(control_sig_lb).animate({opacity:.2}, dur, in_out);
				$(legend_hub).animate({left:0}, dur, in_out);
				$(legend_sig).animate({left:-300}, dur, in_out);
				$(flap_hub).fadeIn(dur/2, in_out);
				$(flap_sig).fadeOut(dur/2, in_out);
			break;
			case "sig":
				$(control_sig).addClass('selected');
				$(control_hub).removeClass('selected');
				$(list_sig).fadeIn(dur, in_out);
				$(list_hub).hide();
				$(control_hub_lb).animate({opacity:.2}, dur, in_out);
				$(control_sig_lb).animate({opacity:1}, dur, in_out);
				$(legend_hub).animate({left:-300}, dur, in_out);
				$(legend_sig).animate({left:0}, dur, in_out);
				$(flap_sig).fadeIn(dur, in_out);
				$(flap_hub).fadeOut(dur, in_out);
			break;
		}
		$(map).fadeOut(dur, function(){ $(map).css({ backgroundImage:'url(layout/bg_map_'+ tg +'.png)' }).fadeIn(dur); })
	}

	$(control_hub).on(bt_event, function(){
		if( cur_target != 'hub') set_target('hub');
	});

	$(control_sig).on(bt_event, function(){
		if( cur_target != 'sig') set_target('sig');
	});

	// filters

	filters.open = false;

	function open_filters() {
		filters.open = true;
		$(filters).animate({right:0}, dur, in_out);
		$(control_filters).css({backgroundImage:'url(layout/minus.png)'});
	}

	function close_filters() {
		filters.open = false;
		$(filters).animate({right:'-34%'}, dur, in_out);
		$(control_filters).css({backgroundImage:'url(layout/plus.png)'});
	}

	$(control_filters).on( bt_event, function(){
		if(filters.open){
			close_filters();
		}else{
			open_filters();
		}
	})

	// search

	$(search_str).on('click', function(event){
		 event.stopPropagation();
	})



	//////////////////////////////// LIST ////////////////////////////////

	$(control_score).on(bt_event, function () {
		if(cur_layout == 'map') set_layout('list');
		else set_layout('map');
	})

	//////////////////////////////// INIT ////////////////////////////////

	// sig legend

	for( i in json.metodos ){
		d = json.metodos[i];
		if(i == 0){
			$(legend_sig_title).html( d[lg] );
		}else{
			li = document.createElement('li');
			$(li)
				.addClass('legend')
			$(legend_sig).append($(li));

			div = document.createElement('div');
			$(div)
				.addClass('color')
				.css({background:scale_sig(i)})
			$(li).append($(div));

			div = document.createElement('div');
			$(div)
				.addClass('lb')
				.html( d[lg][0] )
			$(li).append($(div));

		}
	}

	// hub legend

	for( i in json.natureza ){
		d = json.natureza[i];
		if(i == 0){
			$(legend_hub_title).html( d[lg] );
		}else{
			li = document.createElement('li');
			$(li)
				.addClass('legend')
			$(legend_hub).append($(li));

			div = document.createElement('div');
			$(div)
				.addClass('color')
				.css({background:scale_hub(i)})
			$(li).append($(div));

			div = document.createElement('div');
			$(div)
				.addClass('lb')
				.html( d[lg] )
			$(li).append($(div));

		}
	}

	// aqui!!!!
	// - fazer as escalas hub e sig com os DOM (color) respectivos
	// - fazer escalas posicionadas no centro vertical
	// - inclusão de porcentagens na legenda

	// initial target: signals

	set_target('sig');

} // window load

var json = {
	"metodos":[
		{"_pt":"métodos"},
		{"_pt":[ "Mecanismos de diálogo",
			"consulta popular",
			"assembléia",
			"diálogo social",
			"debate público",
			"Mediação/Facilitação",
			"Circulo de Cidadania"]
		},
		{"_pt":[ "Pressão Popular",
			"cidadania digital",
			"ação cívica",
			"ativismo digital",
			"campanha",
			"manifestações",
			"mobilização"]
		},
		{"_pt":[ "Artvismo/Revolução Estética",
			"Culture Jaming",
			"Intervenções",
			"Choque Estético",
			"Humor/Comédia",
			"Atividades Culturais"]
		},
		{"_pt":[ "Pedagogia Política",
			"Oficina",
			"Formação",
			"Pedagogia Política",
			"Jogo"]
		},
		{"_pt":[ "Open Knowledge",
			"Data viz",
			"Análise de dados",
			"Index/Indicadores",
			"Pesquisa",
			"Georreferenciamento",
			"Conhecimento Colaborativo",
			"Wiki",
			"Pesquisa colaborativa e participativa",
			"Decodificação"]
		},
		{"_pt":[ "Open Data",
			"Banco de dados",
			"Repositório",
			"Big Data"]
		},
		{"_pt":[ "Controle Social",
			"Denúncia",
			"Investigação",
			"Monitoramento",
			"Infoativismo",
			"Relatório",
			"Cobertura Colaborativa",
			"Ação Judicial de interesse público"]
		},
		{"_pt":[ "Parlamento Aberto",
			"Legislação participativa",
			"Mandato interativo "]
		},
		{"_pt":[ "Executivo Aberto",
			"Resident Feedback",
			"Governo Eletrônico",
			"Mandato interativo"]
		}
	],
	"natureza":[
		{"_pt":"natureza"},
		{"_pt":"pessoas"},
		{"_pt":"institutos/fundações"},
		{"_pt":"Empresas"},
		{"_pt":"partidos"},
		{"_pt":"ONGs"},
		{"_pt":"Orgãos Não governamentais"},
		{"_pt":"Organismo Multilateral/internacional"},
		{"_pt":"Coletivos"},
		{"_pt":"Movimentos"},
		{"_pt":"Rede (p2p)"},
		{"_pt":"Aliança (1+1)"},
		{"_pt":"Parcerias (1+2)"}
	],
	"proposito":[
		{"_pt":"propósito"},
		{"_pt":"Empoderamento"},
		{"_pt":"Incidência"}
	],
	"abrangencia":[
		{"_pt":"abrangência"},
		{"_pt":"Local"},
		{"_pt":"Nacional"},
		{"_pt":"Regional"},
		{"_pt":"Internacional"}
	],
	"tipo":[
		{"_pt": "tipo"},
		{"_pt":[ "Tecnologias Sociais",
			"wiki",
			"campanha",
			"ocupação",
			"jogo",
			"encontro",
			"laboratório"]
		},
		{"_pt":[ "Tecnologia Digital",
			"aplicativo",
			"plataforma",
			"plugin",
			"site",
			"blog"]
		},
		{"_pt":[ "Evento",
			"colóquio",
			"seminário",
			"forum",
			"hackton"]
		},
		{"_pt":[ "Publicações/Estudos",
			"pesquisas",
			"livros",
			"artigos",
			"estudos"]
		},
		{"_pt":[ "Prêmios/Concursos",
			"editais",
			"prêmios",
			"concursos"]
		}
	]
}
