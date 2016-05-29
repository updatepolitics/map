var dur = 350;
var filter_h = 25;

Template.filterPanel.onRendered(function(){
  // trigger resize
  Session.set("resize", new Date());

  $('ul.group').height(0);
});

Template.filterPanel.helpers({
  resize: function(){
    var height = $(window).height();

    $('#filters').height(height - 80 - 40);
  	$('#filters_list').height(height - 80 - 97);

    return Session.get('resize');
  },
  filterCount: function () {
    var exploreConfig = JSON.parse(Session.get('exploreConfig'));
    var context = exploreConfig.context;
    return exploreConfig.filterCount[context];
  },
  filterGroups: function() {
    var exploreConfig = JSON.parse(Session.get('exploreConfig'));
    var filters = exploreConfig.filters.general;
    var currentContext = exploreConfig.context;
    if (currentContext == 'signals') {
      filters = _.extend(filters, exploreConfig.filters.signals);
    } else {
      filters = _.extend(filters, exploreConfig.filters.hubs);
    }

    return _.keys(filters);
  },
  filterGroupCount: function(id) {
    var exploreConfig = JSON.parse(Session.get('exploreConfig'));
    var filters = exploreConfig.filters.general;
    var currentContext = exploreConfig.context;
    if (currentContext == 'signals') {
      filters = _.extend(filters, exploreConfig.filters.signals);
    } else {
      filters = _.extend(filters, exploreConfig.filters.hubs);
    }

    return _.where(filters[id], {selected: true}).length;
  },
  filterGroupOptions: function(filterGroup) {
    var language = TAPi18n.getLanguage();
    var exploreConfig = JSON.parse(Session.get('exploreConfig'));
    var filters = exploreConfig.filters.general;
    if (exploreConfig.context == 'signals')
      filters = _.extend(filters, exploreConfig.filters.signals);
    else
      filters = _.extend(filters, exploreConfig.filters.hubs);

    return _.map(_.keys(filters[filterGroup]), function(i){
      var option = filters[filterGroup][i];
      option.name = option[language];
      option.filterGroup = filterGroup;
      return option;
    });
  }
});

Template.filterPanel.events({
  "click .filter_title": function(event, template){
    event.preventDefault();

    var target = $(event.currentTarget);

    var ul = target.next();
    var lis = ul.children();
    var height = 30 + lis.length * filter_h;
    if (ul.height() > 0) {
      ul.animate({height: 0 }, dur);
      target.css({ backgroundImage: 'url(layout/plus_white.png)'});
    } else {
      ul.animate({height: height }, dur);
      target.css({ backgroundImage: 'url(layout/minus_white.png)'});
    }
  },
  "click .filter": function(event, template) {
    event.preventDefault();
    var exploreConfig = JSON.parse(Session.get('exploreConfig'));
    var context = exploreConfig.context;
    var query = exploreConfig.query || {};

    var self = this;

    var target = $(event.target);

    if (self.selected) {
      self.selected = false;
      target.removeClass('selected').css({opacity: 0.3 });

      query[self.filterGroup] = _.without(query[self.filterGroup], self._id);
      if (query[self.filterGroup].length == 0) delete query[self.filterGroup];
    } else {
      self.selected = true;
      target.addClass('selected').css({opacity: 1 });
      if (!query[self.filterGroup]) query[self.filterGroup] = [];
      query[self.filterGroup].push(self._id);
    }

    // filter is context specific
    if (exploreConfig.filters[context][self.filterGroup]) {
      exploreConfig.filters[context][self.filterGroup][self._id].selected = self.selected;
      exploreConfig.filterCount[context] += self.selected ? 1 : -1;
      var filtercount = exploreConfig.filterCount[context];

    // filter is for general context
    } else {
      exploreConfig.filters['general'][self.filterGroup][self._id].selected = self.selected;
      exploreConfig.filterCount['hubs'] += self.selected ? 1 : -1;
      exploreConfig.filterCount['signals'] += self.selected ? 1 : -1;
    }

    // Build signal query

    if (exploreConfig.filterCount['signals'] > 0) {
      var signalQuery = {};
      if (query.placesOfOrigin) signalQuery.placesOfOrigin = {$in: query.placesOfOrigin};
      if (query.incidencyReach) signalQuery.incidencyReach = {$in: query.incidencyReach};
      if (query.mainThemes) signalQuery.mainThemes = {$in: query.mainThemes};
      if (query.purpose) signalQuery.purpose = {$in: query.purpose};
      if (query.technologyType) signalQuery.technologyType = {$in: query.technologyType};
      if (query.mechanisms) {
        signalQuery.methods = {
          $in: Methods
                .find({mechanism: {$in: query['mechanisms']}}, {fields: {_id: true}})
                .map(function(i) {return i._id} )
        }
      }
      var signalIds = Signals
        .find(signalQuery, {fields: {_id: true}})
        .map(function(i) {return i._id} );

      exploreConfig.signals = _.map(exploreConfig.signals, function(i){
        i.visible = _.contains(signalIds, i._id);
        return i;
      })
    } else {
      exploreConfig.signals = _.map(exploreConfig.signals, function(i){
        i.visible = true;
        return i;
      })
    }

    if (exploreConfig.filterCount['hubs'] > 0) {
      var hubQuery = {};
      if (query.placesOfOrigin) hubQuery.placesOfOrigin = {$in: query.placesOfOrigin};
      if (query.incidencyReach) hubQuery.incidencyReach = {$in: query.incidencyReach};
      if (query.nature) hubQuery.nature = {$in: query.nature};
      if (query.isSponsor) hubQuery.isSponsor = {$in: query.isSponsor};

      var hubIds = Hubs
        .find(hubQuery, {fields: {_id: true}})
        .map(function(i) {return i._id} );

      exploreConfig.hubs = _.map(exploreConfig.hubs, function(i){
        i.visible = _.contains(hubIds, i._id);
        return i;
      })
    } else {
      exploreConfig.hubs = _.map(exploreConfig.hubs, function(i){
        i.visible = true;
        return i;
      })
    }

    exploreConfig.query = query;
    Session.set('exploreConfig', JSON.stringify(exploreConfig));
  },
  "click #filters_x": function(event, template) {
    event.stopImmediatePropagation();
    var target = $(filters);

    var showFilterPanel = !Session.get('showFilterPanel');

    if (showFilterPanel) {
      target.animate({ right: 20}, 350);
    } else {
      target.animate({ right: -350}, 350);
    }

    Session.set('showFilterPanel', showFilterPanel);
  },
  "click #trash": function(event, template) {
    event.stopImmediatePropagation();

    var exploreConfig = JSON.parse(Session.get('exploreConfig'));
    var filters = exploreConfig.filters;

    _.each(_.keys(filters), function (type) {
      _.each(_.keys(filters[type]), function(group){
        _.each(_.keys(filters[type][group]), function(id){
          filters[type][group][id].selected = false;
        })
      })
    })

    exploreConfig.filters = filters;

    Session.set('exploreConfig', JSON.stringify(exploreConfig));

  }
});
