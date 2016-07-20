Template.viewControl.onCreated(function(){
  Session.setDefault("showFilterPanel", false);
  Session.setDefault("filterCount", {
    hubs: 0,
    signals: 0
  });
});

Template.viewControl.helpers({
  signalControlOn: function() {
    var context = Session.get('currentContext');
    if (context == 'signals') return 'on';
  },
  hubControlOn: function() {
    var context = Session.get('currentContext');
    if (context == 'hubs') return 'on';
  },
  contextString: function(){
    var context = Session.get('currentContext');
    return TAPi18n.__('viewControl.'+context);
  },
  signalModeIconDiv: function(){
    var currentView = Router.current().route.getName();
    if (currentView == 'map') return 'selected';
    else return '';
  },
  hubsModeIconDiv: function(){
    var currentView = Router.current().route.getName();
    if (currentView == 'list') return 'selected';
    else return '';
  }
});

Template.viewControl.events({
  "click #control_sig": function(event, template){
    Session.set('currentContext', 'signals')
  },
  "click #control_hub": function(event, template){
    Session.set('currentContext', 'hubs')
  },
  "click #mode": function(){
    if (Router.current().route.getName() == 'list')
      Router.go('map');
    else
      Router.go('list');
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
  },
  "click #help_bt": function(event) {
    // toggle map help
    Session.set('mapHelpIsOpen', !Session.get('mapHelpIsOpen') );
  }
});
