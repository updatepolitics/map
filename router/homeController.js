HomeController = RouteController.extend({
  waitOn: function() {
    return Meteor.subscribe("hubs");
  },
  template: "home",
  data: function() {
    return {
      hubs: HubsCollection.find({}, {
        limit: 20
      })
    }
  }
});
