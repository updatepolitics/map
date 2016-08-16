var duration = 350;

var svg_map_area;
var svg_map;

var rotation;
var rotationDelay;

var modalPages = [
  {
    title: "A Democracia na América Latina do séc XXI",
    text: "A democracia ainda está em processo de consolidação e amadurecimento na América Latina. A fragilidade das instituições democráticas, ameaças a direitos fundamentais e a interferência de diferentes tipos de elites nas decisões políticas influenciam diretamente a percepção e a confiança dos cidadãos no processo político, principalmente numa sociedade cada vez mais conectada e participativa."
  },
  {
    title: "Uma sociedade conectada e participativa",
    text: "As dinâmicas da sociedade estão mudando mais intensamente no século XXI. As formas tradicionalmente conhecidas se somam às novas formas de produzir, consumir, comunicar e se relacionar. O acesso e distribuição do poder também são impactados por essas mudanças. O contexto de uma democracia em construção e as novas dinâmicas sociais possibilitam a emergência de novas práticas políticas."
  },
  {
    title: "A emergência de práticas políticas",
    text: "Essas práticas atuam na fronteira dos processos democráticos, expandindo os limites de interação entre a sociedade civil e o poder público. Em todo o mundo, os atores do campo de inovação política estão desenvolvendo experimentos de diferentes formas e em diferentes contextos. Na América Latina, observamos que esses experimentos apontam possibilidades de caminhos para atualizar a política do século XXI."
  },
  {
    title: "Ecossistema de práticas políticas emergentes",
    text: "O Update acredita que retratar e criar uma visualização para o ecossistema de práticas políticas emergentes é o primeiro passo para subsidiar a afirmação da existência desse campo e, a partir dessas evidências, potencializar uma visão de coletividade e pertencimento para os atores envolvidos nos processos políticos que contribuem para a redução da distância entre a sociedade civil e o poder público."
  },
  {
    title: "A plataforma",
    text: "Para dar luz a esse ecossistema, desenvolveu-se uma classificação própria representada nesta plataforma digital. São 700 iniciativas mapeadas, de 21 países da América Latina. Para ter visão das precisa sobre as práticas, as informações foram separada em duas formas diferentes de visualização. A primeira é por meio dos Hubs - os atores do ecossistema. A segunda é por meio dos sinais - são as práticas e projetos realizados pelos hubs. "
  },
  {
    title: "Hubs e sinais, os atores e as práticas do ecossistema",
    text: "Os hubs são organismos - institucionalizados ou não - que desenvolvem ações e funcionam como emissores dos sinais de inovação. Cada hub é capaz de realizar diversos sinais, os quais possuem métodos, abordagens e propósitos distintos. Olhar para os hubs sem especificar suas práticas e táticas de ação resultaria numa visão genérica e não ecossistêmica. Além disso, a observação a partir dos sinais permite compreender quais são as práticas mais utilizadas e de que maneira o ecossistema se desenvolve no sentido de reduzir a distância entre sociedade civil e poder público. "
  },
  {
    title: "Explore e conheça o ecossistema",
    text: "A proposta dessa plataforma é permitir que se conheça um pouco do universo das novas práticas políticas. O convite é para explorar os resultados variando as múltiplas combinações de filtros e permitindo análises próprias. Esse mapeamento é o primeiro esforço para compreender esse complexo ecossistema de natureza altamente dinâmica, onde iniciativas nascem e morrem do dia pra noite, e onde os contextos (sociais, políticos e econômicos) influenciam diretamente nas práticas locais."
  }
]

function createMap(){

	var nodes;
	var color;
	var color_scale;

	var rand_cod = Math.random();

 	if(rand_cod > 0.5){
		color_scale  = ['#adcc8f','#8a99d7'];
	}else{
		color_scale = ['#d87d7d','#cea86d'];
	}

	svg_map.selectAll("*").remove();

	////////////////////// map

	var padding = .1 // separation between same-color nodes

	var n = 200, // total number of nodes
  m = 5; // number of distinct clusters

	var color = d3.scale.linear()
	    .domain([0,m])
			.interpolate(d3.interpolateHcl)
		  .range(color_scale);

	var nodes = d3.range(n).map(function(d,i) {
	  var
			hex = color(Math.floor(Math.random()*m)),
      rds = 20 + Math.random()*200,
      obj = { radius: rds,  hex: hex};
	  return obj;
	});

	// Use the pack layout to initialize node positions.

	var force = d3.layout.force()
    .nodes(nodes)
    .gravity(.1)
  	.friction(0.2)
    .charge(0)
    .on("tick", tick)
    .start();

	var node = svg_map.selectAll("circle")
    .data(nodes)
  	.enter().append("circle")
    .style("fill", function(d) { return d.hex })

	node.transition()
    .duration(1000)
    .delay(function(d, i) { return i * 5; })
    .attrTween("r", function(d) {
      var i = d3.interpolate(0, d.radius);
      return function(t) { return d.radius = i(t); };
    });

	function tick(e) {
	  node
      .each(collide(.15))
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
	}

	// Resolves collisions between d and all other circles.
	function collide(alpha) {
	  var quadtree = d3.geom.quadtree(nodes);
	  return function(d) {
	    var r = d.radius + padding,
	        nx1 = d.x - r,
	        nx2 = d.x + r,
	        ny1 = d.y - r,
	        ny2 = d.y + r;
	    quadtree.visit(function(quad, x1, y1, x2, y2) {
	      if (quad.point && (quad.point !== d)) {
	        var x = d.x - quad.point.x,
	            y = d.y - quad.point.y,
	            l = Math.sqrt(x * x + y * y),
	            r = d.radius;
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

}

Template.home.onCreated(function(){
  this.showModal = new ReactiveVar(false);
  this.modalPage = new ReactiveVar(1);
});

Template.home.onRendered(function (){
  $('body').addClass('no_bg');

  $('#update_logo').hide()

  $(map).css({backgroundSize:'100%'});

  // SVG MAP
	svg_map_area = d3.select('#map')
		.append('svg')
		.attr('id', 'svg_map_area')

	svg_map = svg_map_area
		.append('g')
			.attr('opacity', 0.75)

  createMap();

  var win_w = $( window ).width();
  var win_h = $( window ).height();

  var rot = 0;
  rotation = setTimeout( function(){
    rotationDelay = setInterval(function(){
      rot += 0.02;
      svg_map.attr('transform', 'translate(' + win_w/2 + ', ' + win_h/2 + ') rotate(' + rot + ')');
    },10)
  }, 0);
});

Template.home.onDestroyed(function (){
  $('body').removeClass('no_bg');  
  $('#update_logo').show()
  clearInterval(rotation);
  clearTimeout(rotationDelay);
});

Template.home.helpers({
  modalPage: function(){
    return Template.instance().modalPage.get();
  },
  modalTitle: function() {
    return TAPi18n.__('presentation.'+Template.instance().modalPage.get()+'.title');
  },
  modalText: function() {
    return TAPi18n.__('presentation.'+Template.instance().modalPage.get()+'.text');
  }
});

Template.home.events({
  "click #explore": function(event, template){
     Router.go('map');
  },
  "click #about": function(event, template){
    // fade in
    $(curtain).fadeIn(duration);
    $(modal_home).fadeIn(duration);

    // fade out
    $(header).fadeOut(duration);
    $(home_newsletter).fadeOut(duration);
    $(update_logo_home).fadeOut(duration);
    $(quotes).fadeOut(duration);
    $(credit).fadeOut(duration);
    $(about).fadeOut(duration);
    $(explore).fadeOut(duration);
  },
  "click #modal_home_x": function(event, template) {
    // fade out
    $(curtain).fadeOut(duration);
  	$(modal_home).fadeOut(duration);

    // fade in
    $(header).fadeIn(duration);
    $(home_newsletter).fadeIn(duration);
  	$(update_logo_home).fadeIn(duration);
  	$(quotes).fadeIn(duration);
  	$(credit).fadeIn(duration);
  	$(about).fadeIn(duration);
  	$(explore).fadeIn(duration);
  },
  "click #modal_home_next": function(event, template) {
    var page = template.modalPage.get();
    if (page < 7) page += 1;
    if (page == 7) $(modal_home_next).css({opacity: 0.2, cursor: 'default'});
    if (page == 2) $(modal_home_prev).css({opacity: 1, cursor: 'pointer'});
    template.modalPage.set(page);
  },
  "click #modal_home_prev": function(event, template) {
    var page = template.modalPage.get();
    if (page > 1) page -= 1;
    if (page == 1) $(modal_home_prev).css({opacity: 0.2, cursor: 'default'});
    if (page == 6) $(modal_home_next).css({opacity: 1, cursor: 'pointer'});
    template.modalPage.set(page);
  },
  "click #update_logo_home": function() {
    createMap();
  }
});
