MethodController = RouteController.extend({
  waitOn: function(){
    return Meteor.subscribe('method', this.params._id);
  },
  data: function(){
    return Methods.findOne({
      _id: this.params._id
    });
  }
});
