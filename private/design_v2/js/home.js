
var json,
	node,
	cur_code,
	scale;

// map vars

var svg_map_area;
var svg_map;

var svg_nodes;
var svg_force;
var svg_circles;

//////////////////////////////// OBJECTS ////////////////////////////////


reg('container');

reg('home');
reg('update_logo_home');
reg('quotes');
reg('about');
reg('explore');
reg('home_newsletter');
reg('credit_who');
reg('credit_what');

reg('curtain');
reg('modal_home');
reg('modal_home_box');
reg('modal_home_x');
reg('modal_home_next');
reg('modal_home_prev');
reg('modal_home_nav_pos');
reg('modal_home_title');
reg('modal_home_text');

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
				svg_map.attr('transform', 'translate(' + win_w/2 + ', ' + win_h/2 + ') rotate(' + rot + ')');
			},20)
		}, delay);
	}else{
		clearInterval(rotation);
		clearTimeout(rot_delay);
	}
}

$(map).css({backgroundSize:'100%'});


$(explore).on(bt_event, function(){
	navigate("chart.html", false);
});

function calc_radius(area){
	return 3 * Math.sqrt(area / Math.PI);
}

function get_hex(id, target){
	for(i in target){
		if(target[i].id == id) {
			return target[i].hex;
		}
	}
}

function check_radius(d){
	 if(cur_code == 'hub'){
			return calc_radius(d.signals.length);
	 }else{
		var n_hubs = 1; // minimum radius
		for(i in json.hubs){
			if( json.hubs[i].signals.indexOf(d.id) >= 0) n_hubs ++;
		}
		return calc_radius(n_hubs);
	}
}


function create_map(){

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


//////////////////////////////// home modal ////////////////////////////////

modal_home.pos = 0;

function modal_pos(pos){

	modal_home.pos = pos;

	$(modal_home_title).html(json.home_intro[pos].title);
	$(modal_home_text).html(json.home_intro[pos].text);
	$(modal_home_nav_pos).html( (modal_home.pos+1) + ' / ' + json.home_intro.length);

	if (pos == 0) $(modal_home_prev).css({opacity: 0.2, cursor:'default'});
	else $(modal_home_prev).css({opacity: 1, cursor:'pointer'});

	if (pos == json.home_intro.length-1) $(modal_home_next).css({opacity: 0.2, cursor:'default'});
	else  $(modal_home_next).css({opacity: 1, cursor:'pointer'});

}

$(modal_home_next).on(bt_event,function(){
	if(modal_home.pos < json.home_intro.length-1) modal_pos(modal_home.pos + 1)
})

$(modal_home_prev).on(bt_event,function(){
	if(modal_home.pos > 0) modal_pos(modal_home.pos - 1)
})

$(document).keyup(function(e) {
    if (e.keyCode == 27) {
	    if(modal_home.open) close_home_modal();
	  }
});

function open_home_modal(){
	modal_home.open = true;
	$(curtain).fadeIn(dur);
	$(modal_home).fadeIn(dur);
	$(update_logo_home).fadeOut(dur);
	$(quotes).fadeOut(dur);
	$(credit).fadeOut(dur);
	$(about).fadeOut(dur);
	$(explore).fadeOut(dur);
	$(home_newsletter).fadeOut(dur);
	modal_pos(0);
}

function close_home_modal(){
	modal_home.open = true;
	$(curtain).fadeOut(dur);
	$(modal_home).fadeOut(dur);
	$(update_logo_home).fadeIn(dur);
	$(quotes).fadeIn(dur);
	$(credit).fadeIn(dur);
	$(about).fadeIn(dur);
	$(explore).fadeIn(dur);
	$(home_newsletter).fadeIn(dur);
}

$(about).on(bt_event, open_home_modal);
$(modal_home_x).on(bt_event, close_home_modal);

//////////////////////////////// LOAD ////////////////////////////////


function load(){

	get_hex()

	console.log(json);

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
			.attr('opacity', 0.75)

	resize();
	create_map();

	map_rotation(0, true);

	// create contact bts in menu
	contact_bts(json.contact);


} // load


$(update_logo_home).on('click', create_map);

//////////////////////////////// LOAD EXTERNAL DATA ////////////////////////////////

$.ajax({
	url: 'data.json',
	dataType: 'json',
	success: function(data){
		json = data;
		load();

	}
});

//https://bl.ocks.org/mbostock/7882658
//https://github.com/mbostock/d3/wiki/Pack-Layout
