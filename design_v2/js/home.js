
var json,
	node,
	page_y,
	cur_code,
	wn,
	win_w,
	win_h,
	scale;


var scale_kind,
	scale_method;

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

//////////////////////////////// OBJECTS ////////////////////////////////


reg('container');

reg('home');
reg('quotes');
reg('about');
reg('explore');
reg('credit_who');
reg('credit_what');

reg('map_container');
reg('map');




//////////////////////////////// funcions ////////////////////////////////

var rot = 0;
var rotation;
var rot_delay;

function map_rotation(delay,rotate){
	// console.log("map rotation: " + rotate);
	if(rotate){
		rot_delay = setTimeout( function(){
			rotation = setInterval(function(){
				rot += 0.02;
				svg_map.attr('transform', 'translate(1000 1000) scale(1) rotate(' + rot + ')');
			},10)
		}, delay);
	}else{
		clearInterval(rotation);
		clearTimeout(rot_delay);
	}
}

$(map).css({backgroundSize:'100%'});

$(about).on(bt_event, function(){
	navigate("about.html", false);
})

$(explore).on(bt_event, function(){
	navigate("explore.html?cod=" + cur_code, false);
})


function calc_radius(area){
	return scale * Math.sqrt(area / Math.PI);
}

function tick(e) {
	svg_circles.each(gravity(0.05 * e.alpha))
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
		nx1 = d.x - r ,
		nx2 = d.x + r,
		ny1 = d.y - r,
		ny2 = d.y + r;
		quadtree.visit(function (quad, x1, y1, x2, y2) {
			if (quad.point && (quad.point !== d)) {
				var x = d.x - quad.point.x,
				y = d.y - quad.point.y,
				l = Math.sqrt( x * x + y * y ),
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

function create_map(){

	var list;
	var nodes;
	var color;
	var group;

	var rand_cod = Math.random();

	if(rand_cod > 0.5){
		nodes = json.filters.kind.itens;
		list = json.hubs;
		group = "kind";
		cur_code = "hub";
		trg_total = json.hubs.length;
		if(mobile) scale = 50;
		else scale = 75;
	}else{
		nodes = json.filters.method.itens;
		list = json.signals;
		group = "method";
		cur_code = "sig";
		trg_total = json.signals.length;
		if(mobile) scale = 30;
		else scale = 50;
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

	//.call(svg_force.drag)
	.each(function (d, i) {
		c_total = d3.select(this)
			.append('circle')
			.attr('fill', d.fill)
			.attr('fill-opacity', 0)
			.transition().duration(1000)
			.attr('fill-opacity', 1);

		d.c_total = c_total;

		d.list = [];
		list.forEach( function( sd, si ){
			if(sd[group].indexOf( d.node.id ) >= 0) {
				d.total ++;
				d.list.push(sd);
			}
		});

		d.radius = calc_radius(d.total) + 2;

		d.c_total
			.attr('r', calc_radius(d.total));

	});

	svg_force.alpha(0).start();

}


//////////////////////////////// LOAD ////////////////////////////////


function load(){

	//INTERFACE LANGUAGE
	$(about).html( json.labels.about[lg].toUpperCase());
	$(explore).html( json.labels.explore[lg].toUpperCase());

	$(quotes).html( json.home );

	// start data
	simulate_db(json);

	// SVG MAP
	svg_map_area = d3.select('#map')
		.append('svg')
		.attr('id', 'svg_map_area')

	svg_map = svg_map_area
		.append('g')
		.attr('opacity', 0.5)
		.attr('transform','translate(1000 1000)');

	resize();
	create_map()

	map_rotation(0, true);

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
