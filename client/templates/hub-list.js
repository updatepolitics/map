Template.hubList.helpers({
  hubs: function() {
    return HubsCollection.find({},{});
  }
});
