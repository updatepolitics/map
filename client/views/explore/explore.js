Template.explore.onCreated(function() {
  this.currentView = new ReactiveVar('map');
  this.currentContext = new ReactiveVar('signals');
  this.showPopup = new ReactiveVar(false);
  this.showFilters = new ReactiveVar(false);
  this.showOriginsFilterOptions = new ReactiveVar(false);
  this.popupContent = new ReactiveVar();

  this.filters = new ReactiveVar();
  this.filters.signals = {
    origins: []
  };
});

/*
 * Helper functions
 */

function reachToRadius(reach) {
  var level = IncidencyReachs.findOne(reach).level;
  return 3 * Math.sqrt(level / Math.PI);
}

function setTooltip(title, val, color){
  if(title){
    $(tooltip_title).html(title);
    $(tooltip_value).html(val);
    $(tooltip).css({background:color}).show();
  }else{
    $(tooltip).hide();
  }
}

var delta_drag = 3;
var drag1 = [];
var drag2 = [];
var win_w;
var win_h;
var bar_h = 80;
var filter_h = 25;


function dragging() {
	return (
		( drag1[0] >= drag2[0] + delta_drag || drag1[0] <= drag2[0] - delta_drag  ) &&
		( drag1[1] >= drag2[1] + delta_drag || drag1[1] <= drag2[1] - delta_drag  )
	);
}


function resize_explore(){

	// $(popup_content).height($(popup).height() - 150);
	$(map_container).height(win_h - bar_h);
	$(filters).height(win_h - bar_h - 40);
	$(filters_list).height(win_h - bar_h - 97);

}


/*
 * Variables & Configs
 */

var scale = 5;
var zoom_factor = 1.5;
var zoom_limits = [1,30];
var dur = 350;
var dur2 = 550;
var svg_map_area;
var svg_map;
var data = {};
var nodes;
var pack = d3.layout.pack()
  .value(function(d) { return d.size; })
  .sort(function(a,b){ return a.value + b.value; })
  .padding(.3)
  .size([100, 100]);

/*
 * Data
 */

function getSignalData() {
  data.children = Themes.find({}).map(function(theme){
    var group = {
      id: theme._id,
      color: theme.color,
      node: theme,
      label: theme.en,
      name: theme.en,
      children: []
    }

    group.children = Signals.find({mainThemes: theme._id}).map(function(signal){
      return {
        id: signal._id,
        color: theme.color,
        group: group.name,
        node: signal,
        name: signal.name,
        label: signal.name,
        size: reachToRadius(signal.incidencyReach)
      }
    });

    return group;
  });

  nodes = pack.nodes(data);

}

function getHubData() {

  data = {};

  data.children = Natures.find({}).map(function(nature){
    var group = {
      id: nature._id,
      color: nature.color,
      node: nature,
      label: nature.en,
      name: nature.en,
      children: []
    }

    group.children = Hubs.find({nature: nature._id}).map(function(hub){
      return {
        id: hub._id,
        color: nature.color,
        group: group.name,
        node: hub,
        name: hub.name,
        label: hub.name,
        size: reachToRadius(hub.incidencyReach)
      }
    });

    return group;
  });


  nodes = pack.nodes(data);

}

/*
 * Map
 */

function refreshMap(template) {

  svg_map.selectAll('circle').remove();

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
			})
			.style('cursor', 'pointer')
			.on('mouseover', function(d){
				if(d.depth == 2){
					setTooltip(d.group, d.node.name, d.color);
				} else if(d.depth == 1) {
					setTooltip(d.label, '', d.color);
				}
			})
			.on('mouseout', function(d){
				setTooltip(false);
			})
			.on('click', function(d){
        if (!dragging()) {
          template.popupContent.set(d);
          template.showPopup.set(true);
        }
			})
		 	.transition().duration(1000)
			.attr('r', function(d) { return d.r } )

}

Template.explore.onRendered(function(){
  var self = this;

  /*
   *  Bind 'esc' key to popup close
   */

  $(document).keyup(function(e) {
    if (e.keyCode == 27) {
      e.preventDefault();
      self.showPopup.set(false);
    }
  });

  svg_map_area = d3.select('#map')
    .append('svg')
    .attr('id', 'svg_map_area');

  svg_map = svg_map_area
    .append('g')

  getSignalData();
  refreshMap(self);

  win_w = $(window).width();
  win_h = $(window).height();

  /*
   * Tool tip
   */

  $(window).mousemove(function( event ){
    mouse_x = event.clientX - $(tooltip).width()/2 - 30;
    mouse_y = event.clientY - 60;
    $(tooltip).css({ left:mouse_x, top:mouse_y });
  });

  /*
   * Zoom & Pan
   */

  var zoom = d3.behavior.zoom()
  		.scaleExtent(zoom_limits)
  		.center([win_w/2,win_h/2])
  		.on("zoom", function(){
        svg_map.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
      	scale = d3.event.scale;
      })
  		.translate([win_w/2,win_h/2])
  		.scale(scale);

  function center_group(c) {

  	var target = map_data[c];

  	scale = win_w/target.r/5;
  	if(scale > zoom_limits[1]) scale = zoom_limits[1];

  	var center_x = win_w/2 - ((target.x-50)*scale );
  	var center_y = win_h/2 - ((target.y-50)*scale );

  	zoom.translate([ center_x, center_y ]).scale(scale).event(svg_map.transition().duration(dur2));
  }

  function zoomed() {
  	svg_map.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
  	scale = d3.event.scale;
  }

  svg_map.on( "mousedown", function(){
  	drag1 = zoom.translate();
  });
  svg_map.on( "mouseup", function(){
  	drag2 = zoom.translate();
  });

	svg_map_area.on("mousedown.zoom", null);
	svg_map_area.on("mousemove.zoom", null);
	svg_map_area.on("dblclick.zoom", null);
	svg_map_area.on("touchstart.zoom", null);
	svg_map_area.on("wheel.zoom", null);
	svg_map_area.on("mousewheel.zoom", null);
	svg_map_area.on("MozMousePixelScroll.zoom", null);

	$(zoom_in).on('click', function(){
		if(scale < zoom_limits[1]){
			scale *= zoom_factor;
			zoom.scale(scale).event(svg_map.transition().duration(dur));
		}
	});

	$(zoom_ext).on('click', function(){
		scale = initial_scale;
		zoom.translate([win_w/2,win_h/2]).scale(scale).event(svg_map.transition().duration(dur2));
	});

	$(zoom_out).on('click', function(){
		if(scale > zoom_limits[0]){
			scale = scale/zoom_factor;
			zoom.scale(scale).event(svg_map.transition().duration(dur));
		}
	});

  zoom.translate([win_w/2,win_h/2]).scale(scale).event(svg_map);
  svg_map.attr("transform","translate( "+win_w/2+", "+win_h/2+" ) scale(" + scale + ")");

  svg_map_area.call(zoom);

  resize_explore();

});


Template.explore.helpers({
  showPopup: function(){
    return Template.instance().showPopup.get();
  },
  popupContent: function() {
    var d = Template.instance().popupContent.get();
    if (Template.instance().currentContext.get() == 'signals') {
      return Signals.findOne(d.id);
    } else {
      return Hubs.findOne(d.id);
    }
  },
  getOrigins: function() {
    var ids = this.placesOfOrigin;
    var origins = Origins
                    .find({ _id: { $in: ids }})
                    .map(function(item){
                      return item.en
                    });

    if (origins.length > 0) return origins.join(', ')
    else return '';
  },
  getIncidencyTypes: function() {
    var ids = this.incidencyTypes
    var types = IncidencyTypes
                  .find({ _id: { $in: ids }})
                  .map(function(type){
                    return type.en
                  });
    if (types.length > 0) {
      return types.join(', ')
    } else return '';
  },
  getReach: function(id) {
    var reach = IncidencyReachs.findOne(this.incidencyReach);
    return reach.en;
  },
  getPurpose: function(id) {
    var purpose = Purposes.findOne(this.purpose);
    return purpose.en;
  },
  hubControlOn: function() {
    if (Template.instance().currentContext.get() == 'hubs') {
      return 'on';
    }
  },
  signalControlOn: function() {
    if (Template.instance().currentContext.get() == 'signals') {
      return 'on';
    }
  },
  showFilters: function(){
    return Template.instance().showFilters.get();
  },
  filterCountStyle: function() {
    return 'opacity: 0.2;';
  },
  filterCount: function() {
    return 0;
  },
  showOriginsFilterOptions: function() {
    return Template.instance().showOriginsFilterOptions.get();
  },
  signalOriginsFilterOptions: function() {
    var originsId = [];
    Signals.find({}, {
      fields: { placesOfOrigin: true }
    }).forEach(function(signal){
      originsId = originsId.concat(signal.placesOfOrigin);
    });
    originsId = _.uniq(originsId);
    return Origins.find({_id: { $in: originsId }}, {$sort: { en: 1 } });
  }

});

Template.explore.events({
  "click #popup_x": function(event, template){
    template.showPopup.set(false);
  },
  "click #control_sig": function(event, template){
    getSignalData();
    refreshMap(template);
    template.currentContext.set('signals');
  },
  "click #control_hub": function(event, template){
    getHubData();
    refreshMap(template);
    template.currentContext.set('hubs');
  },
  "click #control_filters": function(event, template){
    $(filters).animate({right:20}, dur);
    template.showFilters.set(!template.showFilters.get());
  },
  "click #originsFilter": function(event, template){
    event.preventDefault();
    var ul = $(event.currentTarget).next();
    var lis = ul.children();
    var height = 30 + lis.length * filter_h;
    if (ul.height() > 0) ul.animate({height: 0 }, dur);
    else ul.animate({height: height }, dur);
  }
});