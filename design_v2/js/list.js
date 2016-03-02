
var json,
	node,
	page_y,
	wn,
	win_w,
	win_h,
	search_target,
	cur_filters,
	n_hubs = 0,
	n_signals = 0;

var bar_h = 80;
var filter_h = 25;

var hub_filters = [];
var sig_filters = [];
var strict = {
		'method':[],
		'kind':[]
	};


//////////////////////////////// OBJECTS ////////////////////////////////


reg('container');

reg('modal');
reg('modal_x');
reg('modal_content');

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

reg('control_center');

reg('control_hub');
reg('score_hub');
reg('control_hub_lb');

reg('control_sig');
reg('score_sig');
reg('control_sig_lb');

reg('control_filters');
reg('filters');
reg('filters_list');
reg('filters_x');
reg('trash');
reg('filters_lb');
reg('filters_counter');

reg('mode_list');

reg('list');

//////////////////////////////// control ////////////////////////////////////

$(mode).on(bt_event, function(){
	navigate("explore.html?code=" + cur_code, false);
});

$(control_hub).on(bt_event, function(){
	if(cur_code != 'hub') navigate("list.html?code=hub", false);
});

$(control_sig).on(bt_event, function(){
	if(cur_code != 'sig') navigate("list.html?code=sig", false);
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

//////////////////////////////// SEARCH ////////////////////////////////

$(search_str).on('click', function(event){
	 event.stopPropagation();
});

$(search_x).hide();

$(search_str).on('input', function(){
	if( this.value != "" ) $(search_x).show();
	else $(search_x).hide();
	search_for(this.value);
});

function search_for(tx){
	var search_tx = tx.toUpperCase();
	for( i in search_target ){
		node = search_target[i];
		if( node.visible ){
			if( node.name && node.name.toUpperCase().indexOf( search_tx ) >= 0 ){
				$(node.li).show();
			}else{
				$(node.li).hide();
			}
		}
	}
}

function reset_search(){
	search_str.value = "";
	search_for("");
	$(search_x).hide();
}

$(search_x).on('click', reset_search);

//////////////////////////////// MODAL ////////////////////////////////

$(document).keyup(function(e) {
	    if (e.keyCode == 27) {
	    if(modal.open) close_modal();
			if(help.open) close_help();
    }
});

function scroll(trg, to, dur){
	$(trg).scrollTo( to, {
		duration: dur2,
		easing: in_out,
		axis:'y'
	});
}

function info(d, inline){

	var sub = "";
	sub += "<span class='bold'>" + json.filters.origin.label + "</span> ";
	sub += arr_search( json.filters.origin.itens, d.origin ).label;

	if(inline)	sub += " | ";
	else sub += "<br>";

	sub +=  "<span class='bold'>" + json.filters.coverage.label + "</span> ";
	sub += arr_search( json.filters.coverage.itens, d.coverage ).label;

	if(d.code == 'sig'){

		if(inline)	sub += " | ";
		else sub += "<br>";

		sub +=  "<span class='bold'>" + json.filters.purpose.label + "</span> ";
		sub += arr_search( json.filters.purpose.itens, d.purpose ).label;

		if(inline)	sub += " | ";
		else sub += "<br>";

		sub +=  "<span class='bold'>" + json.filters.type.label + "</span> ";
		sub += arr_search( json.filters.type.itens, d.type ).label;

	}

	if( d.code == 'hub' ){

		if(inline)	sub += " | ";
		else sub += "<br>";

		sub +=  "<span class='bold'>" + json.filters.financier.label + "</span> ";
		sub += arr_search( json.filters.financier.itens, d.financier ).label;

	}

	return sub;

}

modal.open = false;

function open_modal (d ){

	if(filters.open) close_filters();

	modal.open = true;
	$(modal_content).html('');

	$(modal).css({color:'', backgroundColor:''});
	$(modal_x).css({ backgroundImage: '' });

	div = document.createElement('div');
	$(div)
		.addClass('title')
		.html(d.name);
	$(modal_content).append(div);

	div = document.createElement('div');
	$(div)
		.addClass('info')
		.html( info( d, false ))
	modal_content.appendChild(div);

	// hr = document.createElement('hr');
	// modal_content.appendChild(hr);

	div = document.createElement('div');
	$(div)
		.addClass('about mt40')
		.html(d.about);
	$(modal_content).append(div);

	if( d.code == 'sig' ){
		if( d.method.length > 0 ){

			div = document.createElement('div');
			$(div)
				.addClass('section')
				.html( json.labels.methods[lg] )
			$(modal_content).append(div);

			ul = document.createElement('div');
			$(ul).addClass('list');
			$(modal_content).append(ul);

			for( i in d.method ){

				node = arr_search( json.filters.method.itens, d.method[i] );
				li = document.createElement('li');
				li.open = false;
				li.node = node;
				$(li)
					.on('click', function(){
						toggle_plus(this);
					})
					.addClass('item')
					.html(node.label)
					.css({ backgroundColor:node.hex })
				$(ul).append(li);

				div = document.createElement('div');
				$(div)
					.addClass('item_plus')
					.css({ backgroundColor:node.hex, height:0})
				$(ul).append(div);

				div2 = document.createElement('div');
				$(div2)
					.html(node.about)
				$(div).append(div2);

				li.plus = div;
				li.plus_tx = div2;
			}
		}

	}else{

		div = document.createElement('div');
		$(div)
			.addClass('section')
			.html(json.filters.kind.label)
		$(modal_content).append(div);

		ul = document.createElement('div');
		$(ul).addClass('list');
		$(modal_content).append(ul);

		node = arr_search( json.filters.kind.itens, d.kind );
		li = document.createElement('li');
		li.open = false;
		li.node = node;
		$(li)
			.on('click', function(){
				toggle_plus(this);
			})
			.addClass('item')
			.html(node.label)
			.css({ backgroundColor:node.hex })
		$(ul).append(li);

		div = document.createElement('div');
		$(div)
			.addClass('item_plus')
			.css({ backgroundColor:node.hex, height:0})
		$(ul).append(div);

		div2 = document.createElement('div');
		$(div2)
			.html(node.about)
		$(div).append(div2);

		li.plus = div;
		li.plus_tx = div2;

	}

	div = document.createElement('div');
	$(div)
		.addClass('section')
		.html(json.labels.more[lg])
	$(modal_content).append(div);

	div = document.createElement('div');
	$(div)
		.addClass('link')
		.html(d.url)
		.on('click', function(){
			alert(d.url);
		});
	$(modal_content).append(div);

	scroll(modal_content, 0, 0);

	$(modal).fadeIn(dur,_out);
	$(curtain).fadeIn( dur, _out);
}

function close_modal(){
	modal.open = false;
	$(modal).fadeOut( dur,_out );
	$(curtain).fadeOut( dur, _out);
}

$(modal_x).on(bt_event, function(){
	close_modal();
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
	console.log(json.filters);
	console.log(cur_filters);
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
	$(score_hub).html(n_hubs);

	// signals list
	n_signals = update_list( json.signals, 'sig' );
	$(score_sig).html(n_signals);

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


$(update_logo).on(bt_event, function(){
		navigate('index.html', false);
});



//////////////////////////////// funcions ////////////////////////////////


function check_num(n, code){
	if(n==1) return json.labels[code][lg].toUpperCase();
	else return json.labels[code + 's'][lg].toUpperCase();
}


function resize_list(){

	console.log("resize");

		if(mobile){
			bar_h = 50;
			filter_h = 20;
		}else{
			bar_h = 80;
			filter_h = 25;
		}

		$(modal_content).height($(modal).height() - 50);
		$(filters).height(win_h - bar_h - 40);
		$(filters_list).height(win_h - bar_h - 97);

}


//////////////////////////////// LOAD ////////////////////////////////


function load(){

		// start data
		simulate_db(json);

	// check local storage filters
  if(sessionStorage.getItem('cur_filters')){
		cur_filters = sessionStorage.getItem('cur_filters').split(',');
	}else{
		cur_filters = [];
		sessionStorage.setItem('cur_filters', null);
	}

	create_filters(json.filters.origin, false, false);
	create_filters(json.filters.coverage, false, false);

	// set_target
	if(cur_code == "sig"){ // signals
		console.log('signals!');

		$(control_sig).addClass('on');
		sep(json.labels.sig_list[lg].toUpperCase());
		create_filters(json.filters.method, sig_filters, 'method');
		create_filters(json.filters.purpose, sig_filters, false);
		create_filters(json.filters.type, sig_filters, false);

		search_target = json.signals;

		for( i in json.signals ){

			d = json.signals[i];

			li = document.createElement('li');
			li.node = json.signals[i];
			$(li)
				.addClass('list_item sig')
				.on('click', function(){
					open_modal(this.node, false);
				});

			d.li = li;

			img = new Image();
			img.src = "layout/plus_gray.png";
			li.appendChild(img);

			div = document.createElement('div');
			$(div)
				.addClass('title')
				.html(d.name)
			li.appendChild(div);

			div = document.createElement('div');
			$(div)
				.addClass('info')
				.html( info( d, true ))
			li.appendChild(div);

			list.appendChild(li);

		}

	}else{ // hubs
		console.log('hubs!');

		$(control_hub).addClass('on');
		sep(json.labels.hub_list[lg].toUpperCase());
		create_filters(json.filters.kind, hub_filters, 'kind');
		create_filters(json.filters.financier, hub_filters, false);

		search_target = json.hubs;

		for( i in json.hubs ){

			d = json.hubs[i];

			console.log('hubs list');
			console.log(d );

			li = document.createElement('li');
			li.node = json.hubs[i];
			$(li)
				.addClass('list_item hub')
				.on('click', function(){
					open_modal(this.node, false);
				});

			d.li = li;

			img = new Image();
			img.src = "layout/plus_gray.png";
			li.appendChild(img);

			div = document.createElement('div');
			$(div)
				.addClass('title')
				.html(d.name)
			li.appendChild(div);

			div = document.createElement('div');
			$(div)
				.addClass('info')
				.html( info( d, true ))
			li.appendChild(div);

			list.appendChild(li);

		}
	}

	$(list).css({ marginTop:bar_h+40, marginBottom:bar_h});

	// generic labels
	$(filters_lb).html(json.labels.filters[lg].toUpperCase());
	$(control_hub_lb).html(check_num(n_hubs, "hub"));
	$(control_sig_lb).html(check_num(n_signals, "sig"));

	resize();

	// initial layout
	check_filters();
	check_trash();


} // load

//////////////////////////////// LOAD EXTERNAL DATA ////////////////////////////////

$.ajax({
	url: 'data.json',
	dataType: 'json',
	success: function(data){
		json = data;
		load();
	}
});
