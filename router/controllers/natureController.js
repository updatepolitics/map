NatureController = RouteController.extend({
  waitOn: function(){
    return Meteor.subscribe('nature', this.params._id);
  },
  data: function(){
    return Natures.findOne({
      _id: this.params._id
    });
  }
});
