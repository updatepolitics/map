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

    // $('#filters').height(height - 80 - 40);
  	$('#filters_list').height( $('#filters').height() - 57 );

    return Session.get('resize');
  },
  filterGroupOpacity: function(filterGroup) {
    var context = Session.get('currentContext');
    var filters = JSON.parse(Session.get('filters'));

    filters = _.extend(filters['general'], filters[context]);

    var count = _.where(filters[filterGroup], {selected: true}).length;
    return (count > 0 ? 1 : 0.3);
  },
  filterGroupCount: function(filterGroup) {
    var context = Session.get('currentContext');
    var filters = JSON.parse(Session.get('filters'));

    filters = _.extend(filters['general'], filters[context]);

    return _.where(filters[filterGroup], {selected: true}).length;
  },
  filterGroupOptions: function(filterGroup) {
    var language = TAPi18n.getLanguage();

    // get filters for current context
    var context = Session.get('currentContext');
    var filters = JSON.parse(Session.get('filters'));
    filters = _.extend(filters['general'], filters[context]);

    // check if filtergroup is defined for current filters
    if (filters[filterGroup])
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
      target.css({ backgroundImage: 'url(../layout/plus_white.png)'});
      ul.animate({height: 0 }, dur);
    } else {
      target.css({ backgroundImage: 'url(../layout/minus_white.png)'});
      ul.animate({height: height }, dur);
    }
  },
  "click .filter": function(event, template) {
    var self = this;
    event.preventDefault();

    var context = Session.get('currentContext');
    var filters = JSON.parse(Session.get('filters'));
    var filterCount = JSON.parse(Session.get('filterCount'));

    var target = $(event.target);

    if (self.selected) {
      self.selected = false;
      target.removeClass('selected').css({opacity: 0.3 });
    } else {
      self.selected = true;
      target.addClass('selected').css({opacity: 1 });
    }

    // filter is context specific
    if (filters[context][self.filterGroup]) {
      filters[context][self.filterGroup][self._id].selected = self.selected;
      filterCount[context] += self.selected ? 1 : -1;

    // filter is for general context
    } else {
      filters['general'][self.filterGroup][self._id].selected = self.selected;
      filterCount['hubs'] += self.selected ? 1 : -1;
      filterCount['signals'] += self.selected ? 1 : -1;
    }

    Session.set('filters', JSON.stringify(filters))
    Session.set('filterCount', JSON.stringify(filterCount))

  },
  "click #filters_x": function(event, template) {
    event.stopImmediatePropagation();
    var target = $(filters);

    var showFilterPanel = !Session.get('showFilterPanel');

    if (showFilterPanel) {
      target.animate({ right: 0}, 350);
    } else {
      target.animate({ right: (-1 * $('#filters').width()) }, 350);
    }
    
    Session.set('showFilterPanel', showFilterPanel);
  },
  "click #trash": function(event, template) {
    event.preventDefault();

    var filters = JSON.parse(Session.get('filters'));

    _.each(_.keys(filters), function (type) {
      _.each(_.keys(filters[type]), function(group){
        _.each(_.keys(filters[type][group]), function(id){
          filters[type][group][id].selected = false;
        })
      })
    })

    Session.set('filters', JSON.stringify(filters));
    Session.set('filterCount', JSON.stringify({
      signals: 0,
      hubs: 0
    }));

  }
});
