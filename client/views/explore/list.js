/*
 * List View
 */

Template.list.onRendered(function(){
  var bar_h = 80;

  $('body').addClass('light_bg');

  $('#search_str').on('input', _.debounce(function(){
    var searchStr = $("#search_str").val();

    if (searchStr == "") $("#search_x").hide();
    else $("#search_x").show();

    Session.set('searchStr', searchStr);
  }, 200) );

  Session.set('searchStr', '');
});

Template.list.onDestroyed(function(){
  var bar_h = 80;

  $('body').removeClass('light_bg');
});

/*
 * List initiatives
 */

Template.infiniteList.helpers({
  listItems: function(){
    var context = Session.get('currentContext');
    var filters = JSON.parse(Session.get('filters'));
    filters = _.extend(filters['general'], filters[context]);
    var query = {};

    var searchStr = Session.get('searchStr');
    if (searchStr != "") {
      check(searchStr, String);
      query['name'] = { $regex: searchStr, $options: 'i' };
    }

    // build query for mongodb
    _.each(_.keys(filters), function(property){
      var selected = _.filter(filters[property], function(i){ return i.selected })
      if (selected.length) {
        if (property != 'mechanisms')
          query[property] = { $in: _.map(selected, function(s){ return s._id }) }
        else {
          mechanismIds = _.map(selected, function(s){ return s._id });
          query['methods'] = {
            $in: Methods
              .find({mechanism: {$in: mechanismIds}}, {fields: {_id: true}})
              .map(function(i) {return i._id} )
            }
        }
      }
    });

    // get items
    var items;
    if (context == 'signals') {
      items = Signals.find(query, {
        sort: { name: 1},
        fields: {
          name: 1,
          description_en: 1,
          description_es: 1,
          description_pt: 1,
          website: 1,
          labels: 1
        }
      }).fetch();
    } else {
      items = Hubs.find(query, {
        sort: { name: 1},
        fields: {
          name: 1,
          description_en: 1,
          description_es: 1,
          description_pt: 1,
          website: 1,
          labels: 1
        }
      }).fetch();
    }

    Session.set('selectedCount', items.length);

    return items;
  }
});

Template.list.events({
  "click #search_x": function(){
    $("#search_str").val('');
    Session.set('searchStr', '');
  }
});
