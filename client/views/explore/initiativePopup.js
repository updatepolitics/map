Template.initiativePopup.helpers({
  popupContent: function(){
    console.log('popupContent');
    var d = JSON.parse(Session.get('popupContent'));
    d.visible = (d.depth == 2) ? true : false;
    return d;
  }
});


Template.initiativePopup.events({
  "click #popup_x": function(event, template){
    Session.set('showPopup', false);
  }
});
