Template.list.onCreated(function() {
  if (!Session.get('currentContext'))
    Session.set('currentContext', 'signals');

});

Template.list.onRendered(function(){
  var bar_h = 80;

  $('body').addClass('light_bg');
  Template.instance().$('#list').css({ marginTop:bar_h+40, marginBottom:bar_h});

  $('#search_str').on('input', _.debounce(function(){
    var exploreConfig = JSON.parse(Session.get('exploreConfig'));
    var searchStr = $("#search_str").val().toUpperCase();

    exploreConfig.signals = _.map(exploreConfig.signals, function(i){
      if (i.name.toUpperCase().indexOf(searchStr) > -1) i.visible = true;
      else i.visible = false;
      return i;
    });

    exploreConfig.hubs = _.map(exploreConfig.hubs, function(i){
      if (i.name.toUpperCase().indexOf(searchStr) > -1) i.visible = true;
      else i.visible = false;
      return i;
    });

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
  listItems: function(){
    var exploreConfig = JSON.parse(Session.get('exploreConfig'));
    return exploreConfig[exploreConfig.context];
  }
});
