Template.methodEdit.onCreated(function (){
  this.subscribe('methods');
  this.subscribe('mechanisms');
});

Template.methodEdit.helpers({
  mechanismOptions: function(){
    return Mechanisms.find({}, {sort: {en: 1}}).map(function (c) {
      return {label: c.en, value: c._id};
    });
  }
});
