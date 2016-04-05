MechanismController = RouteController.extend({
  waitOn: function(){
    return Meteor.subscribe('mechanism', this.params._id);
  },
  data: function(){
    return Mechanisms.findOne({
      _id: this.params._id
    });
  }
});
