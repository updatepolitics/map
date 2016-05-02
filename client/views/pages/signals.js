Template.signals.onCreated(function (){
  $('body').addClass('light_bg')
});

Template.signals.onDestroyed(function (){
  $('body').removeClass('light_bg')
});
