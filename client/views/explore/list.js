Template.list.onCreated(function() {
  if (!Session.get('currentContext'))
    Session.set('currentContext', 'signals');
});

Template.list.onRendered(function(){
  var bar_h = 80;

  $('body').addClass('light_bg');
  Template.instance().$('#list').css({ marginTop:bar_h+40, marginBottom:bar_h});
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
  isSignalContext: function(){
    var exploreConfig = JSON.parse(Session.get('exploreConfig'));
    return (exploreConfig.context == 'signals');
  },
  listItems: function(){
    var exploreConfig = JSON.parse(Session.get('exploreConfig'));
    return exploreConfig[exploreConfig.context];
  }
});
