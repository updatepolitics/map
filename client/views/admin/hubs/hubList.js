Template.hubList.onCreated(function (){
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
