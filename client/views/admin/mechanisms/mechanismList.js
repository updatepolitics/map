Template.mechanismList.onCreated(function (){
  this.subscribe('mechanisms');
});


Template.mechanismList.helpers({
  mechanisms: function() {
    return Mechanisms.find({},{sort: {en: 1}});
  },
});


Template.mechanismList.events({
  'click .remove': function(event, template){
    Mechanisms.remove({_id: this._id})
  }
});
