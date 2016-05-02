Template.mapping.onCreated(function (){
  $('body').addClass('light_bg')
});

Template.mapping.onDestroyed(function (){
  $('body').removeClass('light_bg')
});
