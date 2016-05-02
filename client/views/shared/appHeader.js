Template.appHeader.events({
  "click #menu_bt": function(event, template){
    $('#menu').animate({left:0}, 350, 'swing');
  },
  "click #update_logo": function(event) {
    Router.go('/');
  }
});
