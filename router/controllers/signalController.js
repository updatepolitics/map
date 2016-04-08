SignalController = RouteController.extend({
  waitOn: function(){
    return Meteor.subscribe('signal', this.params._id);
  },
  data: function(){
    return Signals.findOne({
      _id: this.params._id
    });
  }
});
