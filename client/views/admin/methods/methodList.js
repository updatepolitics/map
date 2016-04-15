Template.methodList.onCreated(function (){
  this.subscribe('methods');
});


Template.methodList.helpers({
  methods: function() {
    return Methods.find({},{sort: {en: 1}});
  },
});

Template.methodList.events({
  'click .remove': function(event, template){
    Methods.remove({_id: this._id})
  }
});
