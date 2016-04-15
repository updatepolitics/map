Template.natureList.onCreated(function (){
  this.subscribe('natures');
});


Template.natureList.helpers({
  natures: function() {
    return Natures.find({},{sort: {en: 1}});
  },
});

Template.natureList.events({
  'click .remove': function(event, template){
    Natures.remove({_id: this._id})
  }
});
