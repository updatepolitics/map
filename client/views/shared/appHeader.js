Template.appHeader.events({
  "click #menu_open_button": function(event, template){
    $('#menu').animate({left:0}, 350, 'swing');
  }
});
