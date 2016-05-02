Template.hubs.onCreated(function (){
  $('body').addClass('light_bg')
});

Template.hubs.onDestroyed(function (){
  $('body').removeClass('light_bg')
});
