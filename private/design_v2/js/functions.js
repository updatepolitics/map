
var json;
var target_content;
var cur_bg;
var cur_code;
var cur_id;
var list;

var popup_x = false;
var popup_content = false;
var popup = false;

var i, a, item, li, div, p, list;

//////////////////////////////// OBJECTS ////////////////////////////////

reg('container');
reg('content_list');
reg('lists');
reg('popup_x');
reg('popup_content');
reg('popup');

reg('initiative_ico');
reg('initiative_title');
reg('initiative_info');
reg('initiative_description');

//////////////////////////////// funcions ////////////////////////////////

function initiative_item(d, code, target){

	li = document.createElement('li');
	li.node = d;
	$(li)
		.addClass('list_item ' + code)
		.on('click', function(){
			open_popup(this.node);
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

	target.appendChild(li);
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


function arr_search( arr, id ){
	for( var i in arr ){
		if( arr[i].id && arr[i].id == id ) return arr[i];
	}
}


function create_item( item, code, target ){

		li = document.createElement('li');
		li.ID = item.id;
		li.code = code;

		$(li)
			.addClass('box')
			.css({ backgroundColor: (item.hex)});

		if(code){
			$(li)
				.on('click', function(){
					sessionStorage.setItem('cur_filters', this.ID);
					sessionStorage.setItem('code', this.code);
					navigate("list.html",'filter_id=' + this.ID);
				});
		}else{
				$(li).addClass('off')
		}

		div = document.createElement('div')
			$(div)
				.addClass('box_title')
				.html(item.label.toUpperCase())
		li.appendChild(div);

		p = document.createElement('p')
			$(p)
				.html(item.about);
		li.appendChild(p);

		p = document.createElement('p');
		var examples = "";

		for( a in item.itens ){
			examples += item.itens[a].label;
			if( a < item.itens.length - 1) examples += ", ";
			else examples += ".";
		}
			$(p)
				.addClass('examples')
				.html(examples);

		li.appendChild(p);
		target.appendChild(li);
}

function create_section(target, title){

	div = document.createElement('div');
	$(div).addClass('content ' + cur_bg)
	$(target).append(div);

	div2 = document.createElement('div');
	$(div2)
		.addClass('sub_content')
	$(div).append(div2);

	div3 = document.createElement('div');
	$(div3)
		.addClass('content_title')
		.html( title );
	$(div2).append(div3);

	ul = document.createElement('ul');
	$(ul).addClass('list');
	$(div2).append(ul);

	return ul;

}

function toggle_bg(){
	if( cur_bg=='light1') cur_bg = 'light2';
	else cur_bg = 'light1';
}

function resize_initiative(){
		$(popup_content).height($(popup).height() - 150);
}

function open_popup (d){

	console.log(d);
	$(popup_content).html('');

	popup.open = true;

	$(popup).css({color:'', backgroundColor:'', height: ''});
	$(popup_x).css({ backgroundImage: '' });

	div = document.createElement('div');
	$(div)
		.addClass('title')
		.html(d.name);
	$(popup_content).append(div);

	div = document.createElement('div');
	$(div)
		.addClass('info')
		.html( info( d, true ))
	popup_content.appendChild(div);

	div = document.createElement('div');
	$(div)
		.addClass('about mt40')
		.html(d.about);
	$(popup_content).append(div);

	div = document.createElement('div');
	$(div)
		.addClass('pop_bt link')
		.html(d.url)
		.on('click', function(){
			alert(d.url);
		});
	$(popup_content).append(div);

	div = document.createElement('div');
	div.id = d.id;
	div.code = d.code;
	$(div)
		.addClass('pop_bt details')
		.html('DETALHES')
		.on('click', function(){
			navigate( 'initiative.html', 'id=' + this.id + '&code=' + this.code );
		});
	$(popup_content).append(div);

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

$(curtain).on( 'click', close_popup);


function load(){

	// start data
	simulate_db(json);
	resize();

	if(cur_page == 'hubs.html'){

		cur_bg = 'light1';
		toggle_bg();

		target_content = create_section(lists, json.labels.kind[lg] );

		for( i in json.filters.kind.itens ){
			node =  json.filters.kind.itens[i];
			li = create_item(node, 'hub', target_content);
		}

	}

	if(cur_page == 'signals.html'){

		cur_bg = 'light2';
		toggle_bg();

		target_content = create_section(lists, json.labels.themes[lg] );

		for( i in json.filters.theme.itens ){
			node = json.filters.theme.itens[i];
			li = create_item(node, 'sig', target_content);
		}

		toggle_bg();

		target_content = create_section(lists, json.labels.mechanisms[lg] );

		for( i in json.filters.mechanism.itens ){
			node = json.filters.mechanism.itens[i];
			li = create_item(node, false, target_content);
		}


	}

	if(cur_page == 'initiative.html'){

		cur_id = $_GET()['id'];
	  cur_code = $_GET()['code'];
	  list;

		if(cur_code == 'hub') {
			list = json.hubs;
			$(initiative_ico).css({backgroundImage:'url(layout/hub3.png)'})
		}else{
			list = json.signals;
			$(initiative_ico).css({backgroundImage:'url(layout/sig3.png)'})
		}

		// selected item
		var d = arr_search( list, cur_id  );

		$(initiative_title).html( d.name );
		$(initiative_info).html( info( d, true ));
		$(initiative_description).html( d.about );

		if( d.code == 'sig' ){

 			cur_bg = 'light2';

			// theme

			target_content = create_section(container, json.labels.theme[lg] );

			node = arr_search( json.filters.theme.itens, d.theme[0] );
			li = create_item(node, 'sig', target_content);

			// mechanisms

			if( d.mechanism.length > 0 ){

				toggle_bg();

				target_content = create_section(container,json.labels.mechanisms[lg] );

				for( i in d.mechanism ){
					node = arr_search( json.filters.mechanism.itens, d.mechanism[i] );
					li = create_item(node, false, target_content);
				}
			}

			// signal hubs

			if( d.hubs.length > 0 ){

				toggle_bg();

				target_content = create_section(container, json.labels.signal_hubs[lg] );

				for( var h in d.hubs ){
					var hub = arr_search( json.hubs, d.hubs[h]);
					initiative_item(hub, 'hub', target_content);
				}

			}

			// signal url

			if( d.url != '' ){

				toggle_bg();

				target_content = create_section( container, json.labels.more[lg] );

				li = document.createElement('li');
				$(li)
					.addClass('link')
					.html(d.url)
					.on('click', function(){
						alert(d.url);
					});
				$(target_content).append(li);

			}

		} else if(d.code =='hub') {

			cur_bg = 'light2';

			// kind

			target_content = create_section(container, json.labels.kind[lg] );

			node = arr_search( json.filters.kind.itens, d.kind[0] );
			li = create_item(node, 'hub', target_content);

			// hub signals

			if( d.signals.length > 0 ){

				toggle_bg();

				target_content = create_section(container, json.labels.hub_signals[lg] );

				for( var s in d.signals ){
					var sig = arr_search( json.signals, d.signals[s]);
					initiative_item(sig, 'sig', target_content);
				}

			}

			// signal url

			if( d.url != '' ){

				toggle_bg();

				target_content = create_section(container, json.labels.more[lg] );

				li = document.createElement('li');
				$(li)
					.addClass('link')
					.html(d.url)
					.on('click', function(){
						alert(d.url);
					});
				$(target_content).append(li);

			}
		}
	}

	// create contact bts in menu
	contact_bts(json.contact);

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
