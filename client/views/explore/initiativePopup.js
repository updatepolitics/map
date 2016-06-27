Template.initiativePopup.helpers({
  popupContent: function(){
    return JSON.parse(Session.get('popupContent'));
  }
});

Template.initiativePopup.events({
  "click #popup_x": function(event, template){
    Session.set('showPopup', false);
  }
});

Template.initiativePopup.onDestroyed(function(){
  Session.set('showPopup', false);
});
