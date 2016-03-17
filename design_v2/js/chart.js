
var json,
	node,
	cur_filters,
	n_hubs = 0,
	n_signals = 0,
	scale;

var scale_kind,
	scale_method;

var cur_scale = 1;

var zoom_limits = [ 0.1, 5 ];
var zoom_factor = 1.5;

var zoom_r = 25;
var filter_h = 25;

var hub_filters = [];
var sig_filters = [];
var strict = {
		'method':[],
		'kind':[]
	};

check_code();


// map vars

var svg_map_area;
var svg_map;

var svg_nodes;
var svg_force;
var svg_circles;


//////////////////////////////// OBJECTS ////////////////////////////////


reg('container');

reg('popup');
reg('popup_x');
reg('popup_content');

reg('map_container');
reg('tooltip');
reg('tt_title');
reg('tt_val');
reg('map');
reg('legends');
reg('legends_x');
reg('legend_bts');
reg('legend_sig');
reg('legend_hub');
reg('legend_sig_title');
reg('legend_hub_title');
reg('legend_sig_bt');
reg('legend_hub_bt');
reg('zoom_control');
reg('zoom_in');
reg('zoom_out');

reg('control');
reg('help_bt');
reg('help');
reg('help_x');
reg('help_next');
reg('help_prev');
reg('help_nav_pos');
reg('help_title');
reg('help_text');
reg('help_frame');
reg('circles');
reg('circles_out');
reg('circles_in');

reg('control_center');

reg('control_hub');
reg('control_hub_lb');

reg('control_sig');
reg('control_sig_lb');

reg('mode_lb_num');
reg('mode_lb_tx');

reg('control_filters');
reg('filters');
reg('filters_list');
reg('filters_x');
reg('trash');
reg('filters_lb');
reg('filters_counter');

reg('mode_list');

reg('need_help');
reg('need_help_lb');
reg('need_help_x');


//////////////////////////////// control ////////////////////////////////

$(mode).on(bt_event, function(){
	navigate("list.html", false);
});

$(control_hub).on(bt_event, function(){
	set_code("hub");
	navigate("chart.html", false);
});

$(control_sig).on(bt_event, function(){
	set_code("sig");
	navigate("chart.html", false);
});


filters.open = false;

function open_filters() {
	filters.open = true;
	if(mobile) $(filters).animate({right:'5%'}, dur, _out);
	else $(filters).animate({right:20}, dur, _out);
}

function close_filters() {
	filters.open = false;
	if(mobile) $(filters).animate({right:'-100%'}, dur, in_);
	else $(filters).animate({right:-350}, dur, in_);
}
$(filters).css({right:'-100%'});


$(control_filters).on( bt_event, function(){
	if(filters.open){
		close_filters();
	}else{
		open_filters();
	}
});

function sep(tx){
	div = document.createElement('div');
	$(div)
		.attr('id','filters_sep')
		.html(tx);
	filters_list.appendChild(div);
}


////////////////////////////////  zoom  ////////////////////////////////

$(zoom_out).on(bt_event, function(){
	if(cur_scale > zoom_limits[0]){
		cur_scale = cur_scale/zoom_factor;
		svg_map.transition().duration(dur2).ease('exp-out').attr('transform', 'translate(1000 1000) scale('+ cur_scale +')');
	}
});

$(zoom_in).on(bt_event, function(){
	if(cur_scale < zoom_limits[1]){
		cur_scale *= zoom_factor;
		svg_map.transition().duration(dur2).ease('exp-out').attr('transform', 'translate(1000 1000) scale('+ cur_scale +')');
	}
});


//////////////////////////////// popup ////////////////////////////////

$(document).keyup(function(e) {
    if (e.keyCode == 27) {
    if(popup.open) close_popup();
		if(help.open) close_help();
  }
});

popup.open = false;

function open_popup (d){

	if(filters.open) close_filters();

	popup.open = true;
	$(popup_content).html('');

	$(popup).css({color:'#fff', backgroundColor:d.fill});
	if(!mobile) $(popup).css({ maxHeight: '50%' });
	$(popup_x).css({ backgroundImage: 'url(layout/x.png)' });

	div = document.createElement('div');
		$(div)
			.addClass('title')
			.html(d.node.label);
		$(popup_content).append(div);

		div = document.createElement('div');
		$(div)
			.addClass('about')
			.html( d.node.about )
		popup_content.appendChild(div);

	$(popup).fadeIn(dur,_out);
	$(curtain).fadeIn( dur, _out);

}


function close_popup(){
	popup.open = false;
	$(popup).fadeOut( dur,_out );
	$(curtain).fadeOut( dur, _out);
}

$(popup_x).on(bt_event, function(){
	close_popup();
});


//////////////////////////////// HELP ////////////////////////////////

var help_itens = [ control_hub, control_sig, control_filters, mode ];

help_itens.pos = 0;

function clone(trg){
	return {
		width: $(trg).width(),
		height: $(trg).height(),
		left: $(trg).offset().left
	}
}

function help_pos(pos){
	help_itens.pos = pos;
	var cln = clone( help_itens[pos] );
	$(help_frame)
		.css({
			width: cln.width,
			height: cln.height,
			left: cln.left,
			bottom: 0
		});
	$(help_title).html(json.help_text[pos].title);
	$(help_text).html(json.help_text[pos].text);
	$(help_nav_pos).html( (help_itens.pos+1) + ' / ' + help_itens.length);

	if (pos == 0) $(help_prev).css({opacity: 0.2, cursor:'default'});
	else $(help_prev).css({opacity: 1, cursor:'pointer'});

	if (pos == help_itens.length-1) $(help_next).css({opacity: 0.2, cursor:'default'});
	else  $(help_next).css({opacity: 1, cursor:'pointer'});

}

function close_help(){
	$(help).fadeOut(dur/2);
	help.open = false;
}

$(help_x).on(bt_event, close_help);

$(help_next).on(bt_event,function(){
	if(help_itens.pos < help_itens.length-1) help_pos(help_itens.pos + 1)
})

$(help_prev).on(bt_event,function(){
	if(help_itens.pos > 0) help_pos(help_itens.pos - 1)
})

$(help_bt).on(bt_event, function(){
	help_pos(0);
	$(help).fadeIn(dur/2);
	help.open = true;
	close_need_help();
});



//////////////////////////////// FILTERS ////////////////////////////////

filters.score = 0;

function reset_filters_score(clear){
	filters.score = 0;
	$(filters_counter).css({opacity:0.2}).html(0);
	for( i in json.filters ){
		json.filters[i].active = [];
		$(json.filters[i].nb).css({opacity:0.2}).html(0);
		if(clear){
			for(b in json.filters[i].itens){
				json.filters[i].itens[b].on = false;
			}
			strict.method = [];
			strict.kind = [];
		}
	}
	if(clear){
		cur_filters = [];
		sessionStorage.setItem ('cur_filters', null);
	}
}

function check_filters() {
	reset_filters_score(false);
	for ( i in json.filters ) {
		var all_off = true;
		for( a in json.filters[i].itens ) {
			if( json.filters[i].itens[a].on ) {
				all_off = false;
				filters.score ++;
				json.filters[i].active.push(json.filters[i].itens[a].id);
				$(json.filters[i].itens[a].li).addClass('selected');
			}else{
				$(json.filters[i].itens[a].li).removeClass('selected');
			}
		}
		// all filters off = no filter = all on
		for( a in json.filters[i].itens ){
			if(all_off)	$(json.filters[i].itens[a].li).css({ opacity:1 });
			else $(json.filters[i].itens[a].li).css({  opacity:'' });
		}
		if(filters.score > 0){
			$(filters_counter).css({opacity:1}).html( filters.score );
		}
		if(json.filters[i].active.length > 0){
			$(json.filters[i].nb).css({opacity:1}).html( json.filters[i].active.length );
		}
	}

	check_trash();

	// hubs list
	n_hubs = update_list( json.hubs, 'hub' );

	// signals list
	n_signals = update_list( json.signals, 'sig' );

	if( cur_code == 'hub' ){
		$(mode_lb_num).html( n_hubs  );
		$(mode_lb_tx).html( check_num( n_hubs, 'hub' ) );
	}

	if( cur_code == 'sig' ){
		$(mode_lb_num).html( n_signals );
		$(mode_lb_tx).html( check_num( n_hubs, 'sig' ) );
	}

}

function check_trash(){
	if(filters.score > 0) {
		$(trash).html(json.labels.remove_filters[lg].toUpperCase()).removeClass('empty');
	} else {
		$(trash).html(json.labels.no_filter[lg].toUpperCase()).addClass('empty');
	}
}


$(filters_x).on(bt_event, function(){
	close_filters();
});

$(trash).on(bt_event, function(){
	reset_filters_score(true);
	check_filters();
});

function update_list(data, cod){
	var n = data.length;
	for(a in data){
		d = data[a];
		if(d.li) $(d.li).show();
		d.visible = true;
		for( i in json.filters ){
			if( d[i] &&	d.visible && json.filters[i].active.length > 0 ){
				var found = false;
				if(i != 'method' && i != 'kind'){
					if(	json.filters[i].active.indexOf( d[i] )  >= 0 ){
						found = true;
					}
				}else{
					for( b in d[i]){
						if( json.filters[i].active.indexOf( d[i][b] ) >= 0 ) {
							found = true;
						}
					}
				}
				if(	!found ){
					d.visible = false;
					n --;
					if(d.li) $(d.li).hide();
				}
			}
		}
	}
	set_all_circles(dur);
	return n;
}

function reset_open_filters(ignore){
	for( i in json.filters ){
		if(json.filters[i].open && json.filters[i] != ignore ) toggle_list(json.filters[i]);
	}
}

function toggle_list(trg){
	if(trg.open){
		trg.open = false;
		$(trg.list).animate({height: 0 }, dur, in_out);
		$(trg.title).css({ backgroundImage: 'url(layout/plus_white.png)'});
	}else{
		trg.open = true;
		$(trg.title).css({ backgroundImage: 'url(layout/minus_white.png)'});
		$(trg.list).animate({height: 30 + trg.itens.length * filter_h}, dur, in_out);
	}
}

function toggle_filter(trg){
	if(trg.on){
		trg.on = false;
		if( trg.group && strict[trg.group].indexOf(trg.id) >= 0 ){
			strict[trg.group].splice( strict[trg.group].indexOf(trg.id),1);
		}
		store_filter(trg.id, false);
	}else{
		trg.on = true;
		if( trg.group && strict[trg.group].indexOf(trg.id) < 0 ){
			strict[trg.group].push(trg.id);
		}
		store_filter(trg.id, true);
	}
	check_filters();
}

function store_filter(filter, push){
	if(push){
		cur_filters.push(filter.toString());
	}else{
		cur_filters.splice(cur_filters.indexOf(filter.toString()),1);
	}
	sessionStorage.setItem ('cur_filters', cur_filters.join(','));
}

function create_filters( data, target, group ){

	var title;

	title = document.createElement('div');
	$(title)
		.addClass('filter_title')
		.html(data.label);
	filters_list.appendChild(title);

	span = document.createElement('span');
	$(span)
		.html(0)
		.addClass('counter');
	title.appendChild(span);

	ul = document.createElement('ul');
	$(ul)
		.addClass('group')
		.height(0);
	filters_list.appendChild(ul);

	$(title).on('click', function(){
		reset_open_filters(this.data);
		toggle_list(this.data);
	});

	if(target){
		target.push(title);
		target.push(ul);
	}

	title.data = data;
	data.title = title;
	data.list = ul;
	data.nb = span;
	data.open = false;
	data.score = 0;
	data.active = [];

	for( i in data.itens ){

		d = data.itens[i];

		li = document.createElement('li');

		$(li)
			.addClass('filter')
			.css({opacity:1})
			.html( d.label )
		ul.appendChild(li);

		$(li).on('click', function(){
			toggle_filter(this.data);
		});

		d.li = li;
		d.group = group;
		li.data = d;

		// compare to stored filters
		if(cur_filters.indexOf(d.id.toString()) >= 0) li.data.on = true;
		else li.data.on = false;

	}
}

function arr_search( arr, id ){
	for( var i in arr ){
		if( arr[i].id && arr[i].id == id ) return arr[i];
	}
}


// tooltip

function tt(title, val, color){
	if(title){
		$(tt_title).html(title);
		$(tt_val).html(val);
		$(tooltip).css({background:color}).show();
	}else{
		$(tooltip).hide();
	}
}

if(!mobile){
	$(window).mousemove(function( event ){
	    mouse_x = event.clientX - $(tooltip).width()/2 - 30;
	    mouse_y = event.clientY - 60;
	    $(tooltip).css({ left:mouse_x, top:mouse_y });
	});
}else{
	$(tooltip).remove();
}


//////////////////////////////// funcions ////////////////////////////////


function check_num(n, code){
	if(n==1) return json.labels[code][lg].toUpperCase();
	else return json.labels[code + 's'][lg].toUpperCase();
}

function resize_explore(){

	console.log("resize");

		if(mobile){
			filter_h = 20;
		}else{
			filter_h = 25;
		}

		$(popup_content).height($(popup).height() - 50);
		$(map_container).height(win_h - bar_h);
		$(filters).height(win_h - bar_h - 40);
		$(filters_list).height(win_h - bar_h - 97);

}


//////////////////////////////// circles ////////////////////////////////

function calc_radius(area){
	return scale * Math.sqrt(area / Math.PI);
}

function tick(e) {
	svg_circles.each(gravity(0.07 * e.alpha))
	.each(collide(0.05))
	.attr('transform', function (d) {
		return 'translate(' + d.x + ' ' + d.y + ')';
	});
}

function gravity(alpha) {
	return function (d) {
		d.y += (d.cy - d.y) * alpha;
		d.x += (d.cx - d.x) * alpha;
	};
}

function collide(alpha) {
	var quadtree = d3.geom.quadtree(svg_nodes);
	return function (d) {
		var r = d.radius,
		nx1 = d.x - r,
		nx2 = d.x + r,
		ny1 = d.y - r,
		ny2 = d.y + r;
		quadtree.visit(function (quad, x1, y1, x2, y2) {
			if (quad.point && (quad.point !== d)) {
				var x = d.x - quad.point.x,
				y = d.y - quad.point.y,
				l = Math.sqrt(x * x + y * y),
				r = d.radius + quad.point.radius + (d.color !== quad.point.color);
				if (l < r) {
					l = (l - r) / l * alpha;
					d.x -= x *= l;
					d.y -= y *= l;
					quad.point.x += x;
					quad.point.y += y;
				}
			}
			return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
		});
	};
}

function create_map(trg){

	var list;
	var nodes;
	var color;
	var group;

	if(trg == 'hub'){
		nodes = json.filters.kind.itens;
		list = json.hubs;
		group = "kind";
		trg_total = json.hubs.length;
	}

	if(trg == 'sig'){
		nodes = json.filters.method.itens;
		list = json.signals;
		group = "method";
		trg_total = json.signals.length;
	}

	svg_map.selectAll("*").remove();

	svg_nodes = nodes.map(function (d,i) {
		return {
			node:d,
			id:d.id,
			fill: d.hex,
			// pc: d.pc,
			partial:0,
			total:0,
			cx: 0,
			cy: 0,
		};
	});

	svg_force = d3.layout.force()
		.nodes(svg_nodes)
		.on('tick', tick)
		.gravity(0)
		.charge(1)
		.friction(0.85)

	// circles

	svg_circles = svg_map.selectAll('g')
	.data(svg_nodes)
	.enter()
	.append('g')
	.attr('style', 'cursor:pointer')
	.on('click', function(d){
		open_popup(d);
	})
	.on('mouseover', function(d){
		var val = d.partial +  '/' + d.trg_total + ' ' + check_num(d.partial, cur_code) + ' (' + d.pc_val + '%)';
		if(!mobile) tt(d.node.label, val, d.fill);
	})
	.on('mouseout', function(d){
		if(!mobile) tt(false);
	})
	//.call(svg_force.drag)
	.each(function (d, i) {
		c_total = d3.select(this)
			.append('circle')
			.attr('fill-opacity', 0.1)
			.attr('fill', d.fill);

		c_partial = d3.select(this)
			.append('circle')
			.attr('r',0)
			.attr('fill', d.fill)
			.attr('fill-opacity', 0)

		d.c_total = c_total;
		d.c_partial = c_partial;
		d.group = group;
		d.trg_total = trg_total;

		d.list = [];
		list.forEach( function( sd, si ){
			if(sd[group].indexOf( d.node.id ) >= 0) {
				d.total ++;
				d.list.push(sd);
			}
		});

		d.radius = calc_radius(d.total) + 1;
		d.c_total
			.attr('r',0)
			.transition().duration(dur2)
			.attr('r', calc_radius(d.total));

	});

	svg_map
		.attr('opacity', 0)
		.transition().duration(1000)
		.attr('opacity', 1);

	svg_force.alpha(0).start();
  set_all_circles(1000);

	if(mobile) {
		cur_scale = 0.5;
		svg_map.attr('transform', 'translate(1000 1000) scale('+ cur_scale +')');
	}

}

function set_all_circles(_dur){
	svg_circles = svg_map.selectAll('g')
	.each( function (d, i) {
		d.partial = 0;
		if(strict[d.group].length == 0 || strict[d.group].indexOf(d.id) >= 0){
			d.list.forEach( function( sd, si ){
				if(sd.visible){
					d.partial ++;
				}
			});
		}

		var pc = Math.round(d.partial/d.trg_total*1000)/10;
		d.pc_val = pc;

		d.c_partial
			.transition().duration(_dur)
			.attr('r', calc_radius(d.partial))
			.attr('fill-opacity', 1);
	});
}


function open_legend(){
	legends.open = true;
	$(legends).fadeIn( dur, _out);
}

function close_legend(){
	legends.open = false;
	$(legends).fadeOut( dur, _out);
}



//////////////////////////////// LOAD ////////////////////////////////



function load(){

	// check local storage filters
  if(sessionStorage.getItem('cur_filters')){
		cur_filters = sessionStorage.getItem('cur_filters').split(',');
	}else{
		cur_filters = [];
		sessionStorage.setItem('cur_filters', null);
	}

	if(mobile){
		dbody.appendChild(legends); // change legends DOM position
		$(legends).hide();
	}else{
		$(legend_hub).height(json.filters.kind.itens.length * 21 );
		$(legend_sig).height(json.filters.method.itens.length * 21 );
	}

	// mobile legend close bt

	if(mobile) {
		$(legends_x).on(bt_event, close_legend);
	}

	// mobile legend bts

	$(legend_hub_bt).on(bt_event, function(){
		open_legend();
	});

	$(legend_sig_bt).on(bt_event, function(){
		open_legend();
	});

	create_filters(json.filters.origin, false, false);
	create_filters(json.filters.coverage, false, false);

	// set_target
	if(cur_code == "sig"){

		scale = 10;
		$(control_sig).addClass('on');
		sep(json.labels.sig_list[lg].toUpperCase());
		create_filters(json.filters.method, sig_filters, 'method');
		create_filters(json.filters.purpose, sig_filters, false);
		create_filters(json.filters.type, sig_filters, false);

		// legend
		//method legend

		$(legend_sig_title).html( json.filters.method.label );
		for( i in json.filters.method.itens ){
			// legend
			d = json.filters.method.itens[i];
			li = document.createElement('li');
			$(li)
				.addClass('legend')
			legend_sig.appendChild(li);
			div = document.createElement('div');
			$(div)
				.addClass('color')
				.css({background:d.hex})
			li.appendChild(div);
			div = document.createElement('div');
			$(div)
				.addClass('lb')
				.html( d.label )
			li.appendChild(div);

			// mobile legend bt
			if( mobile && (i==0 || i==Math.round(json.filters.kind.itens.length/2) || i == json.filters.kind.itens.length - 1)){
				div = document.createElement('div');
				$(div)
					.addClass('legend_bt_color')
					.css({ background:d.hex })
				legend_sig_bt.appendChild(div);
			}
		}

		if(!mobile){
			$(legend_sig).delay(dur).animate({left:0}, dur );
		} else{
			$(legend_sig_bt).show();
			$(legend_sig).show();
			$(legend_hub).hide();
		}

		// labels
		$(circles_out).html(json.labels.method[lg].toUpperCase());
		$(circles_in).html(json.labels.sigs[lg].toUpperCase());

	}else{

		scale = 20;
		$(control_hub).addClass('on');
		sep(json.labels.hub_list[lg].toUpperCase());
		create_filters(json.filters.kind, hub_filters, 'kind');
		create_filters(json.filters.financier, hub_filters, false);

		// hub legend
		$(legend_hub_title).html( json.filters.kind.label );

		for( i in json.filters.kind.itens ){
			d = json.filters.kind.itens[i];
			li = document.createElement('li');
			$(li)
				.addClass('legend')
			legend_hub.appendChild(li);

			div = document.createElement('div');
			$(div)
				.addClass('color')
				.css({background:d.hex })
			li.appendChild(div);

			div = document.createElement('div');
			$(div)
				.addClass('lb')
				.html( d.label )
			li.appendChild(div);

			// mobile legend bt

			if( mobile && (i==0 || i==Math.round(json.filters.kind.itens.length/2) || i == json.filters.kind.itens.length - 1)){
				div = document.createElement('div');
				$(div)
					.addClass('legend_bt_color')
					.css({ background:d.hex })
				legend_hub_bt.appendChild(div);
			}
		}

		if(!mobile){
			$(legend_hub).delay(dur).animate({left:0}, dur );
		} else{
			$(legend_hub_bt).show();
			$(legend_hub).show();
			$(legend_sig).hide();
		}

		// labels
		$(circles_out).html(json.labels.kind[lg].toUpperCase());
		$(circles_in).html(json.labels.hubs[lg].toUpperCase());
	}

	// generic labels
	$(filters_lb).html(json.labels.filters[lg].toUpperCase());
	$(control_hub_lb).html(json.labels['hubs'][lg].toUpperCase());
	$(control_sig_lb).html(json.labels['sigs'][lg].toUpperCase());

	// start data
	simulate_db(json);

	// SVG MAP
	svg_map_area = d3.select('#map')
		.append('svg')
		.attr('id', 'svg_map_area')

	svg_map = svg_map_area
		.append('g')
		.attr('transform','translate(1000 1000)');

	resize();
	create_map(cur_code);

	// initial layout
	check_filters();
	check_trash();

	// need help
	$(need_help).hide();
	$(need_help_lb).html(json.labels.need_help[lg]);

	if( get_cookie('help_x') != 'ok' ){
		$(need_help).show().delay(3000).animate({ opacity:1, bottom: 65 }, dur, _out);
		setTimeout( function(){
			$(need_help).fadeOut(dur);
		}, 10000)
	}

	// create contact bts in menu
	contact_bts(json.contact);

} // load

// need_help

function close_need_help(){
	$(need_help).stop().fadeOut(dur);
	set_cookie('help_x', 'ok', 365);
}

$(need_help_x).on(bt_event, close_need_help)

function set_cookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	var expires = "expires="+d.toUTCString();
	document.cookie = cname + "=" + cvalue + "; " + expires;
}

function get_cookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i=0; i<ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1);
		if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
	}
	return "";
}

//////////////////////////////// LOAD EXTERNAL DATA ////////////////////////////////

$.ajax({
	url: 'data.json',
	dataType: 'json',
	success: function(data){
		json = data;
		load();
	}
});
