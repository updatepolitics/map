
Template.explore.rendered = function(){

  function reachToRadius(reach) {
    var level = IncidencyReachs.findOne(reach).level;
    return 3 * Math.sqrt(level / Math.PI);
  }

  var scale = 5;
  var zoom_factor = 1.5;
  var zoom_limits = [1,30];

  var svg_map_area = d3.select('#map')
    .append('svg')
    .attr('id', 'svg_map_area');

  var svg_map = svg_map_area
    .append('g');

  var pack = d3.layout.pack()
    .value(function(d) { return d.size; })
    .sort(function(a,b){ return a.value + b.value; })
    .padding(.3)
    .size([100, 100]);

  // define hierarchy

  var data = {};
  data.children = Themes.find({}).map(function(theme){
    var group = {
      id: theme._id,
      color: theme.color,
      node: theme,
      name: theme.en,
      children: []
    }

    group.children = Signals.find({mainThemes: theme._id}).map(function(signal){
      return {
        id: signal._id,
        color: theme.color,
        group: group.name,
        name: signal.name,
        label: signal.name,
        size: reachToRadius(signal.incidencyReach)
      }
    });

    return group;
  });

  var nodes = pack.nodes(data);

  // init map

  svg_map_area = d3.select('#map')
    .append('svg')
    .attr('id', 'svg_map_area');

  svg_map = svg_map_area
    .append('g')

  svg_map.selectAll('circle')
		.data(nodes)
		.enter()
			.append('circle')
			.attr('cx', function(d) { return d.x })
			.attr('cy', function(d) { return d.y })
			.attr('transform','translate(-50 -50)')
			.attr('r', 0 )
			.attr('stroke-width', '0')
			.attr('opacity', function(d){
				if(d.depth == 1) return 0.1;
				if(d.depth == 2) return 1;
			})
			.attr('id', function (d){
				return 'c' + d.id;
			})
			.attr('fill', function (d){
				if (d.name) return d.color;
				else return 'none';
			})
			.each(function (d, i) {
				c = d3.select(this);
				c.node = d.node;
				c.d = d;
				d.circle = c;
				// if(d.depth == 1) {
				// 	map_data['c'+d.id] = d;
				// }
			})
			.style('cursor', 'pointer')
	// 		.on('mouseover', function(d){
	// 			if(!mobile){
	// 				if(d.depth == 2){
	// 					if(d.node.visible) tt(d.group, d.node.name, d.hex);
	// 					else tt(d.group, d.node.name, gray);
	// 				}
	// 				if(d.depth == 1){
	// 					tt(d.node.label, '', d.hex);
	// 				}
	// 			}
	// 		})
	// 		.on('mouseout', function(d){
	// 			if(!mobile){
	// 				tt(false);
	// 			}
	// 		})
			.on('click', function(d){
				if(!dragging() && d.depth == 1) open_popup_group(d.node);
				if(!dragging() && d.depth == 2) open_popup(d.node);
			})
		 	.transition().duration(1000)
			.attr('r', function(d) { return d.r } )

  var win_w = $(window).width();
  var win_h = $(window).height();

  var zoom = d3.behavior.zoom()
  		.scaleExtent(zoom_limits)
  		.center([win_w/2,win_h/2])
  		.on("zoom", function(){
        svg_map.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
      	scale = d3.event.scale;
      })
  		.translate([win_w/2,win_h/2])
  		.scale(scale);

  zoom.translate([win_w/2,win_h/2]).scale(scale).event(svg_map);
  svg_map.attr("transform","translate( "+win_w/2+", "+win_h/2+" ) scale(" + scale + ")");

}
