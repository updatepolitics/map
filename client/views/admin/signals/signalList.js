Template.signalList.onCreated(function (){
  this.subscribe('signals');
  this.subscribe('signals');
  this.subscribe('natures');
  this.subscribe('origins');
});


Template.signalList.helpers({
  signals: function() {
    return Signals.find({},{sort: {name: 1}});
  },
  originToText: function(originId) {
    var origin = Origins.findOne({_id: originId});
    if (origin) return origin.en
    else return 'undefined';
  }
});

Template.signalList.events({
  'click .remove': function(event, template){
    Signals.remove({_id: this._id})
  }
});
