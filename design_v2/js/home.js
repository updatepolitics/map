
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
