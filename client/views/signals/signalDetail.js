Template.signalDetail.onCreated(function (){
  $('body').addClass('light_bg')
});

Template.signalDetail.onDestroyed(function (){
  $('body').removeClass('light_bg')
});

Template.signalDetail.helpers({
  getThemes: function(){
    var language = TAPi18n.getLanguage();
    return Themes.find( { _id: { $in: this.mainThemes } } ).map(function(theme){
      return {
        title: theme[language],
        description: theme["description_"+language],
        color: theme.color
      }
    });
  },
  getMechanisms: function(){
    var language = TAPi18n.getLanguage();
    var methods = Methods.find({ _id: { $in: this.methods }});
    var mechanismsIds = methods.map(function(method) { return method.mechanism });
    return Mechanisms.find({_id: {$in: mechanismsIds}}).map(function(mechanism){
      return {
        title: mechanism[language],
        description: mechanism['description_'+language],
        methodsString: methods.map(function(method) { return method[language] }).join(' , ')
      }
    });
  },
  getRelatedHubs: function(){
    return Hubs.find({ _id: {$in: this.parentHubs }});
  }
});

Template.signalDetail.events({
  "click .list": function(event, template){
    window.open(this.website, '_blank');
  },
  "click .initiative_back": function(event, template){
    history.back();
  }
});
