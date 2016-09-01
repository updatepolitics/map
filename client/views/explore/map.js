/*
 * onCreated
 */

Template.map.onCreated(function(){

  var instance = this;

  // local configuration
  instance.dur = 350;
  instance.dur2 = 550;

  if (Session.get('isMobile')) {
    instance.scale = instance.initial_scale = 2;
  } else {
    instance.scale = instance.initial_scale = 5;
  }

  instance.themes = Themes.find({});
  instance.natures = Natures.find({});

  /*
   * Helper functions
   */

  instance.reachToRadius = function (reach) {
    var level = IncidencyReachs.findOne(reach, {field: 'level'}).level;
    return 3 * Math.sqrt(level / Math.PI);
  }

  instance.centerMap = function() {
    var width = $(window).width();
    var height = $(window).height();
    var svg_map = instance.svg_map;

    instance.zoom
      .translate([width/2,height/2])
      .scale(instance.initial_scale)
      .event(
        instance.svg_map
          .transition()
          .duration(instance.dur2)
      );
  }

  instance.onResize = function() {


    var isMobile = Session.get('isMobile');
    var dbody = document.body;
  	instance.win_w = $( window ).width();
  	instance.win_h = $( window ).height();

    if (isMobile)
      bar_h = 50;
    else
      bar_h = 80;

    if (isMobile) {
      if (instance.win_w < instance.win_h) {
        $(dbody).addClass('port');
        $(dbody).removeClass('land');
        $(menu_bts).css({height: instance.win_h - 180, width: instance.win_w * 0.8 - 20});
      } else {
        $(dbody).removeClass('port');
        $(dbody).addClass('land');
        $(menu_bts).css({height: instance.win_h - 80, width: '75%' });
      }

      if (!menu.open)
        $(menu).css({left: -instance.win_w*0.8 });
    } else {
      if (instance.win_w > 1200)
        $(dbody).addClass('layout2');
      else
        $(dbody).removeClass('layout2');
    }

    instance.centerMap();

  }
});

Template.map.onRendered(function(){

  var instance = this;

  // remove background
  $('body').addClass('no_bg');

  // set mobile class
  if (Session.get('isMobile'))
    $(document.body).addClass('mobile');

  /*
   * Reset view when rendered
   */
  Session.set('mapHelpIsOpen', false);
  Session.set('tooltipIsOpen', false);
  Session.set('tooltipIsPositioned', false);

  /*
   * Center map triggered after window resize
   */
  $(window).on('resize', instance.onResize );

  /*
   * Helper functions
   */

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

  /*
   * Variables & Configs
   */

  instance.zoom_limits = [1,30];
  var zoom_factor = 1.5;
  var dur = instance.dur;
  var dur2 = instance.dur2;
  var svg_map_area;
  // var svg_map;
  var data = {};
  var nodes;
  var pack = d3.layout.pack()
    .value(function(d) { return d.size; })
    .sort(function(a,b){ return a.value + b.value; })
    .padding(.3)
    .size([100, 100]);

  /*
   * Map
   */

  svg_map_area = d3.select('#map')
    .append('svg')
    .attr('id', 'svg_map_area');

  instance.svg_map = svg_map_area
    .append('g')

  instance.circlesCoordinates = {};

  win_w = $(window).width();
  win_h = $(window).height();

  /*
   * Tool tip
   */

  $(window).mousemove(function( event ){
    // only set tooltip when there is mousemove event
    // otherwise can't get mouse position
    if (Session.get('tooltipIsOpen')) {
      mouse_x = event.clientX - $(tooltip).width()/2 - 30;
      mouse_y = event.clientY - 60;
      $(tooltip).css({
        left: mouse_x,
        top: mouse_y
      });
      Session.set('tooltipIsPositioned', true);
    }
  });

  /*
   * Zoom & Pan
   */

  instance.zoom = d3.behavior.zoom()
  		.scaleExtent(instance.zoom_limits)
  		.center([win_w/2,win_h/2])
  		.on("zoom", function(){
        instance.svg_map.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
      	instance.scale = d3.event.scale;
      })
  		.translate([win_w/2,win_h/2])
  		.scale(instance.scale);

  function center_group(c) {

  	var target = map_data[c];

  	instance.scale = win_w/target.r/5;
  	if( instance.scale > instance.zoom_limits[1]) instance.scale = instance.zoom_limits[1];

  	var center_x = win_w/2 - ((target.x-50) * instance.scale );
  	var center_y = win_h/2 - ((target.y-50) * instance.scale );

  	instance.zoom.translate([ center_x, center_y ]).scale(instance.scale).event(instance.svg_map.transition().duration(dur2));
  }

  function zoomed() {
  	instance.svg_map.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
  	instance.scale = d3.event.scale;
  }

  instance.svg_map.on( "mousedown", function(){
  	drag1 = instance.zoom.translate();
  });
  instance.svg_map.on( "mouseup", function(){
  	drag2 = instance.zoom.translate();
  });

	svg_map_area.on("mousedown.zoom", null);
	svg_map_area.on("mousemove.zoom", null);
	svg_map_area.on("dblclick.zoom", null);
	svg_map_area.on("touchstart.zoom", null);
	svg_map_area.on("wheel.zoom", null);
	svg_map_area.on("mousewheel.zoom", null);
	svg_map_area.on("MozMousePixelScroll.zoom", null);

	$(zoom_in).on('click', function(){
		if ( instance.scale < instance.zoom_limits[1] ){
			instance.scale *= zoom_factor;
			instance.zoom.scale(instance.scale).event(instance.svg_map.transition().duration(dur));
		}
	});

	$(zoom_out).on('click', function(){
		if (instance.scale > instance.zoom_limits[0]){
			instance.scale = instance.scale / zoom_factor;
			instance.zoom.scale(instance.scale).event(instance.svg_map.transition().duration(dur));
		}
	});

  instance.zoom.translate([win_w/2,win_h/2]).scale(instance.scale).event(instance.svg_map);
  instance.svg_map.attr("transform","translate( "+win_w/2+", "+win_h/2+" ) scale(" + instance.scale + ")");

  svg_map_area.call(instance.zoom);

  /*
   * Update map when context or filters change
   */
  instance.autorun(function(){

    // Load filters and context
    var language = TAPi18n.getLanguage();
    var context = Session.get('currentContext');
    var filters = JSON.parse(Session.get('filters'));
    filters = _.extend(filters['general'], filters[context]);

    // update data
    if (context == 'signals') {
      nodes = pack.nodes({
        children: instance.themes.map(function(theme){
          var group = {
            id: theme._id,
            color: theme.color,
            node: theme,
            label: theme[language],
            name: theme[language],
            children: []
          }

          group.children = Signals.find({
            mainThemes: theme._id
          }).map(function(signal){
            return {
              id: signal._id,
              color: theme.color,
              group: group.name,
              node: signal,
              name: signal.name,
              label: signal.name,
              size: instance.reachToRadius(signal.incidencyReach)
            }
          });

          return group;
        })
      })
    } else {
      nodes = pack.nodes({
        children: instance.natures.map(function(nature){
          var group = {
            id: nature._id,
            color: nature.color,
            node: nature,
            label: nature[language],
            name: nature[language],
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
              size: instance.reachToRadius(hub.incidencyReach)
            }
          });
          return group;
        })
      });
    }

    // if map is defined, update it
    if (instance.svg_map) {
      instance.svg_map.selectAll('circle').remove();

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

      var selectedCount = 0;

      instance.svg_map.selectAll('circle')
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
                  d.circle.attr('opacity', 1)
                  selectedCount++;
                } else {
                  d.circle.attr('opacity', .1)
                }
              }
            } else if (d.depth == 1) {
              instance.circlesCoordinates[d.id] = _.pick(d, 'r', 'x', 'y');
            }
    			})
    			.style('cursor', 'pointer')
    			.on('mouseover', function(d){
    				if ( d.depth == 2 ){
              Session.set({
                tooltipIsOpen: true,
                tooltipTitle: d.group,
                tooltipSubtitle: d.node.name,
                tooltipColor: d.color
              });
    				} else if ( d.depth == 1 ) {
              Session.set({
                tooltipIsOpen: true,
                tooltipTitle: d.label,
                tooltipSubtitle: '',
                tooltipColor: d.color
              });
    				}
    			})
    			.on('mouseout', function(d){
            Session.set('tooltipIsOpen', false);
    			})
    			.on('click', function(d){
            if (!dragging()) {
              if (d.depth == 2) {
                Session.set('popupContent', JSON.stringify(d.node));
                Session.set('showPopup', true);
              }
            }
    			})
    		 	// .transition().duration(1000)
    			.attr('r', function(d) { return d.r } )

        Session.set('selectedCount', selectedCount);
    }
  });
}); // end onRendered

Template.map.onDestroyed(function(){
  $('body').removeClass('no_bg');
  // remove event trigger for tooltip
  $(window).off("mousemove");
  $(window).off('resize');

});

Template.map.helpers({
  tooltipTitle: function() {
    return Session.get('tooltipTitle') || "";
  },
  tooltipSubtitle: function() {
    return Session.get('tooltipSubtitle') || "";
  },
  tooltipStyle: function() {
    if (Session.get('tooltipIsPositioned') && Session.get('tooltipIsOpen'))
      return 'display: block; background: ' + Session.get('tooltipColor') + ';'
    else
      return 'display: none;';
  },
  mapHelpIsOpen: function(){
    return Session.get('mapHelpIsOpen');
  },
  legendList: function(){
    var context = Session.get('currentContext');
    var language = TAPi18n.getLanguage();
    var sortBy = {};
    sortBy[language] = 1;

    if (context == 'signals')
      return Themes.find({}, {sort: sortBy});
    else
      return Natures.find({}, {sort: sortBy});
  }
}); // end helpers

Template.map.events({
  "click #zoom_ext": function(event, template){
    template.centerMap();
  },
  "click .legend": function(event, template) {
    var self = this;
    var target = template.circlesCoordinates[self._id];

    var win_w = $(window).width();
    var win_h = $(window).height();
    var scale = win_w / target.r / 5;
    var zoom_limits = template.zoom_limits;
    var dur2 = template.dur2;

  	if ( scale > zoom_limits[1] ) scale = zoom_limits[1];

  	var center_x = win_w/2 - (( target.x - 50) * scale );
  	var center_y = win_h/2 - (( target.y - 50) * scale );

  	template.zoom
      .translate([ center_x, center_y ])
      .scale(scale)
      .event(template.svg_map.transition().duration(dur2));

  },
  "click #legend_bts": function(event, template){

    // set legend height
    var itemsCount;
    if (Session.get('currentContext') == 'signals')
      itemsCount = template.themes.count();
    else
      itemsCount = template.natures.count();
    $(legends).height(50 + itemsCount * 20 );

    // open legend
    $(legends).fadeIn(template.dur);
  },
  "click #legends_x": function(event, template) {
    // close legend
    $(legends).fadeOut(template.dur);
  }
});
