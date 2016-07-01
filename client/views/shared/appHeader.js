var dur = 350;

Template.appHeader.events({
  "click #menu_bt": function(event, template){
    $('#menu').animate({left:0}, 350, 'swing');
  },
  "click #update_logo": function(event) {
    Router.go('/');
  },
  "click .lang": function(event) {
    TAPi18n.setLanguage(this.id);
    Session.setPersistent('language', this.id);
  }
});

Template.appHeader.helpers({
  availableLanguages: function(){
    return _.map(_.keys(TAPi18n.getLanguages()), function(language){
      var item = { id: language };
      if (language == TAPi18n.getLanguage()) item.selected = 'selected';
      return item;
    });
  }
});
