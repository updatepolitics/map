Template.listItem.helpers({
  originsLabel: function(){
    var language = TAPi18n.getLanguage();
    return this.labels[language].placesOfOrigin;
  },
  purposeLabel: function(){
    var language = TAPi18n.getLanguage();
    return this.labels[language].purpose;
  },
  incidencyReachLabel: function(){
    var language = TAPi18n.getLanguage();
    return this.labels[language].incidencyReach;
  },
  technologyTypeLabel: function(){
    var language = TAPi18n.getLanguage();
    return this.labels[language].technologyType;
  }
});

Template.listItem.events({
  "click #list_item": function(event, template){
    var showPopup = !Session.get('showPopup');
    Session.set('showPopup', showPopup);
  }
});
