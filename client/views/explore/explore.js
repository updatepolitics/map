Meteor.Spinner.options = {
  color: '#fff'
}

Template.explore.onCreated(function() {
  var self = this;

  self.currentView = new ReactiveVar('map');
  self.currentContext = new ReactiveVar('signals');
  self.showPopup = new ReactiveVar(false);
  self.showFilters = new ReactiveVar(false);
  self.showOriginsFilterOptions = new ReactiveVar(false);
  self.popupContent = new ReactiveVar();

  /*
   * FILTERS SETUP
   */

  var filters = {
    general: {
      placesOfOrigin: {},
      incidencyReach: {},
    },
    signals: {
      mainThemes: {},
      mechanisms: {},
      purpose: {},
      technologyType: {},
    },
    hubs: {
      nature: {},
      isSponsor: {
        'true': {
          _id: true,
          pt: 'Sim',
          selected: false
        },
        'false': {
          _id: false,
          pt: 'Não',
          selected: false
        }
      }
    }
  }

  // avoid huge list of origins
  var placesOfOrigin = [];
  Signals.find({}, {
    fields: {
      placesOfOrigin: true
    }
  }).forEach(function(signal){
    placesOfOrigin =
      placesOfOrigin.concat(signal.placesOfOrigin);
  });

  Hubs.find({}, {
    fields: {
      placesOfOrigin: true
    }
  }).forEach(function(hub){
    placesOfOrigin =
      placesOfOrigin.concat(hub.placesOfOrigin);
  });

  var placesOfOriginOptions = [];
  Origins
    .find({_id: {$in: _.uniq(placesOfOrigin)}})
    .forEach(function(i){
      i.selected = false;
      filters.general.placesOfOrigin[i._id] = i;
    });

  IncidencyReachs
    .find({})
    .forEach(function(i){
      i.selected = false;
      filters.general.incidencyReach[i._id] = i;
    });

  TechnologyTypes
    .find({})
    .forEach(function(i){
      i.selected = false;
      filters.signals.technologyType[i._id] = i;
    });

  Themes
    .find({})
    .forEach(function(i){
      i.selected = false;
      filters.signals.mainThemes[i._id] = i;
    });

  Mechanisms
    .find({})
    .forEach(function(i){
      i.selected = false;
      filters.signals.mechanisms[i._id] = i;
    });

  Purposes
    .find({})
    .forEach(function(i){
      i.selected = false;
      filters.signals.purpose[i._id] = i;
    });


  Natures
    .find({})
    .forEach(function(i){
      i.selected = false;
      filters.hubs.nature[i._id] = i;
    });

  var exploreConfig = {
    context: 'signals',
    filterCount: {
      signals: 0,
      hubs: 0
    },
    filters: filters
  }

  Session.set('exploreConfig', JSON.stringify(exploreConfig));


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
      label: theme.pt,
      name: theme.pt,
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
      label: nature.pt,
      name: nature.pt,
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

function refreshMap(template, filters) {

  if (svg_map) {
    svg_map.selectAll('circle').remove();

    if (filters) {

      var selectedFilters = {};
      var fields = _.keys(filters);

      // get filters ids into arrays
      _.each(fields, function(field){
        var fieldValues = [];
        _.each(filters[field], function(f){
          if (f.selected) fieldValues.push(f._id);
        })
        if (fieldValues.length > 0) {
          selectedFilters[field] = fieldValues;
        }
      });


      // get methods after mechanisms
      if (selectedFilters['mechanisms']) {
        selectedFilters['methods'] = Methods
          .find({mechanism: {$in: selectedFilters['mechanisms']}}, {fields: {_id: true}})
          .map(function(i) {return i._id} );

        delete selectedFilters.mechanisms;
      }

      var isSponsor = _.map(_.where(filters['isSponsor'], {selected: true}), function(i){return i._id});
      if (isSponsor.length > 0) {
        selectedFilters['isSponsor'] = isSponsor;
      }

      fields = _.keys(selectedFilters);

    }

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

          if (d.depth == 2) {
            if (filters) {

              var selected = true;

              // check if node belongs to all filters
              _.each(fields, function(field){

                if (selected && !_.intersection(selectedFilters[field], [].concat( d.node[field] )).length) {
                  selected = false
                }
              });

              if (selected) {
                d.circle
                  .attr('opacity', 1)
              } else {
                d.circle
                  .attr('opacity', .1)
              }


            }
          }



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
  		 	// .transition().duration(1000)
  			.attr('r', function(d) { return d.r } )


  }

}

function applyFilters(filters) {

  if (!filters) return;
  console.log('applyFilters');
  console.log(filters);

  var selectedFilters = {};
  var fields = _.keys(filters);

  // get filters ids into arrays
  _.each(fields, function(field){
    var fieldValues = [];
    _.each(filters[field], function(f){
      if (f.selected) fieldValues.push(f._id);
    })
    if (fieldValues.length > 0) {
      selectedFilters[field] = fieldValues;
    }
  });

  // get methods after mechanisms
  if (selectedFilters['mechanisms']) {
    selectedFilters['methods'] = Methods
      .find({mechanism: {$in: selectedFilters['mechanisms']}}, {fields: {_id: true}})
      .map(function(i) {return i._id} );

    delete selectedFilters.mechanisms;
  }

  fields = _.keys(selectedFilters);

  console.log('selectedFilters');
  console.log(selectedFilters);

  // if map has been drawn
  if (svg_map) {
    svg_map.selectAll('circle')
      .each( function (d, i) {
        if (d.depth == 2) {
          var selected = true;

          // check if node belongs to all filters
          _.each(fields, function(field){
            if (selected && !_.intersection(selectedFilters[field], [].concat( d.node[field] )).length) {
              selected = false
            }
          });

          if (selected) {
            d.circle
              .transition()
              .duration(dur/2)
              .attr('opacity', 1)
          } else {
            d.circle
              .transition()
              .duration(dur/2)
              .attr('opacity', .1)
          }
        }
      });
  }



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
  signalContext: function() {
    var exploreConfig = JSON.parse(Session.get('exploreConfig'));
    return (exploreConfig.context == 'signals') ? true : false;
  },
  changeContext: function() {
    var context = Session.get('currentContext');

    var exploreConfig = JSON.parse(Session.get('exploreConfig'));
    var filters = exploreConfig.filters.general;
    var currentContext = exploreConfig.context;

    if (currentContext == 'signals') {
      filters = _.extend(filters, exploreConfig.filters.signals);
      getSignalData();
    } else {
      filters = _.extend(filters, exploreConfig.filters.hubs);
      getHubData();
    }

    refreshMap(Template.instance(), filters);
    Session.set('currentContext', currentContext);
  },
  showPopup: function(){
    return Template.instance().showPopup.get();
  },
  popupContent: function() {
    var d = Template.instance().popupContent.get();
    d.visible = (d.depth == 2) ? true : false;
    return d;
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
  filterTargetFields: function() {
    var context = Template.instance().currentContext.get();
    var filters = Template.instance().filters.get()[context];

    return _.map( _.keys(filters), function(i){
      return {
        id: i,
        options: filters[i]
      }
    });
  }
});

Template.explore.events({
  "click #popup_x": function(event, template){
    template.showPopup.set(false);
  }
});
