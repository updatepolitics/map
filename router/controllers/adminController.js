AdminController = RouteController.extend({
  waitOn: function() {
    return Meteor.subscribe("users");
  },
  template: "admin",
  data: function() {
    return {
      users: Meteor.users.find({}, {
        limit: 20
      })
    }
  }
});
