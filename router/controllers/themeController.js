ThemeController = RouteController.extend({
  waitOn: function(){
    return Meteor.subscribe('theme', this.params._id);
  },
  data: function(){
    return Themes.findOne({
      _id: this.params._id
    });
  }
});
