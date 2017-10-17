Template.tendencies.onCreated(function (){
  $('body').addClass('light_bg')
});

Template.tendencies.onDestroyed(function (){
  $('body').removeClass('light_bg')
});
