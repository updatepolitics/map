
Template.hubList.helpers({
  originToText: function(originId) {
    var origin = Origins.findOne({_id: originId});
    if (origin) return origin.en
    else return 'undefined';
  }
});

Template.hubList.events({
  'click .remove': function(event, template){
    Hubs.remove({_id: this._id})
  }
});
