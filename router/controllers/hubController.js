HubController = AdminController.extend({
  waitOn: function(){
    return Meteor.subscribe('hub', this.params._id);
  },
  data: function(){
    return Hubs.findOne({
      _id: this.params._id
    });
  }
});
