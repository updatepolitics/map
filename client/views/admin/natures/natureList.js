Template.natureList.onCreated(function (){
  this.subscribe('natures');
});


Template.natureList.helpers({
  natures: function() {
    return Natures.find({},{sort: {en: 1}});
  },
});
