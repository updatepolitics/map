Template.viewControl.onCreated(function(){
  Session.setDefault("showFilterPanel", false);
  Session.setDefault("currentContext", 'signals');
  Session.setDefault("filterCount", {
    hubs: 0,
    signals: 0
  });
});

Template.viewControl.helpers({
  signalControlOn: function() {
    if (Session.get('currentContext') == 'signals') return 'on';
  },
  hubControlOn: function() {
    if (Session.get('currentContext') == 'hubs') return 'on';
  },
  filterCount: function () {
    var exploreConfig = JSON.parse(Session.get('exploreConfig'));
    var context = exploreConfig.context;
    return exploreConfig.filterCount[context];
  },
  contextString: function(){
    var context = JSON.parse(Session.get('exploreConfig')).context;
    return TAPi18n.__('viewControl.'+context);
  }
});

Template.viewControl.events({
  "click #control_sig": function(event, template){
    var exploreConfig = JSON.parse(Session.get('exploreConfig'));
    exploreConfig.context = 'signals';
    Session.set('exploreConfig', JSON.stringify(exploreConfig));
  },
  "click #control_hub": function(event, template){
    var exploreConfig = JSON.parse(Session.get('exploreConfig'));
    exploreConfig.context = 'hubs';
    Session.set('exploreConfig', JSON.stringify(exploreConfig));
  },
  "click #control_filters": function(event, template){
    event.stopImmediatePropagation();
    var target = $(filters);

    var showFilterPanel = !Session.get('showFilterPanel');

    if (showFilterPanel) {
      target.animate({ right: 20}, 350);
    } else {
      target.animate({ right: -350}, 350);
    }

    Session.set('showFilterPanel', showFilterPanel);
  }
});
