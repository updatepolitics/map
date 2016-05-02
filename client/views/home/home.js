Template.home.onRendered(function (){
  $('#update_logo').hide()
});

Template.home.onDestroyed(function (){
  $('#update_logo').show()
});

Template.home.events({
  "click #explore": function(event, template){
     Router.go('explore');
  }
});
