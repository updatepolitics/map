Template.mechanismCreate.onCreated(function (){
  this.subscribe('methods');
});

Template.mechanismCreate.helpers({
  methodOptions: function(){
    return Methods.find({}, {sort: {en: 1}}).map(function (item) {
      return {label: item.en, value: item._id};
    });
  }
});
