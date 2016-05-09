Template.signals.onCreated(function (){
  $('body').addClass('light_bg')
});

Template.signals.onDestroyed(function (){
  $('body').removeClass('light_bg')
});


Template.signals.helpers({
  themesList: function(){
    var language = TAPi18n.getLanguage();
    return Themes.find({}).map(function(theme){
      return {
        title: theme[language],
        description: theme["description_"+language],
        color: theme.color
      }
    });
  },
  mechanismsList: function(){
    var language = TAPi18n.getLanguage();
    return Mechanisms.find({}).map(function(mechanism){
      return {
        title: mechanism[language],
        description: mechanism["description_"+language]
      }
    });
  }
});
