
var json;

var i, a, item, li, div, p, list;

//////////////////////////////// OBJECTS ////////////////////////////////

reg('container');
reg('content_list');

reg('initiative_ico');
reg('initiative_title');

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


function create_item( item, code ){

		li = document.createElement('li');
		li.ID = item.id;
		li.code = code;

		$(li)
			.addClass('box')
			.css({ backgroundColor: item.hex })
			.on('click', function(){
				sessionStorage.setItem('cur_filters', this.ID);
				sessionStorage.setItem('code', this.code);
				navigate("list.html",'filter_id=' + this.ID);
		});
		content_list.appendChild(li);

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
}

function load(){

	resize();

	if(cur_page == 'hubs.html'){
		list = json.filters.kind.itens;
		for(i in list){
			create_item(list[i], 'hub');
		}
	}

	if(cur_page == 'signals.html'){
		list = json.filters.theme.itens;
		for(i in list){
			create_item(list[i], 'sig');
		}
	}

	if(cur_page == 'initiative.html'){
		if($_GET()['code'] == 'hub') $(initiative_ico).css({backgroundImage:'url(layout/hub3.png)'})
		else $(initiative_ico).css({backgroundImage:'url(layout/sig3.png)'})
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
