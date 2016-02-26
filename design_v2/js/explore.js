
var json,
	node,
	page_y,
	wn,
	win_w,
	win_h,
	cur_code,
	scale;

var scale_kind,
	scale_method;


var bar_h = 80;
var logo_t = 32;
var zoom_r = 25;
var filter_h = 25;

var hub_filters = [];
var sig_filters = [];
var strict = {
		'method':[],
		'kind':[]
	};


// map vars

var svg_map_area;
var svg_map;

var svg_nodes;
var svg_force;
var svg_circles;


//////////////////////////////// objects ////////////////////////////////


//////////////////////////////// OBJECTS ////////////////////////////////


reg('container');

reg('modal');
reg('modal_x');
reg('modal_content');

reg('map_container');
reg('tooltip');
reg('tt_title');
reg('tt_val');
reg('map');
reg('legends');
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
reg('score_hub');
reg('control_hub_lb');

reg('control_sig');
reg('score_sig');
reg('control_sig_lb');

reg('control_filters');
reg('filters_lb');
reg('filters_counter');

reg('mode_list');



//////////////////////////////// control ////////////////////////////////

$(mode_list).on(bt_event, function(){
	navigate("list.html?cod=" + cur_code, false);
});

$(control_hub).on(bt_event, function(){
	if(cur_code != 'hub') navigate("explore.html?cod=hub", false);
});

$(control_sig).on(bt_event, function(){
	if(cur_code != 'sig') navigate("explore.html?cod=sig", false);
});


filters.open = false;

function open_filters() {
	filters.open = true;
	$(filters).animate({right:0}, dur, in_out);
}

function close_filters() {
	filters.open = false;
	$(filters).animate({right:'-100%'}, dur, in_out);
}

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
	filters.appendChild(div);
}


//////////////////////////////// FILTERS ////////////////////////////////

filters.score = 0;

function reset_filters_score(clear){
	filters.score = 0;
	$(filters_nb).css({opacity:0.2}).html(0);
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
}

function check_filters() {
	reset_filters_score(false);
	reset_search();
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
			$(filters_nb).css({opacity:1}).html( filters.score );
		}
		if(json.filters[i].active.length > 0){
			$(json.filters[i].nb).css({opacity:1}).html( json.filters[i].active.length );
		}
	}

	//trash
	if(filters.score > 0) $(trash).removeClass('empty');
	else $(trash).addClass('empty');

	// hubs list
	n_hubs = update_list( json.hubs, 'hub' );

	// signals list
	n_signals = update_list( json.signals, 'sig' );

}

// $(trash).on(bt_event, function(){
// 	reset_filters_score(true);
// 	check_filters();
// });

function update_list(data, cod){
	var n = data.length;
	for(a in data){
		d = data[a];
		$(d.li).show();
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
					$(d.li).hide();
				}
			}
		}
	}
	if(cur_target == cod) set_score(n);
	set_all_circles();
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
	}else{
		trg.on = true;
		if( trg.group && strict[trg.group].indexOf(trg.id) < 0 ){
			strict[trg.group].push(trg.id);
		}
	}
	check_filters();
}

function create_filters( data, target, group ){

	var title;

	title = document.createElement('div');
	$(title)
		.addClass('filter_title')
		.html(data.label);
	filters.appendChild(title);

	span = document.createElement('span');
	$(span)
		.html(0)
		.addClass('counter');
	title.appendChild(span);

	ul = document.createElement('ul');
	$(ul)
		.addClass('group')
		.height(0);
	filters.appendChild(ul);

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
		li.on = false;
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

	}
}

function arr_search( arr, id ){
	for( var i in arr ){
		if( arr[i].id && arr[i].id == id ) return arr[i];
	}
}


//////////////////////////////// funcions ////////////////////////////////


function resize_update(){

		if(mobile){
			bar_h = 50
		}else{
			bar_h = 80;
		}

		$(modal_content).height($(modal).height() - 50);
		$(map_container).height(win_h - bar_h);
}

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
		open_modal(d, true);
	})
	.on('mouseover', function(d){
		var val = d.partial +  '/' + d.trg_total + ' ' + check_num(d.partial) + ' (' + d.pc_val + '%)';
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

	svg_force.alpha(0).start();
  set_all_circles();

}

function set_all_circles(){
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
			.transition().duration(1000)
			.attr('r', calc_radius(d.partial))
			.attr('fill-opacity', 1);
	});
}

//////////////////////////////// LOAD ////////////////////////////////


function $_GET() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function load(){



	create_filters(json.filters.origin, false, false);
	create_filters(json.filters.coverage, false, false);
	sep("FILTROS DE SINAIS");
	create_filters(json.filters.method, sig_filters, 'method');
	create_filters(json.filters.kind, hub_filters, 'kind');
	create_filters(json.filters.purpose, sig_filters, false);
	create_filters(json.filters.type, sig_filters, false);
	create_filters(json.filters.financier, hub_filters, false);


	// check_get
	cur_code = ( $_GET()["cod"] || 'sig' );

	if(cur_code == 'sig'){
		scale = 10;
		$(control_sig).addClass('on');
	}else{
		scale = 20;
		$(control_hub).addClass('on');
	}

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

function simulate_db(db){

	for( var l=1; l<livros.length; l++ ){
		var livro = {};
		livro.autor = livros[l].split('-')[1];
		livro.titulo = livros[l].split('-')[0];
		if(livro.titulo.indexOf(',') >= 0){
			livro.titulo = livro.titulo.split(',')[1] + ' ' + livro.titulo.split(',')[0];
		}
		livros[l] = livro;
	}

	function rand(n){
		return Math.ceil(Math.random()*n);
	}

	function shift_rand(n){
		var shift = Math.random();
		if(shift <= 0.2)	return Math.ceil(Math.random()*n/4);
		if(shift > 0.2 && shift <= 0.5) return Math.ceil(Math.random()*n/3);
		if(shift > 0.5 && shift <= 0.8) return Math.ceil(Math.random()*n/2);
		else return Math.ceil(Math.random()*n);
	}

	for(var h=1; h<=215; h++){
		var hb = {};
		hb.id = h;
		hb.visible = true;
		hb.cod = "hub";
		hb.url = "http://hub_url.com";
		hb.about = "Cursus mauris in. Dictumst leo consectetuer nec porttitor gravida leo varius metus. Urna hymenaeos bibendum mi non ultricies egestas pellentesque dolor. Per esse risus. Magna felis facilisis cursus duis pede aliquam scelerisque tortor. Vivamus dictum arcu. Lacus habitasse amet. Tellus arcu taciti morbi aliquam risus vestibulum vehicula mauris consectetuer vel eget. ";
		hb.name = livros[rand(livros.length-1)].autor;
		hb.kind = [shift_rand(12)];
		hb.origin = rand(5);
		hb.coverage = rand(4);
		hb.financier = shift_rand(2);
		db.hubs.push(hb);
	}

	for(var s=1; s<=445; s++){
		var sg = {};
		sg.id = s;
		sg.visible = true;
		sg.cod = "sig";
		sg.url = "http://sig_url.com";
		sg.about = "Cursus mauris in. Dictumst leo consectetuer nec porttitor gravida leo varius metus. Urna hymenaeos bibendum mi non ultricies egestas pellentesque dolor. Per esse risus. Magna felis facilisis cursus duis pede aliquam scelerisque tortor. Vivamus dictum arcu. Lacus habitasse amet. Tellus arcu taciti morbi aliquam risus vestibulum vehicula mauris consectetuer vel eget. ";
		sg.name = livros[rand(livros.length-1)].titulo;
		var n_methods = rand(4);
		sg.method = [];
		for(a=1; a<=n_methods; a++){
			var rand_met = shift_rand(14);
			if( sg.method.indexOf(rand_met) < 0) sg.method.push(rand_met);
		}
		sg.origin = rand(5);
		sg.coverage = rand(4);
		sg.type = rand(5);
		sg.purpose = rand(2);
		db.signals.push(sg);
	}
}


var livros = [null,
"Abel e Helena - Artur Azevedo",
"Agosto - Rubem Fonseca",
"Águia e a Galinha, A - Leonardo Boff",
"Alfarrábios - José de Alencar",
"Alienista, O - Machado de Assis",
"Alguma Poesia - Carlos Drummond de Andrade",
"Alguma Poesia - Machado de Assis",
"Alma - Oswald de Andrade",
"Alma do Lázaro, A - José de Alencar",
"Alma Inquieta - Olavo Bilac",
"Alquimista, O - Paulo Coelho",
"Americanas - Machado de Assis",
"Amor com Amor se Paga - França Júnior",
"Amor de Perdição - Josué Guimarães",
"Amor e Pátria - Joaquim Manuel de Macedo",
"Amor por Anexins - Artur Azevedo",
"Ana Terra, Érico Veríssimo",
"Antes da Missa - Machado de Assis",
"Antes do Baile Verde - Lygia Fagundes Telles",
"Aos Vinte Anos - Aluísio de Azevedo",
"Arcádia e a Inconfidência, A - Oswald de Andrade",
"Arquivos do inferno - Paulo Coelho",
"Asa Esquerda do Anjo, A - Lya Luft",
"Asas de um Anjo, As - José de Alencar",
"As horas nuas - Lygia Fagundes Telles",
"As Meninas - Lygia Fagundes Telles",
"Assassinatos na Academia Brasileira de Letras - Jô Soares",
"Assovio, Qorpo Santo",
"Ateneu, O - Raul Pompéia",
"Aventuras de Tibicuera, Érico Veríssimo",
"Bacia das Almas - Luiz Antônio de Assis Brasil",
"Bahia de Todos os Santos - Jorge Amado",
"Baladas para El Rei - Cecília Meireles",
"Balas de Estalo - Machado de Assis",
"Balé Branco, O - Carlos Heitor Cony",
"Bandoleiros - João Gilberto Noll",
"Barca de Gleyre, A - Monteiro Lobato",
"Batuque - Cecília Meireles",
"Baú de Ossos - Pedro Nava",
"Beira Mar - Pedro Nava",
"Beira Rio Beira Vida - Assis Brasil",
"Bela e a Fera, A - Clarice Lispector",
"Bela Madame Vargas, A - João do Rio",
"Bem Amado, O - Dias Gomes",
"Bola e o goleiro, A - Jorge Amado",
"Bons Dias - Machado de Assis",
"Bote de Rapé, O - Machado de Assis",
"Biblioteca - Lima Barreto",
"Boca do Inferno - Ana Miranda",
"Bom Crioulo - Adolfo Caminha",
"Bons Dias - Machado de Assis",
"Broquéis - Cruz e Sousa",
"Bruzundangas - Lima Barreto",
"Burgo - Gregório de Matos",
"Bugrinha - Afrânio Peixoto",
"Brida - Paulo Coelho",
"Cabeleira - Franklin Távora",
"Cabocla - Ribeiro Couto",
"Cacau - Jorge Amado",
"Cacto Vermelho, O - Lygia Fagundes Telles",
"Cães da Província - Luiz Antônio de Assis Brasil",
"Caetés - Graciliano Ramos",
"Café da Manhã - Dináh Silveira de Queiróz",
"Camilo Mortágua - Josué Guimarães",
"Caminhos cruzados - Érico Veríssimo",
"Canções - Cecília Meireles",
"Capitães da Areia - Jorge Amado",
"Capital Federal - Artur Azevedo",
"Caramuru - Frei José de Santa Rita Durão",
"Carnaval dos Animais, O - Moacyr Sclyar",
"Carne - Júlio Ribeiro",
"Carolina - Casimiro de Abreu",
"Carrilhões - Murilo Araújo",
"Cartas Chilenas - Tomaz Antonio Gonzaga",
"Cartas perto do Coração - Clarice Lispector",
"Carteira - Machado de Assis",
"Casa das Quatro Luas, A - Josué Guimarães",
"Casadas Solteiras - Martins Pena",
"Casa de Pensão - Álvares de Azevedo",
"Casadinha de Fresco - Artur Azevedo",
"Casa Fechada - Roberto Gomes",
"Casa Velha - Machado de Assis",
"Castelo no Pampa, Um - Luiz Antônio de Assis Brasil",
"Cavaleiro da Esperança, O - Jorge Amado",
"Cavalo Cego, O - Josué Guimarães",
"Cavalos e Obeliscos - Moacyr Sclyar",
"Cemitério - Lima Barreto",
"Centauro no Jardim, O - Moacyr Sclyar",
"Certa Entidade em Busca de Outra - Qorpo Santo",
"Certo Henrique Bertaso, Um - Érico Veríssimo",
"Ciclo das Águas, O - Moacyr Sclyar",
"Cidade Sitiada, A - Clarice Lispector",
"Cinco Minutos - José de Alencar",
"Ciranda de Pedra - Lygia Fagundes Telles",
"Clara dos Anjos - Lima Barreto",
"Clarissa - Érico Veríssimo",
"Clô Dias & Noites - Sérgio Jockymann",
"Comba Malina - Dináh Silveira de Queiróz",
"Com o Vaqueiro Mariano - João Guimarães Rosa",
"Como o Homem Chegou - Lima Barreto",
"Como Nasceram as Estrelas - Clarice Lispector",
"Como se Fazia um Deputado - França Júnior",
"Concerto Campestre - Luiz Antônio de Assis Brasil",
"Condição Judaica, A - Moacyr Sclyar",
"Conexão Beirute Teeran - Luis Eduardo Matta",
"Conto de Escola - Machado de Assis",
"Contos Fluminenses - Machado de Assis",
"Contos Gauchescos - Simões Lopes Neto",
"Contrastes e Confrontos - Euclides da Cunha",
"Coronel e o Lobisomem, O - José Cândido de Carvalho",
"Corpo de Baile - João Guimarães Rosa",
"Correspondência - Emílio de Menezes",
"Correspondência - Machado de Assis",
"Correspondências - Clarice Lispector",
"Cortiço, O - Aluízio Azevedo",
"Credor da Fazenda Nacional - Qorpo Santo",
"Criança, Meu Amor - Cecília Meireles",
"Crisálidas - Machado de Assis",
"Crítica - Machado de Assis",
"Crônica Trovada da Cidade de San Sebastian do Rio de Janeiro - Cecília Meireles",
"Dança de Espelhos - Kátya Chamma",
"Demônio e a Srta. Prym, O - Paulo Coelho",
"Demônio Familiar - José de Alencar",
"Depois do Último Trem - Josué Guimarães",
"Descrição da Ilha de Itaparica, Termo da Cidade da Bahia - Frei Manuel de Santa Rita Itaparica",
"Desencantos - Machado de Assis",
"Deuses de Raquel, Os - Moacyr Sclyar",
"Diário de um Mago, O - Paulo Coelho",
"Dicionário do Viajante Insólito - Moacyr Sclyar",
"Diplomático - Machado de Assis",
"Disciplina do Amor, A - Lygia Fagundes Telles",
"Discurso de Posse na Academia Brasileira de Letras - Emílio de Menezes",
"Diva - José de Alencar",
"Doença de Antunes - Lima Barreto",
"Dom Casmurro - Machado de Assis",
"Dom Supremo, O - Paulo Coelho",
"Dona Anja - Josué Guimarães",
"Dona Flor e Seus Dois Maridos - Jorge Amado",
"Donaguidinha - Manuel de Oliveira Paiva",
"Doutor Miragem - Moacyr Sclyar",
"Durante Aquele Estranho Chá: Perdidos e Achados - Lygia Fagundes Telles",
"E do meio do Mundo Prostituto, só Amores Guardei ao meu Charuto - Rubem Fonseca",
"Encarnação - José de Alencar",
"Enquanto a Noite não Chega - Josué Guimarães",
"Esaú e Jacó - Machado de Assis",
"Esganadas, As - Jô Soares",
"Espumas Flutuantes - Castro Alves",
"Estranha Nação de Rafael Mendes, A - Moacyr Scliar",
"Exército de um Homem Só, O - Moacyr Scliar",
"Falenas - Machado de Assis",
"Ferro e Fogo, A - Josué Guimarães",
"Festa no Castelo - Moacyr Sclyar",
"Floradas na Serra - Dináh Silveira de Queiróz",
"Gato no Escuro, O - Josué Guimarães",
"Gato Preto em Campo de Neve - Érico Veríssimo",
"Gaúcho, O - José de Alencar",
"Grande Mulher Nua, A - Luís Fernando Veríssimo",
"Guarani, O - José de Alencar",
"Guerra no Bom Fim, A - Moacyr Sclyar",
"Guida, Caríssima Guida - Dináh Silveira de Queiróz",
"Gula - O Clube dos Anjos - Luís Fernando Veríssimo",
"Helena - Machado de Assis",
"História da Província de Santa Cruz - Pero de Magalhães Gândavo",
"História de Quinze Dias - Machado de Assis",
"Histórias da Meia Noite - Machado de Assis",
"Histórias Escolhidas - Luís Fernando Veríssimo",
"História só pra Mim, Uma - Moacyr Sclyar",
"Histórias sem Data - Machado de Assis",
"Hora da Estrela, A - Clarice Lispector",
"Iaiá Garcia - Machado de Assis",
"I Juca Pirama - Gonçalves Dias",
"Ilha de Maré, À - Manuel Botelho de Oliveira",
"Incidente em Antares - Érico Veríssimo",
"Infância - Graciliano Ramos",
"Inocência - Visconde de Taunay",
"Insônia - Graciliano Ramos",
"Introdução à Lógica Amorosa - Moacyr Sclyar",
"Ira Implacável - Luis Eduardo Matta",
"Iracema - José de Alencar",
"Israel em Abril - Érico Veríssimo",
"Jardim do Diabo, O - Luís Fernando Veríssimo",
"Jubiabá - Jorge Amado",
"Laços de Família - Clarice Lispector",
"Lendas do Sul - Simões Lopes Neto",
"Lição de Botânica - Machado de Assis",
"Linhas Tortas - Graciliano Ramos",
"Livro Derradeiro, O - Cruz e Sousa",
"Lucíola - José de Alencar",
"Lugar ao Sol, Um - Érico Veríssimo",
"Luneta Mágica, A - Joaquim Manuel de Macedo",
"Macário - Álvares de Azevedo",
"Mad Maria - Márcio de Souza",
"Mãe do Freud, A - Luís Fernando Veríssimo",
"Maktub - Paulo Coelho",
"Manhã Transfigurada - Luiz Antônio de Assis Brasil",
"Manual do Guerreiro da Luz, O - Paulo Coelho",
"Manuelzão e Miguilim - Guimarães Rosa",
"Mão e a Luva, A - Machado de Assis",
"Margarida la Rocque - A Ilha dos Demônios - Dináh Silveira de Queiróz",
"Marido do Doutor Pompeu, O - Luís Fernando Veríssimo",
"Max e Os Felinos - Moacyr Sclyar",
"Memorial de Aires - Machado de Assis",
"Memórias de um Sargento de Milícias - Manuel António de Almeida",
"Memórias do Cárcere - Graciliano Ramos",
"Memórias Póstumas de Brás Cubas - Machado de Assis",
"Mentiras que os Homens Contam, As - Luís Fernando Veríssimo",
"Mês de Cães Danados - Moacyr Sclyar",
"Meus Lampejos - Geziel Ramos",
"Meu Último Dragão - Josué Guimarães",
"México - Érico Veríssimo",
"Minas de Prata, As - José de Alencar",
"Moço Loiro, O - Joaquim Manuel de Macedo",
"Monte Cinco, O - Paulo Coelho",
"Moreninha, A - Joaquim Manuel de Macedo",
"Mortalha de Alzira, A - Aluízio Azevedo",
"Mulato, O - Aluízio Azevedo",
"Mulher do Silva, A - Luís Fernando Veríssimo",
"Muralha, A - Dináh Silveira de Queiróz",
"Música ao Longe - Érico Veríssimo",
"Noite na Taverna, Álvares de Azevedo",
"Noites - Érico Veríssimo",
"Novas Crônicas da Vida Privada - Luís Fernando Veríssimo",
"O País do Carnaval - Jorge Amado",
"Ocidentais - Machado de Assis",
"Olga - Fernando Morais",
"Olhai os Lírios do Campo - Érico Veríssimo",
"Orelha de Van Gogh, A - Moacyr Sclyar",
"Orgia dos Duendes, A - Bernardo Guimarães",
"Orgias - Luís Fernando Veríssimo",
"Origem do Mênstruo, A - Bernardo Guimarães",
"Outras do Analista de Bagé - Luís Fernando Veríssimo",
"Páginas Recolhidas - Machado de Assis",
"País do Carnaval, O - Jorge Amado",
"Paixão segundo G.H., A - Clarice Lispector",
"Papéis Avulsos - Machado de Assis",
"Pata da Gazela, A - José de Alencar",
"Pecado - Lima Barreto",
"Pedro Gobá - Ezequiel Freire",
"Pele o Lobo - Artur Azevedo",
"Peru versus Bolívia - Euclides da Cunha",
"Pessoas Beneméritas - Gregório de Matos",
"Pequena História da República - Graciliano Ramos",
"Pequenas Criaturas - Rubem Fonseca",
"Poesias - Alphonsus de Guimarães",
"Poemas Malditos - Álvares de Azevedo",
"Poesias Coligidas - Castro Alves",
"Poética 1 - Gregório de Matos",
"Poética 2 - Gregório de Matos",
"Porque Não Se Matava - Lima Barreto",
"Primeiras Estórias - Guimarães Rosa",
"Primeiros Cantos - Gonçalves Dias",
"Primo da califórnia, O - Joaquim Manuel de Macedo",
"Princesa dos Cajueiros - Artur Azevedo",
"Prisioneiro, O - Érico Veríssimo",
"Prole do Corvo, A - Luiz Antônio de Assis Brasil",
"Prosopopéia - Bento Teixeira",
"Quarto de Légua em Quadro, Um - Luiz Antônio de Assis Brasil",
"Quem Casa, Quer Casa - Martins Pena",
"Quincas Borba - Machado de Assis",
"Relíquias de Casa Velha - Machado de Assis",
"Recordações do Escrivão Isaías Caminha - Lima Barreto",
"Relíquias de Casa Velha - Machado de Assis",
"Resto É Silêncio, O - Érico Veríssimo",
"Retirada da Laguna - Visconde de Taunay",
"Rio de Janeiro em 1877 - Artur Azevedo",
"Sacrifício - Franklin Távora",
"Saga - Érico Veríssimo",
"Sagarana - Guimarães Rosa",
"Santo e a Porca, O - Ariano Suassuna",
"São Bernardo - Graciliano Ramos",
"Semana - Machado de Assis",
"Senhora - José de Alencar",
"Senhor Embaixador, O - Érico Veríssimo",
"Sertões, Os - Euclides da Cunha",
"Solo de Clarineta - Érico Veríssimo",
"Sorriso do Lagarto, O - João Ubaldo Ribeiro",
"Sonhos D'Oro - José de Alencar",
"Souvenir iraquiano - Robinson dos Santos",
"Subterraneo do Morro Castelo - Lima Barreto",
"Suicida e o Computador, O - Luís Fernando Veríssimo",
"Suje se Gordo! - Machado de Assis",
"Suor - Jorge Amado",
"Suspiros Poéticos e Saudades - Domingos Gonçalves de Magalhães",
"Tambores Silenciosos, Os - Josué Guimarães",
"Tarde para Saber, É - Josué Guimarães",
"Tchau - Lygia Bojunga Nunes",
"Tempo de Felicidade - Geziel Ramos",
"Tempo e o Vento, O - Érico Veríssimo",
"Terra dos Meninos Pelados, A - Graciliano Ramos",
"Tenda dos Milagres - Jorge Amado",
"Tentação - Adolfo Caminha",
"Teresa Batista Cansada de Guerra - Jorge Amado",
"Terras do Sem Fim - Jorge Amado",
"Tieta do Agreste - Jorge Amado",
"Til - José de Alencar",
"Tio que Flutuava, O - Moacyr Sclyar",
"Traçando Paris - Luís Fernando Veríssimo",
"Traçando Roma - Luís Fernando Veríssimo",
"Triste Fim de Policarpo Quaresma - Lima Barreto",
"Ubirajara - José de Alencar",
"Última Bruxa, A - Josué Guimarães",
"Últimos Sonetos - Cruz e Sousa",
"Um e Outro - Lima Barreto",
"Um Lugar Ao Sol - Érico Veríssimo",
"Único Assassinato de Cazuza - Lima Barreto",
"Valkírias, As - Paulo Coelho",
"Vaqueano - Apolinário Porto-Alegre",
"Várias Histórias - Machado de Assis",
"Vastas Emoções e Pensamentos Imperfeitos - Rubem Fonseca",
"Velhinha de Taubaté, A - Luís Fernando Veríssimo",
"Venha ver o Pô do Sol - Lygia Fagundes Telles",
"Veronika decide Morrer - Paulo Coelho",
"Verso e Reverso - José de Alencar",
"Véspera de Reis - Artur Azevedo",
"Viagem - Graciliano Ramos",
"Viagem à Aurora do Mundo - Érico Veríssimo",
"Vida de Joana D'Arc, A - Érico Veríssimo",
"Vida e Morte de M. J. Gonzaga de Sá - Lima Barreto",
"Videiras de Cristal - Luiz Antônio de Assis Brasil",
"Vinte Anos - Álvares de Azevedo",
"Virtudes da Casa, As - Luiz Antônio de Assis Brasil",
"Viuvinha, A - José de Alencar",
"Viventes das Alagoas - Graciliano Ramos",
"Volta do Gato Preto, A - Érico Veríssimo",
"Voluntários, Os - Moacyr Sclyar",
"Xerloque da Silva em: O Rapto da Dorotéia - Josué Guimarães",
"Xerloque da Silva em: Os Ladrões da Meia Noite - Josué Guimarães",
"Zoeira - Luís Fernando Veríssimo	"
];
