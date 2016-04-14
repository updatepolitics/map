Template.themeList.onCreated(function (){
  this.subscribe('themes');
});


Template.themeList.helpers({
  themes: function() {
    return Themes.find({},{sort: {en: 1}});
  },
});
