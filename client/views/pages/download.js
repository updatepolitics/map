Template.download.onCreated(function (){
  $('body').addClass('light_bg')
});

Template.download.onDestroyed(function (){
  $('body').removeClass('light_bg')
});
