Template.list.onCreated(function() {
  if (!Session.get('currentContext'))
    Session.set('currentContext', 'signals');

});

Template.list.onRendered(function(){
  var bar_h = 80;

  $('body').addClass('light_bg');
  Template.instance().$('#list').css({ marginTop:bar_h+40, marginBottom:bar_h});

  $('#search_str').on('input', _.debounce(function(){
    var searchStr = $("#search_str").val();
    var exploreConfig = JSON.parse(Session.get('exploreConfig'));
    exploreConfig.searchStr = searchStr;

    if (searchStr == "") $("#search_x").hide();
    else $("#search_x").show();

    Session.set('exploreConfig', JSON.stringify(exploreConfig));

  }, 200) );
});

Template.list.onDestroyed(function(){
  var bar_h = 80;

  $('body').removeClass('light_bg');
});

Template.list.helpers({
  originsLabel: function(){
    var language = TAPi18n.getLanguage();
    return this.labels.placesOfOrigin[language];
  },
  purposeLabel: function(){
    var language = TAPi18n.getLanguage();
    return this.labels.purpose[language];
  },
  incidencyReachLabel: function(){
    var language = TAPi18n.getLanguage();
    return this.labels.incidencyReach[language];
  },
  technologyTypeLabel: function(){
    var language = TAPi18n.getLanguage();
    return this.labels.technologyType[language];
  },
  listItems: function(){
    var exploreConfig = JSON.parse(Session.get('exploreConfig'));
    var items = exploreConfig[exploreConfig.context];
    var searchStr = exploreConfig.searchStr;

    // filter matching items
    if (searchStr) {
      searchStr = searchStr.toUpperCase();
      return _.map(items, function(i){
        if (i.visible && !(i.name.toUpperCase().indexOf(searchStr) > -1)) i.visible = false;
        return i;
      });
    } else return items;
  }
});
