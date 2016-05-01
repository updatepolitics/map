Template.viewControl.onCreated(function(){

  if (!Session.get('currentContext'))
    Session.set('currentContext', 'signals');  

});

Template.viewControl.helpers({
  signalControlOn: function() {
    if (Session.get('currentContext') == 'signals') return 'on';
  },
  hubControlOn: function() {
    if (Session.get('currentContext') == 'hubs') return 'on';
  }
});

Template.viewControl.events({
  "click #control_sig": function(event, template){
    Session.set('currentContext', 'signals');
  },
  "click #control_hub": function(event, template){
     Session.set('currentContext', 'hubs');
  }
});
