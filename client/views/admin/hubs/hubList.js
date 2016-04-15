Template.hubList.onCreated(function (){
  this.subscribe('hubs');
  this.subscribe('natures');
  this.subscribe('origins');
});


Template.hubList.helpers({
  hubs: function() {
    return Hubs.find({},{sort: {name: 1}});
  },
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
