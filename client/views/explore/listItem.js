Template.listItem.helpers({
  context: function(){
    return Session.get('currentContext');
  }
});

Template.listItem.events({
  "click .list_item": function(event, template){
    var showPopup = !Session.get('showPopup');
    Session.set('showPopup', showPopup);
    if (showPopup) {
      Session.set('popupContent', JSON.stringify(this));
    }
  }
});
