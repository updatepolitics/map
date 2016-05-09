Template.hubs.onCreated(function (){
  $('body').addClass('light_bg')
});

Template.hubs.onDestroyed(function (){
  $('body').removeClass('light_bg')
});

Template.hubs.helpers({
  natureList: function(){
    var language = TAPi18n.getLanguage();
    return Natures.find({}).map(function(nature){
      return {
        title: nature[language],
        description: nature["description_"+language],
        color: nature.color
      }
    });
  }
});
