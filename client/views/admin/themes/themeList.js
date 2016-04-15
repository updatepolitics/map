Template.themeList.onCreated(function (){
  this.subscribe('themes');
});


Template.themeList.helpers({
  themes: function() {
    return Themes.find({},{sort: {en: 1}});
  },
});

Template.themeList.events({
  'click .remove': function(event, template){
    Themes.remove({_id: this._id})
  }
});
