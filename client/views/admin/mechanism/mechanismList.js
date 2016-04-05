Template.mechanismList.onCreated(function (){
  this.subscribe('mechanisms');
});


Template.mechanismList.helpers({
  mechanisms: function() {
    return Mechanisms.find({},{sort: {en: 1}});
  },
});
