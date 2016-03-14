HubController = RouteController.extend({
  waitOn: function(){
    return Meteor.subscribe('hub', this.params._id);
  },
  template: 'hubShow',
  data: function(){
    return HubsCollection.findOne({
      _id: this.params._id
    });
  }
});
